var comp = {}; 


comp.compile = function(st){
	if(!st) return st; 
	switch(st.type)	{
		case 'Program': 
		   return this.compileProgram(st); 
		case 'ExpressionStatement': 
		   return this.compileExprStmt(st); 
		case 'CallExpression':
		   return this.compileCallExpr(st); 
		case 'NewExpression': 
		   return this.compileConstructorCallExpr(st);  
		case 'ObjectExpression': 
		   return this.compileObjectExpr(st); 
		case 'AssignmentExpression': 
		   return  this.compileAssignmentExpr(st); 
		case 'Literal': 
		   return this.compileLiteralExpr(st); 
		case 'Identifier': 
		   return this.compileIdentifierExpr(st);   
		case 'MemberExpression': 
		   return this.compilePropLookUpExpr(st); 
		case 'ThisExpression': 
		   return this.compileThisExpr(st);
		case 'BinaryExpression': 
		   return this.compileBinOpExpr(st); 
		case 'LogicalExpression': 
		   return this.compileBinOpExpr(st); 
		case 'UnaryExpression': 
		   return this.compileUnOpExpr(st);
	   case 'BlockStatement':
	      return this.compileBlockStmt(st);
	   case 'WhileStatement': 
	      return this.compileWhileStmt(st); 
	   case 'IfStatement':
	      return this.compileIfStmt(st);  
	   case 'ReturnStatement': 
	      return this.compileReturnStmt(st);  
	   case 'FunctionExpression': 
	      return this.compileFunctionLiteralExpr(st); 
	   case 'VariableDeclaration': 
	      return null;  
	   case 'ArrayExpression': 
	      return this.compileArrayExpr(st);
	   case 'ForInStatement': 
	      return this.compileForInStmt(st);  
		default:  
		   if (!st.type) {
		   	throw new Error('Syntax Error - Illegal Program');
		   } else {
		   	throw new Error('Construct ' + st.type + ' is not supported yet');
		   }   
	}
};


/*
 * ********************************************************************************************************************
 * BASE CASES
 **********************************************************************************************************************
 */


comp.compileIdentifierExpr = function (ident_expr) {
   return $.extend(true, {}, ident_expr);
};

comp.compileLiteralExpr = function (literal_expr) {
   return $.extend(true, {}, literal_expr);
};

comp.compileThisExpr = function (this_expr) {
   return $.extend(true, {}, this_expr);
}; 

comp.compileUnOpExpr = function (un_op_expr) {
   return $.extend(true, {}, un_op_expr);	
}; 

comp.compileBinOpExpr = function (bin_op_expr) {
   return $.extend(true, {}, bin_op_expr);
}; 


/*
 **********************************************************************************************************************
 * RECURSIVE CASES
 * ********************************************************************************************************************
 */


/*
 * Original code: s
 *   s = var x_0, ..., x_n; s' 
 *   C[s'] = s'', new_vars               
 * Compiled code: 
 *   var _pc, _ret, _lev_ctxt, new_vars; 
 *   var x_0, ..., x_n;
 *   _pc = _runtime.lat.bot; 
 *   s'' 
 * Runtimes: lat, lat.bot
 */
comp.compileProgram = function (st) {
	var compiled_stmt, 
	    compiled_stmts = [],
	    new_vars = [], 
	    i,
	    len,
	    original_vars_decl, 
	    stmts = st.body;
	     
	if (st.type !== esprima.Syntax.Program) {
	  throw new Error('Trying to compile program statement with non program');
	}
	
	i = stmts.length; 
	while (i--) {
		compiled_stmt = this.compile(stmts[i]);
		if (!compiled_stmt) {
		   continue; 
		} 
		if (compiled_stmt.hasOwnProperty('compiled_stmts')) {
		      compiled_stmts = compiled_stmt.compiled_stmts.concat(compiled_stmts);
		      new_vars = new_vars.concat(compiled_stmt.new_vars);
		} else {
	      compiled_stmts.shift(compiled_stmt);
		} 
	}
	
	original_vars_decl = this.utils.getProgDeclarations(st); 
	
	return this.createCompiledProgram(compiled_stmts, new_vars, original_vars_decl); 
}; 


comp.createCompiledProgram = function (compiled_stmts, new_vars, original_vars_decl) {
   var assignment_pc, compiled_prog_stmts = [], create_shadow_window_props_stmt, internal_vars_decl, new_vars_str, str;
   
   //Compute the declaration of the compiler's internal variables
   //var  new_vars(s'); 
   new_vars_str = this.utils.newVarsToString(new_vars);
   if (comp._support_eval) {
      str = comp.identifiers.consts.INSPECTOR_IDENT + ', '; 
   } else {
      str = ''; 
   }
   str += comp.identifiers.consts.PC_IDENT + ', ' + comp.identifiers.consts.LEV_CTXT_IDENT 
      + ', ' + comp.identifiers.consts.RET_IDENT + ';';  
   if (new_vars_str) {
      str = new_vars_str + ', ' + str; 
   } else {
      str = 'var ' + str; 
   }
   internal_vars_decl = window.util.parseStmt(str);
   compiled_prog_stmts.push(internal_vars_decl); 
   compiled_prog_stmts = compiled_prog_stmts.concat(original_vars_decl);   
   
   // _runtime.createShadowWindowProperties()
   str =  comp.identifiers.consts.RUNTIME_IDENT + '.createShadowWindowProperties(); ';
   create_shadow_window_props_stmt = window.util.parseStmt(str);
   compiled_prog_stmts.push(create_shadow_window_props_stmt); 
   
   compiled_prog_stmts = compiled_prog_stmts.concat(compiled_stmts);
	
   return esprima.delegate.createProgram(compiled_prog_stmts);  
}; 


comp.compileBlockStmt = function(st) {
   var compiled_stmt, 
       compiled_stmts = [], 
       i, 
       len, 
       new_vars = [], 
       stmts = st.body;

   i = stmts.length;
   while (i--) {
      compiled_stmt = this.compile(stmts[i]);
      if (!compiled_stmt) {
		   continue; 
		} 
      if (compiled_stmt.hasOwnProperty('compiled_stmts')) {
         compiled_stmts = compiled_stmt.compiled_stmts.concat(compiled_stmts);
         new_vars = new_vars.concat(compiled_stmt.new_vars);
      } else {
         compiled_stmts.shift(compiled_stmt);  
      }
   }
   
   return {
   	compiled_stmts: [ window.esprima.delegate.createBlockStatement(compiled_stmts) ],
   	new_vars: new_vars 
   }; 
};


comp.compileExprStmt = function(expr_stmt) {
   var compiled_st, requires_type_constraint, identifiers, stmts = [], type;
   type = expr_stmt.expression.type;   
   compiled_st = comp.compile(expr_stmt.expression);
   requires_type_constraint = (type === 'BinaryExpression') || (type === 'UnaryExpression') && (type === 'LogicalExpression'); 
   if (!compiled_st.hasOwnProperty('compiled_stmts')) {
      identifiers = comp.utils.getAllIdentifiers(expr_stmt.expression);
      if (((identifiers.length > 1) || requires_type_constraint) && comp._support_coercions) {
         stmts.push(comp.buildSameTypeConstraint(identifiers)); 
      }
      stmts.push(window.esprima.delegate.createExpressionStatement(compiled_st));
      compiled_st = {
   	     compiled_stmts: stmts, 
   	     new_vars: [ ]
      }; 
   }
   return compiled_st;
}; 


comp.compileAssignmentExpr = function (assign_expr) {
   if (assign_expr.left.type == 'MemberExpression') {
      return this.compilePropertyUpdateExpr(assign_expr);  
   } else {
   	return this.compileVarAssignmentExpr(assign_expr); 
   }
}; 


/*
 * Property Look-Up Expression
 * Original Code: o[ê] 
 * Compilied Code:
 * _iflow_sig = _runtime.api_register.getIFlowSig(o, ê, 'prop_updt');  
 * if(_iflow_sig) {  
 * } else {
 * }
 */
comp.compilePropertyUpdateExpr = function (prop_updt_expr) {
   var assign_iflow_sig_stmt, 
       compiled_instrumented_prop_updt_expr_stmts, 
       compiled_if, 
       compiled_uninstrumented_prop_updt_expr_stmts,
       obj_ident, 
       prop_ident, 
       stmts = [], 
       str;
   
   compiled_instrumented_prop_updt_expr_stmts = this.compileInstrumentedPropertyUpdateExpr(prop_updt_expr); 
   if (!comp._support_apis) {
      return { compiled_stmts: compiled_instrumented_prop_updt_expr_stmts, new_vars: [ ] }; 
   }
        
   obj_ident = (prop_updt_expr.left.object.type === 'Identifier') ? prop_updt_expr.left.object.name : 'this';
   prop_ident = (prop_updt_expr.left.property.type === 'Identifier') ? prop_updt_expr.left.property.name : prop_updt_expr.left.property.raw; 
   
   //_iflow_sig = _runtime.api_register.getIFlowSig(o, ê, 'prop_updt'); 
   str = '{0} = {1}.api_register.getIFlowSig({2}, {3}, \'prop_updt\');'; 
   str = $.validator.format(str, 
      comp.identifiers.consts.IFLOW_SIG_IDENT, 
	  comp.identifiers.consts.RUNTIME_IDENT,
	  obj_ident, 
	  prop_ident);
   assign_iflow_sig_stmt = window.util.parseStmt(str);
   stmts.push(assign_iflow_sig_stmt); 
   
   // if(_iflow_sig) {  } else {  }
   str = 'if({0}) {} else {}'; 
   str = $.validator.format(str, this.identifiers.consts.IFLOW_SIG_IDENT); 
   compiled_if = window.util.parseStmt(str);
   stmts.push(compiled_if);  

   compiled_uninstrumented_prop_updt_expr_stmts = this.compileUnInstrumentedPropertyUpdateExpr(prop_updt_expr);
   compiled_instrumented_prop_updt_expr_stmts = this.compileInstrumentedPropertyUpdateExpr(prop_updt_expr); 
	
   compiled_if.consequent.body = compiled_uninstrumented_prop_updt_expr_stmts; 
   compiled_if.alternate.body = compiled_instrumented_prop_updt_expr_stmts;
	
   return { compiled_stmts: stmts, new_vars: [ ] };
}; 


/*  
 * Original Code:  o[ê_0] = ê_1
 *  _lev_ctx = _runtime.lat.lub(_lev_o, _pc, C_l[ê_0]);  
 *  _iflow_sig._enforce(o, ê_0, ê_1, _runtime.lat.lub(_lev_ctxt, C_l[ê_1]), _lev_ctxt); 
 *  o[ê_0] = ê_1; 
 *  o[_runtime.shadow(ê_0)] = _iflow_sig._updtLab(o, ê_0, ê_1, _runtime.lat.lub(_lev_ctxt, C_l[ê_1]), _lev_ctxt);
 */ 
comp.compileUnInstrumentedPropertyUpdateExpr = function (prop_updt_expr) {
   var assign_ctxt_lev_stmt,
       assign_prop_lev_stmt, 
       assign_prop_val_stmt,
       enforce_stmt, 
       obj_ident, 
       prop_expr_str, 
       stmts = [], 
       str, 
       val_expr_str,
       val_lev_expr, 
       val_lev_expr_str;  
   
   obj_ident = (prop_updt_expr.left.object.type === 'Identifier') ? prop_updt_expr.left.object.name : 'this';
   prop_expr_str = (prop_updt_expr.left.property.type === 'Identifier') ? prop_updt_expr.left.property.name : prop_updt_expr.left.property.raw;
   val_expr_str = window.util.printExprST(prop_updt_expr.right);
   val_lev_expr = comp.level.compile(prop_updt_expr.right, comp.identifiers.consts.LEV_CTXT_IDENT);
   val_lev_expr_str = window.util.printExprST(val_lev_expr);
   
   // _lev_ctx = _runtime.lat.lub(_lev_o, _pc, C_l[ê_0]); 
   assign_ctxt_lev_stmt = window.esprima.delegate.createAssignmentExpression('=', 
      window.esprima.delegate.createIdentifier(comp.identifiers.consts.LEV_CTXT_IDENT), 
      comp.level.compile(prop_updt_expr.left));
   assign_ctxt_lev_stmt = window.esprima.delegate.createExpressionStatement(assign_ctxt_lev_stmt); 
   stmts.push(assign_ctxt_lev_stmt);
   
   // _iflow_sig._enforce(o, ê_0, ê_1, _runtime.lat.lub(_lev_ctxt, C_l[ê_1]), _lev_ctxt); 
   str = '{0}._enforce({1}, {2}, {3}, {4}, {5});'; 
   str = $.validator.format(str,
      comp.identifiers.consts.IFLOW_SIG_IDENT, 
      obj_ident, 
      prop_expr_str, 
      val_expr_str, 
      val_lev_expr_str, 
      comp.identifiers.consts.LEV_CTXT_IDENT);
   enforce_stmt = window.util.parseStmt(str); 
   stmts.push(enforce_stmt); 
   
   //o[ê_0] = ê_1; 
   assign_prop_val_stmt = window.esprima.delegate.createExpressionStatement($.extend(true, {}, prop_updt_expr));
   stmts.push(assign_prop_val_stmt);
   
   //o[_runtime.shadow(ê_0)] = _iflow_sig._updtLab(o, ê_0, ê_1, _runtime.lat.lub(_lev_ctxt, C_l[ê_1]), _lev_ctxt);
   str = '{0}[{1}.shadow({2})] = {3}._updtLab({0}, {2}, {4}, {5}, {6});'; 
   str = $.validator.format(str,
      obj_ident, 
      comp.identifiers.consts.RUNTIME_IDENT,
      prop_expr_str, 
      comp.identifiers.consts.IFLOW_SIG_IDENT, 
      val_expr_str, 
      val_lev_expr_str, 
      comp.identifiers.consts.LEV_CTXT_IDENT);
   assign_prop_lev_stmt = window.util.parseStmt(str); 
   stmts.push(assign_prop_lev_stmt); 
   
   return stmts; 
}; 


/*
 * Original Code: o[ê_0] = ê_1 
 * Compilied Code:
 * if(_runtime.hasOwnProperty(o, ê_0)) {
 *    C_enf[_runtime.lat.lub(_lev_o, C_l[ê_0]), o[_runtime.shadow(ê_0)]]	
 * } else {
 *    _runtime.defineProperty(o, _runtime.shadow(ê_0), {enumerable: false, value: _runtime.lat.bot});
 *    C_enf[_runtime.lat.lub(_lev_o, C_l[ê_0]), o._lev_struct]
 * }
 * o[_runtime.shadow(ê_0)] = _runtime.lat.lub(_lev_o, C_l[ê_0], C_l[ê_1]); 
 * o[ê_0] = ê_1; 
 */
comp.compileInstrumentedPropertyUpdateExpr = function (prop_updt_expr) {
	var assign_shadow_prop_stmt,
	    copy_prop_assignment_stmt,
	    enforce_left_expr_str, 
	    enforce_right_expr_str, 
	    identifiers,
	    if_stmt,
	    forbid_shadow_prop_enumeration_stmt,
	    member_shadow_prop_expr,
	    obj_ident,
	    prop_ident, 
	    stmts = [],
	    str,
	    updated_prop_lev_expr; 

   obj_ident = (prop_updt_expr.left.object.type === 'Identifier') ? prop_updt_expr.left.object.name : 'this';
   prop_ident = (prop_updt_expr.left.property.type === 'Identifier') ? prop_updt_expr.left.property.name : prop_updt_expr.left.property.raw; 
   copy_prop_assignment_stmt = window.esprima.delegate.createExpressionStatement($.extend(true, {}, prop_updt_expr)); 
  
   // generate same type constraint   
   identifiers = comp.utils.getAllIdentifiers(prop_updt_expr.right);
   if ((identifiers.length > 1) && comp._support_coercions) 
      stmts.push(comp.buildSameTypeConstraint(identifiers)); 
   
   // buildPrimitiveTypeConstraint
   if ((prop_updt_expr.left.property.type === 'Identifier') && comp._support_coercions) {
      stmts.push(comp.buildPrimitiveTypeConstraint(prop_ident));
   }
   
   // if(_runtime.hasOwnProperty(o, ê_0)) { } else { }
   str = 'if({0}.hasOwnProperty({1}, {2})) { } else { }'; 
   str = $.validator.format(str, 
      comp.identifiers.consts.RUNTIME_IDENT,
      obj_ident, 
      prop_ident); 
   if_stmt = window.util.parseStmt(str);
   stmts.push(if_stmt); 
   
   // _runtime.defineProperty(o, _runtime.shadow(ê_0), {enumerable: false, value: _runtime.lat.bot});
   str = '{0}.defineProperty({1}, {0}.shadow({2}), {enumerable: false, value: {0}.lat.bot, writable: true});';
   str = $.validator.format(str, 
      comp.identifiers.consts.RUNTIME_IDENT,
      obj_ident, 
      prop_ident); 
   forbid_shadow_prop_enumeration_stmt = window.util.parseStmt(str);
   if_stmt.alternate.body.push(forbid_shadow_prop_enumeration_stmt); 
   
   // C_enf[_runtime.lat.lub(_lev_o, C_l[ê_0]), o._lev_struct]
   updated_prop_lev_expr = comp.level.compilePropLookUpExpr(prop_updt_expr.left);
   enforce_left_expr_str = window.util.printExprST(updated_prop_lev_expr);
   enforce_right_expr_str = obj_ident + '.' + comp.identifiers.consts.STRUCT_PROP_IDENT;
   if_stmt.alternate.body.push(this.compileEnforcement(enforce_left_expr_str, enforce_right_expr_str)); 
   
   // C_enf[_runtime.lat.lub(_lev_o, C_l[ê_0]), o[_runtime.shadow(ê_0)]]
   str = '{0}[{1}.shadow({2})]';
   str = $.validator.format(str, 
      obj_ident,
      comp.identifiers.consts.RUNTIME_IDENT, 
      prop_ident); 
   enforce_right_expr_str = str; 
   if_stmt.consequent.body.push(this.compileEnforcement(enforce_left_expr_str, enforce_right_expr_str)); 
   	
   // o[ê_0] = ê_1;
   stmts.push(copy_prop_assignment_stmt); 
   
   // o[_runtime.shadow(ê_0)] = _runtime.lat.lub(_lev_o, C_l[ê_0], C_l[ê_1]); 
   member_shadow_prop_expr = window.util.parseExpr(str);
   updated_prop_lev_expr.arguments.push(comp.level.compile(prop_updt_expr.right)); 
   assign_shadow_prop_stmt = window.esprima.delegate.createAssignmentExpression('=', member_shadow_prop_expr, updated_prop_lev_expr);
   assign_shadow_prop_stmt = window.esprima.delegate.createExpressionStatement(assign_shadow_prop_stmt);
   stmts.push(assign_shadow_prop_stmt);
  
   return stmts; 
}; 


comp.compileVarAssignmentExpr = function (var_assignment_exp) {
   var compiled_right_side, original_right_side;

   original_right_side = var_assignment_exp.right; 
   compiled_right_side = this.compile(original_right_side); 
   
   if (compiled_right_side.hasOwnProperty('compiled_stmts')) {
      // right side is a simple expression
      return this.compileIndexedVarAssignmentExpr(var_assignment_exp.left.name, original_right_side, compiled_right_side); 	
   } else {
      // right side an indexed simple expression
   	  return this.compileSimpleVarAssignmentExpr(var_assignment_exp.left.name, original_right_side, compiled_right_side); 
   }
};


/*
 * Original Code: x = e, where e is an indexed expression
 * C[ê] = s, _vali, _levi
 * Compiled Code: 
 * s
 * _lev_x = _lev_i; 
 * x = _val_i; 
 */
comp.compileIndexedVarAssignmentExpr = function (ident, original_right_side, compiled_right_side) {
   var assing_lev_stmt, assign_val_stmt, enforcement_stmt, str; 
   
   // C_enf[_pc, _lev_x]
   if(!comp.normalization_vars_table.hasOwnProperty(ident)) {
      enforcement_stmt = this.compileEnforcement(
         comp.identifiers.consts.PC_IDENT,
         comp.identifiers.getShadowVar(ident));
      compiled_right_side.compiled_stmts.push(enforcement_stmt);     
   }
   
   // _lev_x = _lev_i;
   str = '{0} = {1};';
   str = $.validator.format(str, comp.identifiers.getShadowVar(ident), compiled_right_side.new_vars[0].lev_var);
   assing_lev_stmt = window.util.parseStmt(str);
   compiled_right_side.compiled_stmts.push(assing_lev_stmt); 
   
   //x = _vali;
   str = '{0} = {1};'; 
   str = $.validator.format(str, ident, compiled_right_side.new_vars[0].val_var);
   assign_val_stmt = window.util.parseStmt(str);
   compiled_right_side.compiled_stmts.push(assign_val_stmt);
   
   return compiled_right_side;     
}; 


/*
 * Original Code: x = ê, where ê is simple
 * Compiled Code: 
 * _lev_x = C_l[ê];  
 * x = ê; 
 */
comp.compileSimpleVarAssignmentExpr = function (ident, original_right_side, compiled_right_side) {
   var assign_lev_stmt, assign_val_stmt, enforcement_stmt, identifiers, stmts = [];

   // generate same type constraint   
   if (comp.applyPrimitiveTypeConstraint(original_right_side)) {
      identifiers = comp.utils.getAllIdentifiers(original_right_side);
      if ((identifiers.length > 1) && comp._support_coercions) 
         stmts.push(comp.buildSameTypeConstraint(identifiers));
   } 

   // C_enf[_pc, _lev_x]
   if(!comp.normalization_vars_table.hasOwnProperty(ident)) {
      enforcement_stmt = this.compileEnforcement(
         comp.identifiers.consts.PC_IDENT,
         comp.identifiers.getShadowVar(ident));
      stmts.push(enforcement_stmt);     
   }
   
   //_lev_ctxt = C_l[ê];
   assign_lev_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(comp.identifiers.getShadowVar(ident)), 
   	  comp.level.compile(original_right_side));
   assign_lev_stmt = window.esprima.delegate.createExpressionStatement(assign_lev_stmt);	 
   stmts.push(assign_lev_stmt);
   
   // x = ê; 
   assign_val_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(ident), 
   	  compiled_right_side);
   assign_lev_stmt = window.esprima.delegate.createExpressionStatement(assign_val_stmt);	
   stmts.push(assign_lev_stmt);
   
   return { compiled_stmts: stmts, new_vars: [ ] };     	
};


/*
 * Property Look-Up Expression
 * Original Code: o[ê] 
 * Compilied Code:
 * _iflow_sig = _runtime.api_register.getIFlowSig(o, ê, 'prop_lookup');  
 * _lev_ctxt = _runtime.lat.lub(_lev_o, C_l[ê]);
 * if(_iflow_sig) {
 *    _iflow_sig._enforce(o, ê, _lev_ctxt); 
 *    _val_i = o[ê]; 
 *    _lev_i = _iflow_sig._updtLab(_val_i, o, ê, _lev_ctxt);  
 * } else {
 *    C_lookup[o, ê, i]
 *    _val_i = o[ê]; 
 *    _lev_i = _runtime.lat.lub(_lev_ctxt, _lev_i);  
 * }
 */
comp.compilePropLookUpExpr = function (prop_lookup_expr) {
   var assign_iflow_sig_stmt,
       assign_lev_ctxt_stmt, 
       compiled_if,
	   compiled_uninstrumented_lookup_expr_stmts,
	   compiled_instrumented_lookup_stmts,
	   obj_ident, 
	   prop_expr, 
	   prop_expr_str,
	   stmts = [], 
	   str,
	   val_lev_vars; 
   
   val_lev_vars = comp.identifiers.getFreeValLevVars();
   compiled_instrumented_lookup_expr_stmts = this.compileInstrumentedLookUpExpr(prop_lookup_expr, val_lev_vars); 	
   
   obj_ident = prop_lookup_expr.object.name;
   prop_expr = $.extend(true, {}, prop_lookup_expr.property);
   prop_expr_str = window.util.printExprST(prop_expr);
   
   // buildPrimitiveTypeConstraint
   if ((prop_lookup_expr.property.type === 'Identifier') && comp._support_coercions) {
      stmts.push(comp.buildPrimitiveTypeConstraint(prop_lookup_expr.property.name));
   }
   
   //_lev_ctxt = _runtime.lat.lub(_lev_o, _pc [, _lev_p]);
   assign_lev_ctxt_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(comp.identifiers.consts.LEV_CTXT_IDENT), 
   	  comp.level.compilePropLookUpExpr(prop_lookup_expr));
   assign_lev_ctxt_stmt = window.esprima.delegate.createExpressionStatement(assign_lev_ctxt_stmt);	  
   stmts.push(assign_lev_ctxt_stmt);   
   
   if (!comp._support_apis) {
      stmts = stmts.concat(compiled_instrumented_lookup_expr_stmts);
      return  {
         compiled_stmts: stmts,
         new_vars: [ val_lev_vars ]
      };
   }
   
   //_iflow_sig = _runtime.api_register.getIFlowSig(o, ê, 'prop_lookup'); 
   str = '{0} = {1}.api_register.getIFlowSig({2}, {3}, \'prop_lookup\');'; 
   str = $.validator.format(str, 
      comp.identifiers.consts.IFLOW_SIG_IDENT, 
	  comp.identifiers.consts.RUNTIME_IDENT,
	  obj_ident, 
	  prop_expr_str);
   assign_iflow_sig_stmt = window.util.parseStmt(str);
   stmts.push(assign_iflow_sig_stmt); 
	            
   // if(_iflow_sig) {  } else {  }
   str = 'if({0}) {} else {}'; 
   str = $.validator.format(str, this.identifiers.consts.IFLOW_SIG_IDENT); 
   compiled_if = window.util.parseStmt(str);
   stmts.push(compiled_if);  

   compiled_uninstrumented_lookup_expr_stmts = this.compileUnInstrumentedLookUpExpr(prop_lookup_expr, val_lev_vars);
	
   compiled_if.consequent.body = compiled_uninstrumented_lookup_expr_stmts; 
   compiled_if.alternate.body = compiled_instrumented_lookup_expr_stmts;
	
   return {
      compiled_stmts: stmts,
      new_vars: [ val_lev_vars ]
   };
};



/* Original Code: x[ê]
   Compiled Code: 
   _val_i = x[ê]; 
   _lev_i = _runtime.lat.lub(_lev_ctxt, _lev_i);
*/ 
comp.compileInstrumentedLookUpExpr = function (prop_lookup_expr, val_lev_vars) {
   var assign_lev_stmt,
       assign_prop_stmt,
       prop_ident,
       stmts,
       str; 
   
   prop_ident = (prop_lookup_expr.property.type==='Identifier') ? prop_lookup_expr.property.name : prop_lookup_expr.property.raw;
   stmts = comp.compilePropChainLookUpLev(prop_lookup_expr.object.name, prop_ident, val_lev_vars); 

   // _val_i = x[ê];
   assign_prop_stmt = window.esprima.delegate.createAssignmentExpression('=',
      window.esprima.delegate.createIdentifier(val_lev_vars.val_var),  
	  $.extend(true, {}, prop_lookup_expr)); 
   assign_prop_stmt = window.esprima.delegate.createExpressionStatement(assign_prop_stmt);
   stmts.push(assign_prop_stmt); 	 
	 
   // _lev_i = _runtime.lat.lub(_lev_ctxt, _lev_i);
   str = '{0} = {1}.lat.lub({2}, {3});'; 
   str = $.validator.format(str, 
      val_lev_vars.lev_var, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      comp.identifiers.consts.LEV_CTXT_IDENT, 
      val_lev_vars.lev_var); 
   assign_lev_stmt = window.util.parseStmt(str);
   stmts.push(assign_lev_stmt);
	
   return stmts; 
};


/*
   _iflow_sig._enforce(x, ê, _lev_ctxt); 
   _val_i = x[ê]; 
   _lev_i = _iflow_sig._updtLab( _val_i, x, ê, _lev_ctxt); 
*/
comp.compileUnInstrumentedLookUpExpr = function (prop_lookup_expr, val_lev_vars) {
   var enforce_stmt, 
       obj_ident, 
       prop_expr, 
       prop_expr_str, 
       prop_lookup_expr,
       str,
       val_assignment_stmt, 
       lev_assignment_stmt;  

   prop_lookup_expr = $.extend(true, {}, prop_lookup_expr);
   obj_ident = prop_lookup_expr.object.name;
   prop_expr = $.extend(true, {}, prop_lookup_expr.property);
   prop_expr_str = window.util.printExprST(prop_expr);

   // _iflow_sig._enforce(x, ê, _lev_ctxt); 
   str = '{0}._enforce({1}, {2}, {3});'; 
   str = $.validator.format(str, 
      comp.identifiers.consts.IFLOW_SIG_IDENT, 
      obj_ident, 
      prop_expr_str,
      comp.identifiers.consts.LEV_CTXT_IDENT);
   enforce_stmt = window.util.parseStmt(str);

   // _val_i = x[ê]; 
   val_assignment_stmt = window.esprima.delegate.createAssignmentExpression(
      '=',
      window.esprima.delegate.createIdentifier(val_lev_vars.val_var),  
      prop_lookup_expr); 
   val_assignment_stmt = window.esprima.delegate.createExpressionStatement(val_assignment_stmt);
	
   // _lev_i = _iflow_sig._updtLab(_val_i, x, ê, _lev_ctxt);
   str = '{0} = {1}._updtLab({2}, {3}, {4}, {5});';
   str = $.validator.format(str, 
      val_lev_vars.lev_var, 
      comp.identifiers.consts.IFLOW_SIG_IDENT, 
      val_lev_vars.val_var,
      obj_ident, 
      prop_expr_str, 
      comp.identifiers.consts.LEV_CTXT_IDENT);
   lev_assignment_stmt = window.util.parseStmt(str);
   
   return [
      enforce_stmt, 
      val_assignment_stmt, 
      lev_assignment_stmt
   ];
};


/*
 * Original Code: {} 
 * Compilied Code:
 * _val_i = _runtime.create(null, _pc); 
 * _lev_i = _pc; 
 */
comp.compileObjectExpr = function (obj_expr) {
   var assign_val_stmt, 
       assign_lev_stmt, 
       str, 
       val_lev_vars; 
        
   val_lev_vars = this.identifiers.getFreeValLevVars();
   
   // _val_i = _runtime.create(null, _pc);
   str = '{0} = {1}.create(null, {2});';
   str = $.validator.format(str, 
      val_lev_vars.val_var, 
      comp.identifiers.consts.RUNTIME_IDENT,
      comp.identifiers.consts.PC_IDENT);  
   assign_val_stmt = window.util.parseStmt(str);
   
   // _lev_i = _pc;
   str = '{0} = {1};';
   str = $.validator.format(str, val_lev_vars.lev_var, this.identifiers.consts.PC_IDENT);  
   assign_lev_stmt = window.util.parseStmt(str);
   
   return {
      compiled_stmts: [
         assign_val_stmt, 
         assign_lev_stmt
      ], 
      new_vars: [ val_lev_vars ]
   };
}; 


/*
 * Original Code: [] 
 * Compilied Code:
 * _val_i = _runtime.create(_runtime.array_prototype, _pc); 
 * _lev_i = _pc; 
 */
comp.compileArrayExpr = function (obj_expr) {
   var assign_val_stmt, 
       assign_lev_stmt, 
       str, 
       val_lev_vars; 
       
   val_lev_vars = this.identifiers.getFreeValLevVars();
   
   // _val_i = _runtime.create(_runtime.array_prototype, _pc); 
   str = '{0} = {1}.create({1}.array_prototype, {2});';
   str = $.validator.format(str, 
      val_lev_vars.val_var,
      comp.identifiers.consts.RUNTIME_IDENT,
      comp.identifiers.consts.PC_IDENT);  
   assign_val_stmt = window.util.parseStmt(str);
   
   // _levi = _pc; 
   str = '{0} = {1};';
   str = $.validator.format(str, val_lev_vars.lev_var, this.identifiers.consts.PC_IDENT);  
   assign_lev_stmt = window.util.parseStmt(str);
   
   return {
      compiled_stmts: [
         assign_val_stmt, 
         assign_lev_stmt
      ], 
      new_vars: [ val_lev_vars ]
   };
}; 


comp.compileCallExpr = function (call_expr) {
	switch (call_expr.callee.type) { 
	   case 'Identifier':
	      switch (call_expr.callee.name) {
	      	case 'upgVar':          return this.compileUpgdVarExpr(call_expr); 
	      	case 'upgProp':         return this.compileUpgdPropExpr(call_expr); 
	      	case 'upgStruct':       return this.compileUpgdStructExpr(call_expr); 
	        default:                return this.compileFunCallExpr(call_expr);	
	      }
	   case 'MemberExpression': return this.compileMethodCallExpr(call_expr); 
	   default: throw new Error('Invalid Method Call'); 
	}
}; 

   


/*
 * Original code: upgVar(x, 'l')
 * Compiled code:
 *  C_enf[_pc, _lev_x]
 *   _lev_x = _runtime.lat.lub(_lev_x, 'l');
 */
comp.compileUpgdVarExpr = function (call_exp_st) {
   var assign_new_lev_stmt, ident, shadow_ident, str;
   
   ident = call_exp_st.arguments[0].name;
   shadow_ident = comp.identifiers.getShadowVar(ident);
   	    
   //C_enf[_pc, _lev_x]
   enforcement_stmt = this.compileEnforcement(
      comp.identifiers.consts.PC_IDENT,
      shadow_ident);
   
   // _lev_x = _runtime.lat.lub(_lev_x, l);
   str = '{0} = {1}.lat.lub({0}, {2})';
   str = $.validator.format(str,
      shadow_ident, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      call_exp_st.arguments[1].raw);
   assign_new_lev_stmt = window.util.parseStmt(str);
   
   return {
      compiled_stmts: [ enforcement_stmt, assign_new_lev_stmt ],
      new_vars: [ ]
   };
};


/*
 * Original code: upgProp(o, 'p', 'l')
 * Compiled code: 
 *   if (_runtime.hasOwnProperty(o, _runtime.shadow(p))){
 *      C_enf[_runtime.lat.lub(_lev_o, _pc), o._lev_p]
 *      o._lev_p = _runtime.lat.lub(o._lev_p, 'l')
 *   } else {
 *      _runtime.diverge(); 
 *   }   
 */
comp.compileUpgdPropExpr = function (call_exp_st) {
	var compiled_upg_prop_stmt, enforce_stmt, left_enforce_expr_str, right_enforce_expr_str, str; 
	
   // if (_runtime.hasOwnProperty(o, _runtime.shadow(p))){   o._lev_p  = _runtime.lat.lub(o._lev_p, 'l');
   // } else { _runtime.diverge(); }
   str = 'if ({0}.hasOwnProperty({1}, {0}.shadow({2}))) {{1}.{3} = {0}.lat.lub({1}.{3}, {4});  } else { {0}.diverge(\'Illegal Upgrade\'); }';
   str = $.validator.format(str,
      comp.identifiers.consts.RUNTIME_IDENT,
      call_exp_st.arguments[0].name,  
      call_exp_st.arguments[1].raw,
      comp.identifiers.getShadowVar(call_exp_st.arguments[1].value), 
      call_exp_st.arguments[2].raw);
   compiled_upg_prop_stmt = window.util.parseStmt(str);

   // C_enf[_runtime.lat.lub(_lev_o, _pc), o._lev_p]
   left_enforce_expr_str = window.util.printExprST(comp.level.compileIdentifierExpr(call_exp_st.arguments[0].name));
   right_enforce_expr_str = call_exp_st.arguments[0].name + '.' + comp.identifiers.getShadowVar(call_exp_st.arguments[1].value);
   enforce_stmt = comp.compileEnforcement(left_enforce_expr_str, right_enforce_expr_str); 
   compiled_upg_prop_stmt.consequent.body.unshift(enforce_stmt); 
   
   return {
      compiled_stmts: [ compiled_upg_prop_stmt ],
      new_vars: [ ]
   };
};


/*
 * Original code: upgStruct(o, 'l')
 * Compiled code: 
 *    C_enf[_runtime.lat.lub(_lev_o, _pc), o._lev_struct]
 *    o._lev_struct = _runtime.lat.lub(o._lev_struct, 'l')
 */
comp.compileUpgdStructExpr = function (call_exp_st) {
   var compiled_upg_struct_stmt, enforce_stmt, left_enforce_expr_str, right_enforce_expr_str, str; 
   
   //o._lev_struct = _runtime.lat.lub(o._lev_struct, 'l')
   str = '{0}.{1} = {2}.lat.lub({0}.{1}, {3});';
   str = $.validator.format(str, 
      call_exp_st.arguments[0].name, 
      comp.identifiers.consts.STRUCT_PROP_IDENT, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      call_exp_st.arguments[1].raw); 
   compiled_upg_struct_stmt = window.util.parseStmt(str);
   
   // C_enf[_runtime.lat.lub(_lev_o, _pc), o._lev_struct]
   left_enforce_expr_str = window.util.printExprST(comp.level.compileIdentifierExpr(call_exp_st.arguments[0].name));
   right_enforce_expr_str = call_exp_st.arguments[0].name + '.' + comp.identifiers.consts.STRUCT_PROP_IDENT;
   enforce_stmt = comp.compileEnforcement(left_enforce_expr_str, right_enforce_expr_str); 
      
   return {
      compiled_stmts: [ enforce_stmt, compiled_upg_struct_stmt ],
      new_vars: [ ]
   };
};


/*
 * Function call
 * Original Code: f(ê) 
 * Compilied Code: s_1 = C[x(ê)], s_2 = C_u[x(ê)]
 * _iflow_sig = _runtime.api_register.getIFlowSig(x, null, 'function_call');
 * _l_ctxt = _pc; 
 * if(_iflow_sig) {
 * 	s_1
 * } else {
 * 	s_2
 * }
 *  
 */
comp.compileFunCallExpr = function (funcall_expr) {
	var compiled_if,
	    compiled_instrumented_call_expr_stmts, 
	    compiled_uninstrumented_call_expr_stmts,
	    fun_identifier_level_expr,
	    fun_indentifier_str,
	    iflow_sig_stmt,
	    l_ctxt_stmt,
	    str,
	    val_lev_vars; 
	
    //_l_ctxt = _pc; 
	str = '{0} = {1};';
	str = $.validator.format(str, 
	    this.identifiers.consts.LEV_CTXT_IDENT,
	    this.identifiers.consts.PC_IDENT); 
    l_ctxt_stmt = window.util.parseStmt(str);
	
	val_lev_vars = this.identifiers.getFreeValLevVars();
	compiled_instrumented_call_expr_stmts = this.compileInstrumentedFunCallExpr(funcall_expr, val_lev_vars); 
	if (!comp._support_apis) {
	   compiled_instrumented_call_expr_stmts.unshift(l_ctxt_stmt);
	   return {
          compiled_stmts: compiled_instrumented_call_expr_stmts,
          new_vars: [ val_lev_vars ]
       };
	}

	fun_indentifier_str = funcall_expr.callee.name;
	fun_identifier_level_expr = this.level.compileIdentifierExpr(funcall_expr.callee.name);
	
	//_iflow_sig = _runtime.api_register.getIFlowSig(f, null, 'function_call'); 
	str = '{0} = {1}.api_register.getIFlowSig({2}, null, \'function_call\');'; 
	str = $.validator.format(str, 
	    this.identifiers.consts.IFLOW_SIG_IDENT, 
	    this.identifiers.consts.RUNTIME_IDENT,
	    fun_indentifier_str);
    iflow_sig_stmt = window.util.parseStmt(str);
	
	// if(_iflow_sig) {  } else {  }
	str = 'if({0}) {} else {}'; 
	str = $.validator.format(str, this.identifiers.consts.IFLOW_SIG_IDENT); 
	compiled_if = window.util.parseStmt(str);
	
	
	if (comp._support_eval) {
	   compiled_uninstrumented_call_expr_stmts = this.compileEvalUnInstrumentedFunCallExpr(funcall_expr, val_lev_vars);
	} else {
	   compiled_uninstrumented_call_expr_stmts = this.compileNOEvalUnInstrumentedFunCallExpr(funcall_expr, val_lev_vars);
	}
	
	compiled_if.consequent.body = compiled_uninstrumented_call_expr_stmts; 
	compiled_if.alternate.body = compiled_instrumented_call_expr_stmts;
	
	return {
      compiled_stmts: [
         iflow_sig_stmt, 
         l_ctxt_stmt,
         compiled_if
      ],
      new_vars: [ val_lev_vars ]
   };
};


/*
 * Instrumented function call
 * Original Code: f(ê) 
 * Compilied Code:
 * _lev_ctxt = _runtime.lat.lub(_lev_ctxt, f._lev_fscope, _lev_f); 
 * _ret = f( _lev_ctxt, ê, _runtime.lat.lub(C_l[ê], _lev_ctxt));
 * _val_i = _ret._val; 
 * _lev_i = _ret._lev; 
 */
comp.compileInstrumentedFunCallExpr = function (call_expr, val_lev_vars) { 
   var args_exprs,
       assign_ctxt_stmt,  
       assign_ret_stmt, 
       assign_val_stmt, 
       assign_lev_stmt,
       compiled_call_expr,
       lub_member_expr, 
       stmts = [],
       str;  
   
   //_lev_ctxt = _runtime.lat.lub(_lev_ctxt, f._lev_fscope, _lev_f);
   str = '{0} = {1}.lat.lub({0}, {2}.{3}, {4});';
   str = $.validator.format(str, 
      comp.identifiers.consts.LEV_CTXT_IDENT, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      call_expr.callee.name, 
      this.identifiers.consts.LEV_FSCOPE_IDENT,
      comp.identifiers.getShadowVar(call_expr.callee.name));
   assign_ctxt_stmt = window.util.parseStmt(str);
   stmts.push(assign_ctxt_stmt); 
   
   //_ret = x(ê, C_l[ê], _runtime.lat.lub(C_l[x], _pc)); 
   args_exprs = this.computeArguments(call_expr.arguments);
   args_exprs.unshift(window.esprima.delegate.createIdentifier(
      comp.identifiers.consts.LEV_CTXT_IDENT));
   compiled_call_expr = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createIdentifier(call_expr.callee.name),
      args_exprs);
   assign_ret_stmt = window.esprima.delegate.createAssignmentExpression(
      '=', 
      window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT), 
      compiled_call_expr); 
   assign_ret_stmt = window.esprima.delegate.createExpressionStatement(assign_ret_stmt); 
   stmts.push(assign_ret_stmt);
   
   //_val_i = _ret._val;
   str = '{0} = {1}.{2};'; 
   str = $.validator.format(str, 
   	  val_lev_vars.val_var,
      comp.identifiers.consts.RET_IDENT,
   	  this.identifiers.consts.VAL_PROP_IDENT);
   assign_val_stmt = window.util.parseStmt(str);
   stmts.push(assign_val_stmt);
   
   //_lev_i = _ret._lev;
   str = '{0} = {1}.{2};';
   str = $.validator.format(str, 
   val_lev_vars.lev_var, 
   comp.identifiers.consts.RET_IDENT,
   this.identifiers.consts.LEV_PROP_IDENT);
   assign_lev_stmt = window.util.parseStmt(str);
   stmts.push(assign_lev_stmt);
   
   return stmts;  
}; 


/*
 * Original Code: f(ê) - without eval: 
 * _iflow_sig._enforce(l_ctxt, f, ê, C_l[e]); 
 * _val_i = f(ê); 
 * _lev_i = _iflow_sig._updtLab(_val_i, l_ctxt, f, ê, C_l[e]); 
 */
comp.compileNOEvalUnInstrumentedFunCallExpr = function (funcall_expr, val_lev_vars) {
	var assignment_expr_aux, 
	    call_expr_aux, 
	    compiled_args,
	    compiled_stmt_1, 
	    compiled_stmt_2,
	    compiled_stmt_3,
	    fun_identifier_str, 
	    str;
	
	fun_identifier_str = funcall_expr.callee.name; 
	
	// (lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n])
	compiled_args = this.computeArguments(funcall_expr.arguments); 
	compiled_args.unshift(window.esprima.delegate.createIdentifier(fun_identifier_str));
	compiled_args.unshift(window.esprima.delegate.createIdentifier(comp.identifiers.consts.LEV_CTXT_IDENT));
	
	//_iflow_sig._enforce(lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
	str = '{0}._enforce()'; 
	str = $.validator.format(str, comp.identifiers.consts.IFLOW_SIG_IDENT);
	call_expr_aux = window.util.parseExpr(str);
	call_expr_aux.arguments = compiled_args;
	compiled_stmt_1 = window.esprima.delegate.createExpressionStatement(call_expr_aux);
	
	//_val_i = f(ê_0, ..., ê_n);
	call_expr_aux = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createIdentifier(fun_identifier_str),
      $.extend(true, [], funcall_expr.arguments)); 
    assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
   	   '=', 
   	   window.esprima.delegate.createIdentifier(val_lev_vars.val_var), 
   	   call_expr_aux);
    compiled_stmt_2 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
	
	//_lev_i = _iflow_sig._updtLab(_val_i, lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
	compiled_args = $.extend(true, [], compiled_args);
	compiled_args.unshift(window.esprima.delegate.createIdentifier(val_lev_vars.val_var));
	str = '{0}._updtLab()';
	str = $.validator.format(str, comp.identifiers.consts.IFLOW_SIG_IDENT);
	call_expr_aux = window.util.parseExpr(str);
	call_expr_aux.arguments = compiled_args;
	assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
   	   '=', 
   	   window.esprima.delegate.createIdentifier(val_lev_vars.lev_var), 
   	   call_expr_aux);
    compiled_stmt_3 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);

	return  [ compiled_stmt_1, compiled_stmt_2, compiled_stmt_3 ];
};


/* To support eval: f(ê_0, ..., ê_n) 
 * _iflow_sig._enforce(lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 * _inspector = function($) { return eval($); }; 
 * _ret = f(_iflow_sig._processArg(ê_0, 0, _inspector), ..., _iflow_sig._processArg(ê_n, n, _inspector));
 * _val_i = _iflow_sig._processRet(_ret);  
 * _lev_i = _iflow_sig._updtLab(_ret, lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 */ 
comp.compileEvalUnInstrumentedFunCallExpr = function (funcall_expr, val_lev_vars) {
	var assign_lev_stmt,
	    assign_ret_stmt,
	    assign_val_stmt, 
	    call_expr_aux, 
	    compiled_args,
	    enforce_stmt, 
	    fun_call_args, 
	    fun_identifier_str,
	    inspector_stmt, 
	    stmts = [], 
	    str;
	
	fun_identifier_str = funcall_expr.callee.name; 
	
	//  (lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n])
	compiled_args = this.computeArguments(funcall_expr.arguments); 
    compiled_args.unshift(window.esprima.delegate.createIdentifier(fun_identifier_str));
	compiled_args.unshift(window.esprima.delegate.createIdentifier(
	   comp.identifiers.consts.LEV_CTXT_IDENT));
	
	//_iflow_sig._enforce(lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
	str = '{0}._enforce()'; 
	str = $.validator.format(str, comp.identifiers.consts.IFLOW_SIG_IDENT);
	call_expr_aux = window.util.parseExpr(str);
	call_expr_aux.arguments = compiled_args;
	enforce_stmt = window.esprima.delegate.createExpressionStatement(call_expr_aux);
	stmts.push(enforce_stmt); 
	
	//_inspector = function($) { return eval($); }; 
	str = '{0} = function($) { return eval($); };';
	str = $.validator.format(str, comp.identifiers.consts.INSPECTOR_IDENT);
	inspector_stmt = window.util.parseStmt(str); 
	stmts.push(inspector_stmt); 
	
	// if _support_eval is turned on
	// ê_0, ..., ê_n => _iflow_sig._processArg(ê_0, 0, _inspector), ..., _iflow_sig._processArg(ê_n, n, _inspector)
	fun_call_args = comp.computeProcessedArgs($.extend(true, [], funcall_expr.arguments));
	
	//_ret = f(_iflow_sig._processArg(ê_0, 0, _inspector), ..., _iflow_sig._processArg(ê_n, n, _inspector));
	call_expr_aux = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createIdentifier(fun_identifier_str),
      fun_call_args); 
    assign_ret_stmt = window.esprima.delegate.createAssignmentExpression(
   	   '=', 
   	   window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT), 
   	   call_expr_aux);
    assign_ret_stmt = window.esprima.delegate.createExpressionStatement(assign_ret_stmt);
	stmts.push(assign_ret_stmt); 
	
	//_val_i = _iflow_sig._processRet(_ret); 
	str = '{0} = {1}._processRet({2});';
	str = $.validator.format(str, 
	   val_lev_vars.val_var, 
	   comp.identifiers.consts.IFLOW_SIG_IDENT, 
	   comp.identifiers.consts.RET_IDENT);
	assign_val_stmt = window.util.parseStmt(str); 
	stmts.push(assign_val_stmt); 
	
	//_lev_i = _iflow_sig._updtLab(_ret, lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]);  
	compiled_args = $.extend(true, [], compiled_args);
	compiled_args.unshift(window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT));
	str = '{0}._updtLab()';
	str = $.validator.format(str, comp.identifiers.consts.IFLOW_SIG_IDENT);
	call_expr_aux = window.util.parseExpr(str);
	call_expr_aux.arguments = compiled_args;
	assign_lev_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	   window.esprima.delegate.createIdentifier(val_lev_vars.lev_var), 
   	   call_expr_aux);
    assign_lev_stmt = window.esprima.delegate.createExpressionStatement(assign_lev_stmt);
    stmts.push(assign_lev_stmt); 

	return stmts;
};


/*
 * Method call
 * Original Code: o[ê_p](ê_0, ..., ê_n) 
 * Compiled Code: s_1 = C[o[ê_p](ê_0, ..., ê_n) ], s_2 = C_u[o[ê_p](ê_0, ..., ê_n) ]
 * _iflow_sig = _runtime.api_register.getIFlowSig(o,ê_p);
 * _l_ctxt = _runtime.lat.lub(_lev_o, [_lev_p], _pc); 
 * if(_iflow_sig) {
 * 	s_1
 * } else {
 * 	s_2
 * }
 */
comp.compileMethodCallExpr = function (method_call_expr) {
	var assignment_expr_aux,
	    call_expr_aux,
	    compiled_if,
	    compiled_instrumented_method_call_expr_stmts, 
	    compiled_uninstrumented_method_call_expr_stmts,
	    ctxt_levels,
	    iflow_sig_stmt,
	    l_ctxt_stmt,
	    obj_identifier_str,  
	    prop_expr, 
	    prop_expr_str,
	    stmts = [], 
	    str, 
	    val_lev_vars; 
	    
	obj_identifier_str = method_call_expr.callee.object.name; 
	prop_expr = $.extend(true, {}, method_call_expr.callee.property);
	prop_expr_str = window.util.printExprST(prop_expr);
	
	// _lev_o, [_lev_p], _pc, 
	ctxt_levels = []; 
	ctxt_levels.push(window.esprima.delegate.createIdentifier(
	   comp.identifiers.getShadowVar(obj_identifier_str)));
	if (prop_expr.type === 'Identifier') {
	   ctxt_levels.push(window.esprima.delegate.createIdentifier(
	      comp.identifiers.getShadowVar(prop_expr.name)));
	} 
	ctxt_levels.push(window.esprima.delegate.createIdentifier(
	   comp.identifiers.consts.PC_IDENT));
	
	// _l_ctxt = _runtime.lat.lub(_lev_o, [_lev_p], _pc); 
	str = '{0}.lat.lub()';
	str = $.validator.format(str, comp.identifiers.consts.RUNTIME_IDENT); 
	call_expr_aux = window.util.parseExpr(str);
	call_expr_aux.arguments = ctxt_levels; 
	assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
   	   '=', 
   	   window.esprima.delegate.createIdentifier(comp.identifiers.consts.LEV_CTXT_IDENT), 
   	   call_expr_aux);
	l_ctxt_stmt = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
	stmts.push(l_ctxt_stmt); 
	
	val_lev_vars = this.identifiers.getFreeValLevVars();
	compiled_instrumented_method_call_expr_stmts = this.compileInstrumentedMethodCallExpr(method_call_expr, val_lev_vars);
	if (!comp._support_apis) {
	   compiled_instrumented_method_call_expr_stmts.unshift(l_ctxt_stmt); 
	   return {
          compiled_stmts: compiled_instrumented_method_call_expr_stmts,
          new_vars: [ val_lev_vars ]
       };
	}
	
	// buildPrimitiveTypeConstraint
    if ((method_call_expr.callee.property.type === 'Identifier') && comp._support_coercions) {
       stmts.push(comp.buildPrimitiveTypeConstraint(method_call_expr.callee.property.name));
    }
  
	// _iflow_sig = _runtime.api_register.getIFlowSig(o,ê_p);
	str = '{0} = {1}.api_register.getIFlowSig({2}, {3}, \'method_call\');'; 
	str = $.validator.format(str, 
	   comp.identifiers.consts.IFLOW_SIG_IDENT, 
	   comp.identifiers.consts.RUNTIME_IDENT, 
	   obj_identifier_str, 
	   prop_expr_str);
    iflow_sig_stmt = window.util.parseStmt(str);
    stmts.push(iflow_sig_stmt);

	// if(_iflow_sig) {  } else {  }
	str = 'if({0}) {} else {}'; 
	str = $.validator.format(str, this.identifiers.consts.IFLOW_SIG_IDENT); 
	compiled_if = window.util.parseStmt(str);
	stmts.push(compiled_if);

    if (comp._support_eval) {
	   compiled_uninstrumented_method_call_expr_stmts = this.compileEvalUnInstrumentedMethodCallExpr(method_call_expr, val_lev_vars);
	} else {
	   compiled_uninstrumented_method_call_expr_stmts = this.compileNOEvalUnInstrumentedMethodCallExpr(method_call_expr, val_lev_vars);
	}
	
	compiled_if.consequent.body = compiled_uninstrumented_method_call_expr_stmts; 
	compiled_if.alternate.body = compiled_instrumented_method_call_expr_stmts;
	
	return {
      compiled_stmts: stmts,
      new_vars: [ val_lev_vars ]
   };
};


/*
 * Original Code: o[ê_p](ê_0,...,ê_n) 
 * Compilied Code:
 * C_lookup[o, ê_p, i]
 * _lev_ctxt = _runtime.lat.lub(_lev_ctxt, _lev_i, o[ê_p]._lev_fscope);
 * _ret = o[ê_p](_lev_ctxt, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]);
 * _val_i = _ret._val; 
 * _lev_i = _ret._lev;  
 */
comp.compileInstrumentedMethodCallExpr = function (method_call_expr, val_lev_vars) {
   var args_exprs, 
       assignment_lev,
       assign_lev_ctxt_stmt,
       assignment_ret, 
       assignment_val,
       compiled_call_expr, 
       obj_ident, 
       prop_expr, 
       prop_expr_str,
       stmts, 
       str;
       
   obj_ident = method_call_expr.callee.object.name;
   prop_expr = $.extend(true, {}, method_call_expr.callee.property);
   prop_expr_str = window.util.printExprST(prop_expr);
   
   stmts = comp.compilePropChainLookUpLev(obj_ident, prop_expr_str, val_lev_vars); 
   
   //_lev_ctxt = _runtime.lat.lub(_lev_ctxt, _lev_i, o[ê]._lev_fscope);
   str = '{0} = {1}.lat.lub({0}, {2}, {3}[{4}].{5});';
   str = $.validator.format(str, 
   	  comp.identifiers.consts.LEV_CTXT_IDENT,
      comp.identifiers.consts.RUNTIME_IDENT,
   	  val_lev_vars.lev_var, 
   	  obj_ident, 
   	  prop_expr_str, 
   	  comp.identifiers.consts.LEV_FSCOPE_IDENT); 
   assign_lev_ctxt_stmt = window.util.parseStmt(str);
   stmts.push(assign_lev_ctxt_stmt);
   
   // _ret = o[ê_p](_lev_ctxt, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]);
   args_exprs = this.computeArguments(method_call_expr.arguments);
   args_exprs.unshift(window.esprima.delegate.createIdentifier(comp.identifiers.consts.LEV_CTXT_IDENT));
   compiled_call_expr = window.esprima.delegate.createCallExpression(
      $.extend(true, {}, method_call_expr.callee), 
      args_exprs);
   assignment_ret = window.esprima.delegate.createAssignmentExpression(
      '=', 
      window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT), 
      compiled_call_expr); 
   assignment_ret = window.esprima.delegate.createExpressionStatement(assignment_ret); 
   stmts.push(assignment_ret); 
   
    //_val_i = _ret._val;
   str = '{0} = {1}.{2};'; 
   str = $.validator.format(str, 
   	  val_lev_vars.val_var,
      comp.identifiers.consts.RET_IDENT,
   	  this.identifiers.consts.VAL_PROP_IDENT);
   assignment_val = window.util.parseStmt(str);
   stmts.push(assignment_val); 
   
   //_lev_i = _ret._lev;
   str = '{0} = {1}.{2};';
   str = $.validator.format(str, 
      val_lev_vars.lev_var, 
      comp.identifiers.consts.RET_IDENT,
      this.identifiers.consts.LEV_PROP_IDENT);
   assignment_lev = window.util.parseStmt(str);
   stmts.push(assignment_lev); 
   
   return stmts; 
};


/*
 * Uninstrumented method call - no eval
 * Original Code: o[ê_p](ê_0, ..., ê_n) 
 * Compilied Code:
 * _iflow_sig._enforce(_lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 * _val_i = o[ê_p](ê_0, ..., ê_n); 
 * _lev_i = _iflow_sig._updtLab(_val_i, _lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 */
comp.compileNOEvalUnInstrumentedMethodCallExpr = function (method_call_expr, val_lev_vars) {
   var assignment_expr_aux,
       call_expr_aux, 
       compiled_args,
       enforce_stmt, 
       method_call_stmt, 
       obj_identifier_str, 
       prop_expr, 
       prop_expr_str,
       str,  
       updt_lab_stmt; 
   		
   obj_identifier_str = method_call_expr.callee.object.name; 
   prop_expr = $.extend(true, {}, method_call_expr.callee.property);
   prop_expr_str = window.util.printExprST(prop_expr);
   	
   // (_lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n])
   compiled_args = this.computeArguments(method_call_expr.arguments); 
   compiled_args.unshift( $.extend(true, {}, prop_expr));
   compiled_args.unshift(window.esprima.delegate.createIdentifier(obj_identifier_str));
   compiled_args.unshift(window.esprima.delegate.createIdentifier(comp.identifiers.consts.LEV_CTXT_IDENT));
   
   //_iflow_sig._enforce(_lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]);
   str = '{0}._enforce()'; 
   str = $.validator.format(str, comp.identifiers.consts.IFLOW_SIG_IDENT);
   call_expr_aux = window.util.parseExpr(str);
   call_expr_aux.arguments = compiled_args;
   enforce_stmt = window.esprima.delegate.createExpressionStatement(call_expr_aux);
   
   // _val_i = o[ê_p](ê_0, ..., ê_n); 
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
      '=', 
   	  window.esprima.delegate.createIdentifier(val_lev_vars.val_var), 
   	  $.extend(true, {}, method_call_expr));
   method_call_stmt = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
  
   // _lev_i = _iflow_sig._updtLab(_val_i, _lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]);  
   compiled_args = $.extend(true, [], compiled_args);
   compiled_args.unshift(window.esprima.delegate.createIdentifier(val_lev_vars.val_var));
   str = '{0}._updtLab()';
   str = $.validator.format(str, comp.identifiers.consts.IFLOW_SIG_IDENT);
   call_expr_aux = window.util.parseExpr(str);
   call_expr_aux.arguments = compiled_args;
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(val_lev_vars.lev_var), 
   	  call_expr_aux);
   updt_lab_stmt = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
   
   return [enforce_stmt, method_call_stmt, updt_lab_stmt];
};


/*
 * 
 * Uninstrumented method call - with EVAL
 * Original Code: o[ê_p](ê_0, ..., ê_n) 
 * Compilied Code:
 * _iflow_sig._enforce(_lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 * _inspector = function($) { return eval($); }; 
 * _ret = o[ê_p](_iflow_sig._processArg(ê_0, 0, _inspector), ..., _iflow_sig._processArg(ê_n, n, _inspector)); 
 * _val_i = _iflow_sig._processRet(_ret);  
 * _lev_i = _iflow_sig._updtLab(_ret, _lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 */
comp.compileEvalUnInstrumentedMethodCallExpr = function (method_call_expr, val_lev_vars) {
   var assignment_expr_aux,
       assign_val_stmt,
       call_expr_aux, 
       compiled_args,
       enforce_stmt, 
       inspector_stmt, 
       method_call_args, 
       method_call_stmt, 
       obj_identifier_str, 
       prop_expr, 
       prop_expr_str,
       stmts = [], 
       str,  
       updt_lab_stmt; 
   		
   obj_identifier_str = method_call_expr.callee.object.name; 
   prop_expr = $.extend(true, {}, method_call_expr.callee.property);
   prop_expr_str = window.util.printExprST(prop_expr);
   	
   // (_lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n])
   compiled_args = this.computeArguments(method_call_expr.arguments); 
   compiled_args.unshift( $.extend(true, {}, prop_expr));
   compiled_args.unshift(window.esprima.delegate.createIdentifier(obj_identifier_str));
   compiled_args.unshift(window.esprima.delegate.createIdentifier(
      comp.identifiers.consts.LEV_CTXT_IDENT));
   
   //_iflow_sig._enforce(_lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]);
   str = '{0}._enforce()'; 
   str = $.validator.format(str, comp.identifiers.consts.IFLOW_SIG_IDENT);
   call_expr_aux = window.util.parseExpr(str);
   call_expr_aux.arguments = compiled_args;
   enforce_stmt = window.esprima.delegate.createExpressionStatement(call_expr_aux);
   stmts.push(enforce_stmt); 
   
   //_inspector = function($) { return eval($); }; 
   str = '{0} = function($) { return eval($); };';
   str = $.validator.format(str, comp.identifiers.consts.INSPECTOR_IDENT);
   inspector_stmt = window.util.parseStmt(str); 
   stmts.push(inspector_stmt); 
   
   // _iflow_sig._processArg(ê_0, 0, _inspector), ..., _iflow_sig._processArg(ê_n, n, _inspector)
   method_call_args = comp.computeProcessedArgs($.extend(true, [], method_call_expr.arguments));
   
   // _ret = o[ê_p](ê_0, ..., ê_n); 
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
      '=', 
   	  window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT), 
   	  window.esprima.delegate.createCallExpression(
   	     $.extend(true, {}, method_call_expr.callee), 
   	     method_call_args));
   method_call_stmt = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
   stmts.push(method_call_stmt); 
   
   //_val_i = _iflow_sig._processRet(_ret);  
   str = '{0} = {1}._processRet({2});';
   str = $.validator.format(str, 
      val_lev_vars.val_var, 
	  comp.identifiers.consts.IFLOW_SIG_IDENT, 
	  comp.identifiers.consts.RET_IDENT);
   assign_val_stmt = window.util.parseStmt(str); 
   stmts.push(assign_val_stmt); 
	
   //_lev_i = _iflow_sig._updtLab(_ret, _lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]); 
   compiled_args = $.extend(true, [], compiled_args);
   compiled_args.unshift(window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT));
   str = '{0}._updtLab()';
   str = $.validator.format(str, comp.identifiers.consts.IFLOW_SIG_IDENT);
   call_expr_aux = window.util.parseExpr(str);
   call_expr_aux.arguments = compiled_args;
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
      '=', 
   	  window.esprima.delegate.createIdentifier(val_lev_vars.lev_var), 
   	  call_expr_aux);
   updt_lab_stmt = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
   stmts.push(updt_lab_stmt); 
   
   return stmts;
};


/*
 * Constructor Call
 * Original Code: new F(ê_0, ..., ê_n) 
 * Compiled Code: s_1 = C[new F(ê_0, ..., ê_n) ], s_2 = C_u[new F(ê_0, ..., ê_n)]
 * _iflow_sig = _runtime.api_register.getIFlowSig(F, null, 'constructor_call');
 * _lev_ctxt = _pc; 
 * if(_iflow_sig) {
 * 	s_1
 * } else {
 * 	s_2
 * }
 */
comp.compileConstructorCallExpr = function(constructor_call_expr) {
   var compiled_if, 
       compiled_instrumented_constructor_call_expr_stmts, 
       compiled_uninstrumented_constructor_call_expr_stmts, 
       constructor_ident_str, 
       iflow_sig_stmt, 
       l_ctxt_stmt, 
       str, 
       val_lev_vars;

   //_lev_ctxt = _pc;
   str = '{0} = {1};';
   str = $.validator.format(str, 
     this.identifiers.consts.LEV_CTXT_IDENT,
     this.identifiers.consts.PC_IDENT); 
   l_ctxt_stmt = window.util.parseStmt(str);

   val_lev_vars = this.identifiers.getFreeValLevVars();
   compiled_instrumented_constructor_call_expr_stmts = this.compileInstrumentedConstructorCallExpr(constructor_call_expr, val_lev_vars);
   if (!comp._support_apis) {
      compiled_instrumented_constructor_call_expr_stmts.unshift(l_ctxt_stmt); 
      return {
         compiled_stmts : compiled_instrumented_constructor_call_expr_stmts,
         new_vars : [val_lev_vars]
      };
   }

   constructor_ident_str = constructor_call_expr.callee.name;
   
   //_iflow_sig = _runtime.api_register.getIFlowSig(F, 'constructor_call'); 
   str = '{0} = {1}.api_register.getIFlowSig({2}, null, \'constructor_call\');'; 
   str = $.validator.format(str, 
      this.identifiers.consts.IFLOW_SIG_IDENT, 
      this.identifiers.consts.RUNTIME_IDENT,
      constructor_ident_str);
   iflow_sig_stmt = window.util.parseStmt(str);

   // if(_iflow_sig) {  } else {  }
   str = 'if({0}) {} else {}'; 
   str = $.validator.format(str, this.identifiers.consts.IFLOW_SIG_IDENT); 
   compiled_if = window.util.parseStmt(str);

   if (comp._support_eval) {
      compiled_uninstrumented_constructor_call_expr_stmts = this.compileEvalUnInstrumentedConstructorCallExpr(constructor_call_expr, val_lev_vars);
   } else {
      compiled_uninstrumented_constructor_call_expr_stmts = this.compileNOEvalUnInstrumentedConstructorCallExpr(constructor_call_expr, val_lev_vars);
   }

   compiled_if.consequent.body = compiled_uninstrumented_constructor_call_expr_stmts;
   compiled_if.alternate.body = compiled_instrumented_constructor_call_expr_stmts;

   return {
      compiled_stmts : [iflow_sig_stmt, l_ctxt_stmt, compiled_if],
      new_vars : [val_lev_vars]
   };
};


/*
 * Original Code: new F(ê_0, ..., ê_n) 
 * Compilied Code: 
 * _lev_ctxt = _runtime.lat.lub(_lev_ctxt, F._lev_fscope, _lev_F)
 * _lev_i = _lev_ctxt;
 * _val_i = _runtime.create(F.prototype, _lev_ctxt); 
 * _ret = _runtime.call(F, _val_i, _lev_ctxt, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 * if(!_ret._no_ret) { 
 * 	_lev_i = _ret._lev; 
 *  _val_i = _ret._val; 
 * }
 */
comp.compileInstrumentedConstructorCallExpr = function (constructor_call_expr, val_lev_vars) {
   var assign_ctxt_stmt, 
       compiled_args,
       constructor_call_stmt,
       constructor_ident_str,
       if_stmt, 
       lev_assignment_stmt,
       obj_creation_stmt, 
       str;
   
   constructor_ident_str = constructor_call_expr.callee.name; 
   
   // _lev_ctxt = _runtime.lat.lub(_lev_ctxt, F._lev_fscope, _lev_F);
   str = '{0} = {1}.lat.lub({0}, {2}.{3}, {4});';
   str = $.validator.format(str, 
      comp.identifiers.consts.LEV_CTXT_IDENT, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      constructor_ident_str, 
      comp.identifiers.consts.LEV_FSCOPE_IDENT,
      comp.identifiers.getShadowVar(constructor_ident_str)); 
   assign_ctxt_stmt = window.util.parseStmt(str);
    
   // _lev_i = _lev_ctxt;
   str = '{0} = {1};'; 
   str = $.validator.format(str, val_lev_vars.lev_var, comp.identifiers.consts.LEV_CTXT_IDENT);
   lev_assignment_stmt = window.util.parseStmt(str);
   
   //_val_i = _runtime.create(F.prototype, _lev_ctxt);
   str = '{0} = {1}.create({2}.prototype, {3});'; 
   str = $.validator.format(str, 
      val_lev_vars.val_var,
      comp.identifiers.consts.RUNTIME_IDENT, 
   	  constructor_ident_str, 
   	  comp.identifiers.consts.LEV_CTXT_IDENT);
   obj_creation_stmt = window.util.parseStmt(str);
   
   //(F, _val_i, _lev_ctxt, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n])
   compiled_args = this.computeArguments(constructor_call_expr.arguments); 
   compiled_args.unshift(window.esprima.delegate.createIdentifier(comp.identifiers.consts.LEV_CTXT_IDENT));
   compiled_args.unshift(window.esprima.delegate.createIdentifier(val_lev_vars.val_var));
   compiled_args.unshift(window.esprima.delegate.createIdentifier(constructor_ident_str));
   
   //_ret = _runtime.call(F, _val_i, _lev_ctxt, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]);
   str = '{0} = {1}.call();';
   str = $.validator.format(str, 
      comp.identifiers.consts.RET_IDENT, 
   	  comp.identifiers.consts.RUNTIME_IDENT);
   constructor_call_stmt = window.util.parseStmt(str);
   constructor_call_stmt.expression.right.arguments = compiled_args; 
   
   // if (!_ret._no_ret) { _lev_i = _ret._lev;  _val_i = _ret._val; }
   str = 'if (!{0}.{1}) { {2} = {0}.{3}; {4} =  {0}.{5}; }'; 
   str = $.validator.format(str, 
      comp.identifiers.consts.RET_IDENT, 
      comp.identifiers.consts.NO_RET_PROP_IDENT, 
      val_lev_vars.lev_var, 
      comp.identifiers.consts.LEV_PROP_IDENT,
      val_lev_vars.val_var, 
      comp.identifiers.consts.VAL_PROP_IDENT);
   if_stmt = window.util.parseStmt(str);

   return [
      assign_ctxt_stmt, 
      lev_assignment_stmt, 
      obj_creation_stmt,
      constructor_call_stmt,
      if_stmt
   ];
};


/*
 * Uninstrumented Constructor Call
 * Original Code: new F(ê_0, ..., ê_n) 
 * Compilied Code:
 * _iflow_sig._enforce(lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 * _val_i = new F(ê_0, ..., ê_n); 
 * _lev_i = _iflow_sig._updtLab(_val_i, _lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
*/
comp.compileNOEvalUnInstrumentedConstructorCallExpr = function (constructor_call_expr, val_lev_vars) {
   var assignment_expr_aux,
       compiled_args, 
       constructor_call_stmt, 
       constructor_ident_str,
       enforce_stmt,  
       str, 
       updt_lab_stmt;
	
   constructor_ident_str = constructor_call_expr.callee.name; 
	
   // (lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n])
   compiled_args = this.computeArguments(constructor_call_expr.arguments); 
   compiled_args.unshift(window.esprima.delegate.createIdentifier(constructor_ident_str));
   compiled_args.unshift(window.esprima.delegate.createIdentifier(comp.identifiers.consts.LEV_CTXT_IDENT));
	
   //_iflow_sig._enforce(lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]);
   str = '{0}._enforce();'; 
   str = $.validator.format(str, comp.identifiers.consts.IFLOW_SIG_IDENT);
   enforce_stmt = window.util.parseStmt(str);
   enforce_stmt.expression.arguments = compiled_args; 
    
   // _val_i = new F(ê_0, ..., ê_n); 
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
      '=', 
   	  window.esprima.delegate.createIdentifier(val_lev_vars.val_var), 
   	  $.extend(true, {}, constructor_call_expr));
   constructor_call_stmt = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);

   //_lev_i =  _lev_i = _iflow_sig._updtLab(_val_i, _lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
   compiled_args = $.extend(true, [], compiled_args);
   compiled_args.unshift(window.esprima.delegate.createIdentifier(val_lev_vars.val_var));
   str = '{0} = {1}._updtLab();';	
   str = $.validator.format(str,
      val_lev_vars.lev_var, 
      comp.identifiers.consts.IFLOW_SIG_IDENT);
   updt_lab_stmt = window.util.parseStmt(str);   	
   updt_lab_stmt.expression.right.arguments = compiled_args; 
	
	return [
	   enforce_stmt, 
	   constructor_call_stmt,
       updt_lab_stmt
   ];	
};

/*
 * Uninstrumented Constructor Call - Eval
 * Original Code: new F(ê_0, ..., ê_n) 
 * Compilied Code:
 * _iflow_sig._enforce(lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 * _inspector = function($) { return eval($); }; 
 * _ret = new F(_iflow_sig._processArg(ê_0, 0, _inspector), ..., _iflow_sig._processArg(ê_n, n, _inspector)); 
 * _val_i = _iflow_sig._processRet(_ret);  
 * _lev_i = _iflow_sig._updtLab(_ret, _lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
*/
comp.compileEvalUnInstrumentedConstructorCallExpr = function (constructor_call_expr, val_lev_vars) {
   var assignment_expr_aux,
       assign_val_stmt, 
       compiled_args, 
       constructor_call_args,
       constructor_call_stmt, 
       constructor_ident_str,
       enforce_stmt,  
       inspector_stmt, 
       stmts = [], 
       str, 
       updt_lab_stmt;
	
   constructor_ident_str = constructor_call_expr.callee.name; 
	
   // (lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n])
   compiled_args = this.computeArguments(constructor_call_expr.arguments); 
   compiled_args.unshift(window.esprima.delegate.createIdentifier(constructor_ident_str));
   compiled_args.unshift(window.esprima.delegate.createIdentifier(comp.identifiers.consts.LEV_CTXT_IDENT));
	
   // _iflow_sig._enforce(lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
   str = '{0}._enforce();'; 
   str = $.validator.format(str, comp.identifiers.consts.IFLOW_SIG_IDENT);
   enforce_stmt = window.util.parseStmt(str);
   enforce_stmt.expression.arguments = compiled_args; 
   stmts.push(enforce_stmt); 
   
   //_inspector = function($) { return eval($); }; 
   str = '{0} = function($) { return eval($); };';
   str = $.validator.format(str, comp.identifiers.consts.INSPECTOR_IDENT);
   inspector_stmt = window.util.parseStmt(str); 
   stmts.push(inspector_stmt); 
   
   // _iflow_sig._processArg(ê_0, 0, _inspector), ..., _iflow_sig._processArg(ê_n, n, _inspector)
   constructor_call_args = comp.computeProcessedArgs($.extend(true, [], constructor_call_expr.arguments));
   
   // _ret = new F(ê_0, ..., ê_n); 
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
      '=', 
   	  window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT), 
   	  window.esprima.delegate.createNewExpression(
   	     $.extend(true, {}, constructor_call_expr.callee), 
   	     constructor_call_args));
   constructor_call_stmt = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
   stmts.push(constructor_call_stmt); 
   
   // _val_i = _iflow_sig._processRet(_ret);  
   str = '{0} = {1}._processRet({2});';
   str = $.validator.format(str, 
      val_lev_vars.val_var, 
	  comp.identifiers.consts.IFLOW_SIG_IDENT, 
	  comp.identifiers.consts.RET_IDENT);
   assign_val_stmt = window.util.parseStmt(str); 
   stmts.push(assign_val_stmt); 
   
   // _lev_i = _iflow_sig._updtLab(_ret, _lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
   compiled_args = $.extend(true, [], compiled_args);
   compiled_args.unshift(window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT));
   str = '{0} = {1}._updtLab();';	
   str = $.validator.format(str,
      val_lev_vars.lev_var, 
      comp.identifiers.consts.IFLOW_SIG_IDENT);
   updt_lab_stmt = window.util.parseStmt(str);   	
   updt_lab_stmt.expression.right.arguments = compiled_args; 
   stmts.push(updt_lab_stmt); 
	
	return stmts; 
};

 
/*
 * Original Code: function(x_0, ..., x_n) { s }, C[s] = s', new_vars
 * Compiled body: s'' = 
 *     var new_vars; 
 *     var vars(s);
 *     s'
 *     return {_val: undefined, _lev: _pc, _no_ret: true} 
 * Compiled function literal: 
 *  _val_i = function(_pc, x_1, _lev_x_1, ..., x_n, _lev_x_n) { s'' };  
 *  _runtime.defineProperty(_val_i, '_lev_prototype', {enumerable: false, value: _pc, writable: true});
 *  _runtime.defineProperty(_val_i, '_lev_fscope', {enumerable: false, value: _pc, writable: true});
 *  _runtime.defineProperty(_val_i, '_struct', {enumerable: false, value: _pc, writable: true});
 *  _runtime.defineProperty(_val_i, '_instrumented', {enumerable: false, value: true, writable: true}); 
 *  _runtime.defineProperty( _val_i.prototype, '_lev_proto', {enumerable: false, value: _pc, writable: true}); 
 *  _runtime.defineProperty( _val_i.prototype, '_struct', {enumerable: false, value: _pc, writable: true}); 
 *  _runtime.defineProperty( _val_i.prototype, '_proto', {enumerable: false, value: null, writable: true}); 
 *  _lev_i = _pc; 
 */
comp.compileFunctionLiteralExpr = function (funlit_exp) {
   var assign_funlit_stmt, 
       assign_fscope_lev_stmt,
       assign_instr_flag_stmt,
       assign_lev, 
       assign_prototype_lev_stmt,
       assign_prototype_proto_stmt,
       assign_prototype_proto_lev_stmt,
       assign_prototype_struct_lev_stmt,
       assign_struct_lev_stmt,
       compiled_funlit, 
	   val_lev_vars, 
	   str;
	     
   compiled_funlit = this.computeNewFunctionLiteral(funlit_exp); 
   val_lev_vars = this.identifiers.getFreeValLevVars();
	
   //_val_i = function(x_1, ..., x_n, args_levels, _external_pc) { s'' };  
   assign_funlit_stmt = window.esprima.delegate.createAssignmentExpression(
      '=',
	  window.esprima.delegate.createIdentifier(val_lev_vars.val_var), 
	  compiled_funlit
   );
   assign_funlit_stmt = window.esprima.delegate.createExpressionStatement(assign_funlit_stmt);
   
   //_runtime.defineProperty(_val_i, _'lev_prototype', {enumerable: false, value: _pc, writable: true});
   str = '{0}.defineProperty({1}, \'{2}\', {enumerable: false, value: {3}, writable: true});';
   str = $.validator.format(str,
      comp.identifiers.consts.RUNTIME_IDENT, 
      val_lev_vars.val_var, 
   	  comp.identifiers.getShadowVar('prototype'), 
   	  comp.identifiers.consts.PC_IDENT); 	  
   assign_prototype_lev_stmt = window.util.parseStmt(str);
   
   // _runtime.defineProperty(_val_i, '_lev_fscope', {enumerable: false, value: _pc, writable: true});
   str = '{0}.defineProperty({1}, \'{2}\', {enumerable: false, value: {3}, writable: true});';
   str = $.validator.format(str, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      val_lev_vars.val_var, 
   	  comp.identifiers.consts.LEV_FSCOPE_IDENT, 
   	  comp.identifiers.consts.PC_IDENT);
   assign_fscope_lev_stmt = window.util.parseStmt(str); 	  
   
   // _runtime.defineProperty(_val_i, '_struct', {enumerable: false, value: _pc, writable: true});
   str = '{0}.defineProperty({1}, \'{2}\', {enumerable: false, value: {3}, writable: true});';
   str = $.validator.format(str, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      val_lev_vars.val_var, 
   	  comp.identifiers.consts.STRUCT_PROP_IDENT, 
   	  comp.identifiers.consts.PC_IDENT);
   assign_struct_lev_stmt = window.util.parseStmt(str);
   
   //_runtime.defineProperty(_val_i, \'_instrumented\', {enumerable: false, value: true, writable: true}); 
   str = '{0}.defineProperty({1}, \'{2}\', {enumerable: false, value: true, writable: true});';
   str = $.validator.format(str, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      val_lev_vars.val_var, 
   	  comp.identifiers.consts.INSTRUMENTED_PROP_IDENT);
   assign_instr_flag_stmt = window.util.parseStmt(str);
   
   // _runtime.defineProperty( _val_i.prototype, '_lev_proto', {enumerable: false, value: _pc});
   str = '{0}.defineProperty({1}.prototype, \'{2}\', {enumerable: false, value: {3}, writable: true});';
   str = $.validator.format(str, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      val_lev_vars.val_var, 
   	  comp.identifiers.consts.PROTO_PROP_LEV_IDENT, 
   	  comp.identifiers.consts.PC_IDENT);
   assign_prototype_proto_lev_stmt = window.util.parseStmt(str);
   	  
   // _runtime.defineProperty( _val_i.prototype, '_struct', {enumerable: false, value: _pc, writable: true}); 
   str = '{0}.defineProperty({1}.prototype, \'{2}\', {enumerable: false, value: {3}, writable: true});';
   str = $.validator.format(str, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      val_lev_vars.val_var, 
   	  comp.identifiers.consts.STRUCT_PROP_IDENT, 
   	  comp.identifiers.consts.PC_IDENT);
   assign_prototype_struct_lev_stmt = window.util.parseStmt(str);
    
   // _runtime.defineProperty( _val_i.prototype, '_proto', {enumerable: false, value: null, writable: true}); 
   str = '{0}.defineProperty({1}.prototype, \'{2}\', {enumerable: false, value: null, writable: true});';
   str = $.validator.format(str, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      val_lev_vars.val_var, 
   	  comp.identifiers.consts.PROTO_PROP_IDENT);
   assign_prototype_proto_stmt = window.util.parseStmt(str);
   
   //_lev_i = _pc; 
   str = '{0} = {1}; '; 
   str = $.validator.format(str, 
      val_lev_vars.lev_var, 
      this.identifiers.consts.PC_IDENT);
   assign_lev = window.util.parseStmt(str);
	
   return {
      compiled_stmts: [ 
         assign_funlit_stmt, 
         assign_prototype_lev_stmt, 
         assign_fscope_lev_stmt, 
         assign_struct_lev_stmt,
         assign_instr_flag_stmt,
         assign_prototype_proto_lev_stmt,
         assign_prototype_struct_lev_stmt,
         assign_prototype_proto_stmt,
         assign_lev
      ], 
      new_vars: [ val_lev_vars ]
   }; 
};


/* Original Code: function(x_0, ..., x_n) { s }, C[s] = s', new_vars
 * Compiled Code
 *  function(_pc, x_0, _lev_x_0, ..., x_n, _lev_x_n) { 
 *     var new_vars; 
 *     var vars(s);
 *     s'
 *     return {_val: undefined, _lev: _pc, _no_ret: true}; }
 */
comp.computeNewFunctionLiteral = function (funlit_exp) {
	var body_stmts = [], 
	    compiled_body,
	    compiled_params, 
	    compiled_ret_stmt, 
	    internal_vars_decl,   
	    last_stmt_index, 
	    original_vars_decl,
	    prop_val,
	    prop_lev, 
	    prop_no_ret,
	    ret_function_expr, 
	    ret_object,
	    str;
	
   //Compute the new params: (_pc, x_0, _lev_x_0, ..., x_n, _lev_x_n)
   compiled_params = comp.computeParams(funlit_exp.params); 
   compiled_params.unshift(window.esprima.delegate.createIdentifier(this.identifiers.consts.PC_IDENT));  
   
   //compile the body of the function
   compiled_body = this.compile(funlit_exp.body); 
   
   //var new_vars; 
   str = comp.utils.newVarsToString(compiled_body.new_vars);
   if (str) {
      internal_vars_decl = window.util.parseStmt(str);
      body_stmts.push(internal_vars_decl);
   } 
	
   //Compute the declaration of the original variables
   //var vars(s);
   original_vars_decl =  comp.utils.getOriginalDeclarations(funlit_exp);
   body_stmts = body_stmts.concat(original_vars_decl); 
	
   // Add the compiled body to the stmts
   compiled_body.compiled_stmts[0].body = body_stmts.concat(compiled_body.compiled_stmts[0].body);

   last_stmt_index = compiled_body.compiled_stmts[0].body.length-1; 
   // Check if the function finishes with a return statement - if not we must add a default return
   if ((last_stmt_index < 0) || (!(compiled_body.compiled_stmts[0].body[last_stmt_index].type === 'ReturnStatement'))) {
      // Add a return just for caution 
      //_val: undefined
      prop_val = window.esprima.delegate.createProperty('init',
         window.esprima.delegate.createIdentifier(comp.identifiers.consts.VAL_PROP_IDENT), 
         window.esprima.delegate.createIdentifier('undefined'));
   
      //_lev: _pc
      prop_lev = window.esprima.delegate.createProperty('init',
         window.esprima.delegate.createIdentifier(comp.identifiers.consts.LEV_PROP_IDENT), 
         window.esprima.delegate.createIdentifier(comp.identifiers.consts.PC_IDENT));
      
      //_no_ret: true
      prop_no_ret = window.esprima.delegate.createProperty('init',
         window.esprima.delegate.createIdentifier(comp.identifiers.consts.NO_RET_PROP_IDENT), 
         window.esprima.delegate.createLiteral2(true));
      
      // {_val: undefined, _lev: _pc, _no_ret: true}   
      ret_object = window.esprima.delegate.createObjectExpression([prop_val, prop_lev, prop_no_ret]);
      compiled_ret_stmt = window.esprima.delegate.createReturnStatement(ret_object); 
      compiled_body.compiled_stmts[0].body.push(compiled_ret_stmt);
   }
   	
   ret_function_expr = window.esprima.delegate.createFunctionExpression(null, compiled_params, [], compiled_body.compiled_stmts[0]);  
   str = window.util.printExprST(ret_function_expr); 
   
   // compute instrumented function literal
   return ret_function_expr;
};  


/*
 * Original Code: return ê - where ê is very simple
 * Compiled Code:
 * return {_val: ê, _lev: C_l[ê]}
 */
comp.compileReturnStmt = function (ret_stmt) {
   var compiled_ret_stmt, 
	   prop_val, 
	   prop_lev; 
	
   //_val: ê
   prop_val = window.esprima.delegate.createProperty('init',
      window.esprima.delegate.createIdentifier(this.identifiers.consts.VAL_PROP_IDENT), 
      $.extend(true, {}, ret_stmt.argument));
	
   //_lev: C_l[ê]
   prop_lev = window.esprima.delegate.createProperty('init',
      window.esprima.delegate.createIdentifier(this.identifiers.consts.LEV_PROP_IDENT), 
      this.level.compile(ret_stmt.argument));

   //return {_val: ê, _lev: _lat.lub(C_l[ê], _pc)}
   compiled_ret_stmt = window.esprima.delegate.createReturnStatement(
      window.esprima.delegate.createObjectExpression([prop_val, prop_lev])); 
   		
   return {
   	compiled_stmts: [ compiled_ret_stmt ], 
   	new_vars: [ ]
   }; 
}; 


/*
 * Original Code: while(ê) { s }, C[s] = s'
 * Compiled Code: 
 * _pc_holder_i = _pc; 
 * _pc = C_l[ê]; 
 * while(ê) { s' }
 * _pc = _pc_holder_i; 
 */
comp.compileWhileStmt = function (while_stmt) { 
   var assing_new_pc_stmt,
       assing_old_pc_stmt,
       assing_pc_holder_stmt, 
       compiled_body, 
       compiled_while,
       identifiers,
       new_vars, 
       pc_holder_var,
       stmts = [], 
       str; 
   
   // generate same type constraint   
   identifiers = comp.utils.getAllIdentifiers(while_stmt.test);
   if ((identifiers.length > 0) && comp._support_coercions) 
      stmts.push(comp.buildSameTypeConstraint(identifiers)); 

   
   //_pc_holder_i = _pc;
   pc_holder_var = this.identifiers.getPcHolderVar();
   new_vars = [ pc_holder_var ];
   str = '{0} = {1}';
   str = $.validator.format(str, 
   	  pc_holder_var.pc_holder,  
   	  this.identifiers.consts.PC_IDENT);
   assign_pc_holder_stmt = window.util.parseStmt(str);
   stmts.push(assign_pc_holder_stmt);
   
   //_pc = C_l[ê]; 
   assign_new_pc_stmt = window.esprima.delegate.createAssignmentExpression(
      '=',
	  window.esprima.delegate.createIdentifier(this.identifiers.consts.PC_IDENT), 
	  this.level.compile(while_stmt.test)
   );
   assign_new_pc_stmt = window.esprima.delegate.createExpressionStatement(assign_new_pc_stmt);
   stmts.push(assign_new_pc_stmt);
   
   //while(ê) { s' }
   compiled_body = this.compile(while_stmt.body); 
   compiled_while = esprima.delegate.createWhileStatement(
      $.extend(true, {}, while_stmt.test), 
      compiled_body.compiled_stmts[0]); 
   new_vars = new_vars.concat(compiled_body.new_vars); 
   stmts.push(compiled_while); 
   
   //_pc = _pc_holderi; 
   str = '{0} = {1};'; 
   str = $.validator.format(str, 
   	  this.identifiers.consts.PC_IDENT, 
   	  pc_holder_var.pc_holder);
   assign_old_pc_stmt = window.util.parseStmt(str); 
   stmts.push(assign_old_pc_stmt);
   
   return {
   	  compiled_stmts: stmts, 
   	  new_vars: new_vars
   };  
};


/*
 * Original Code: if(ê) { s_1 } else { s_2 }, C[s_1] = s_1', C[s_2] = s_2' 
 * Compiled Code: 
 * _pc_holder_i = _pc; 
 * _pc = C_l[ê]; 
 * if (ê) { s_1' } else { s_2' } 
 * _pc = _pc_holder_i;
 *  
 */
comp.compileIfStmt = function (if_stmt) { 
   var assign_new_pc_stmt,
       assign_old_pc_stmt,
       assign_pc_holder_stmt,  
       compiled_else_stmt,
	   compiled_if_stmt, 
	   compiled_then_stmt,
	   identifiers, 
	   new_vars,
	   pc_holder_var,
	   stmts = [],  
	   str;
   
   pc_holder_var = this.identifiers.getPcHolderVar();
   new_vars = [ pc_holder_var ];
   
   // generate same type constraint   
   identifiers = comp.utils.getAllIdentifiers(if_stmt.test);
   if ((identifiers.length > 0) && comp._support_coercions) 
      stmts.push(comp.buildSameTypeConstraint(identifiers)); 
   
   // _pc_holder_i = _pc; 
   str = '{0} = {1};';
   str = $.validator.format(str, pc_holder_var.pc_holder, this.identifiers.consts.PC_IDENT);
   assign_pc_holder_stmt = window.util.parseStmt(str);
   stmts.push(assign_pc_holder_stmt); 
   
   //_pc = C_l[ê]; 
   assign_new_pc_stmt = window.esprima.delegate.createAssignmentExpression(
      '=',
	  window.esprima.delegate.createIdentifier(this.identifiers.consts.PC_IDENT), 
	  this.level.compile(if_stmt.test)
   );
   assign_new_pc_stmt = window.esprima.delegate.createExpressionStatement(assign_new_pc_stmt);
   stmts.push(assign_new_pc_stmt); 
	
   // if (ê) { s_1' } else { s_2' } 
   compiled_then_stmt = this.compile(if_stmt.consequent);
   compiled_else_stmt = this.compile(if_stmt.alternate); 
   compiled_if_stmt = window.esprima.delegate.createIfStatement(
      $.extend(true, {}, if_stmt.test), 
      compiled_then_stmt.compiled_stmts[0],
      compiled_else_stmt ? compiled_else_stmt.compiled_stmts[0] : null); 
   new_vars = new_vars.concat(compiled_then_stmt.new_vars); 
   new_vars = compiled_else_stmt ? new_vars.concat(compiled_else_stmt.new_vars) : new_vars; 
   stmts.push(compiled_if_stmt); 
  
   // _pc = _pc_holder_i
   str = '{0} = {1};';
   str = $.validator.format(str, this.identifiers.consts.PC_IDENT, pc_holder_var.pc_holder); 
   assign_old_pc_stmt = window.util.parseStmt(str);
   stmts.push(assign_old_pc_stmt); 
	
	return {
   	compiled_stmts: stmts, 
   	new_vars: new_vars
   };
}; 


/*
 * Original Code: for(p in o) { s }
 * C[s] = s'
 * Compiled Code:
 * _pc_holder = _pc;
 * for (p in o) {
 *    _pc = _runtime.lat.lub(_runtime.lat.glb(o[_runtime.shadow(p)], o._lev_struct), _lev_ctxt);  	
 *    s'
 * } 
 * _pc = _pc_holder;
 */
comp.compileForInStmt = function (forin_stmt) {
   var assign_pc_holder_stmt,
       assign_pc_new_stmt,  
       assign_pc_old_stmt, 
       compiled_body,
	   compiled_forin,
	   pc_holder_var,
	   new_vars, 
	   str; 
   
   pc_holder_var = this.identifiers.getPcHolderVar();
   
   new_vars = [ pc_holder_var ];
   
   // _pc_holder = _pc; 
   str = '{0} = {1};';
   str = $.validator.format(str, pc_holder_var.pc_holder, this.identifiers.consts.PC_IDENT);
   assign_pc_holder_stmt = window.util.parseStmt(str);  

   //_pc = _runtime.lat.lub(_runtime.lat.glb(o[_runtime.shadow(p)], o._lev_struct), _pc_holder);  
   str = '{0} = {1}.lat.lub({1}.lat.glb({2}[{1}.shadow({3})], {2}.{4}), {5});';
   str = $.validator.format(str,
      comp.identifiers.consts.PC_IDENT,
      comp.identifiers.consts.RUNTIME_IDENT, 
      forin_stmt.right.name,
      forin_stmt.left.name,
      comp.identifiers.consts.STRUCT_PROP_IDENT, 
      pc_holder_var.pc_holder);
   assign_new_pc_stmt = window.util.parseStmt(str);
       
   // compile the body of forin     
   compiled_body = this.compile(forin_stmt.body);
   compiled_body.compiled_stmts[0].body.unshift(assign_new_pc_stmt); 
   new_vars = new_vars.concat(compiled_body.new_vars);
   
   // build the new forin
   compiled_forin = window.esprima.delegate.createForInStatement(
      $.extend(true, {}, forin_stmt.left),
   	  $.extend(true, {}, forin_stmt.right),  
   	  compiled_body.compiled_stmts[0]); 
    
   // _pc = _pc_holder; 
   str = '{0} = {1};';
   str = $.validator.format(str, this.identifiers.consts.PC_IDENT, pc_holder_var.pc_holder);
   assign_pc_old_stmt = window.util.parseStmt(str);  
   
   return {
      compiled_stmts: [
         assign_pc_holder_stmt,
         compiled_forin,
   	     assign_pc_old_stmt 
   	  ], 
   	  new_vars: new_vars 
   };
};


// Levels

comp.level = {}; 


comp.level.compile = function(expr, ctxt_lev_ident){
   var comp_fun;
   comp_fun = this.cases[expr.type]; 
   return comp_fun(expr, ctxt_lev_ident); 
}; 


/*
 * original code: x, l_x = shadow(x)
 * compiled code: _runtime.lat.lub(l_x, l_ctxt); 
 */
comp.level.compileIdentifierExpr = function (ident, ctxt_lev_ident) { 
   if ((typeof ident) !== 'string') {
      if (ident.hasOwnProperty('name')) {
   	     ident = ident.name;
   	  } else {
   	     throw new Error('Illegal Invocation of CompileIdentifierExpr'); 
   	  } 
   } 
   
   if (!ctxt_lev_ident) {
      ctxt_lev_ident = comp.identifiers.consts.PC_IDENT;
   }
   
   // _runtime.lat.lub(l_x, ctxt_lev_ident)
   str = '{0}.lat.lub({1}, {2})';
   str = $.validator.format(str, 
		comp.identifiers.consts.RUNTIME_IDENT, 
		comp.identifiers.getShadowVar(ident), 
		ctxt_lev_ident);   
	return window.util.parseExpr(str); 
}; 


/*
 * original code: v 
 * compiled code: _l_ctxt || _pc
 */
comp.level.compileLiteralExpr = function (literal, ctxt_lev_ident) {
    if (!ctxt_lev_ident) {
       ctxt_lev_ident = comp.identifiers.consts.PC_IDENT; 
    }
	return window.esprima.delegate.createIdentifier(ctxt_lev_ident);  
};


/*
 * Original Code: this
 * Compiled Code: _l_ctxt || _pc
 */
comp.level.compileThisExpr = function (literal, ctxt_lev_ident) {
	if (!ctxt_lev_ident) {
       ctxt_lev_ident = comp.identifiers.consts.PC_IDENT; 
    }
	return window.esprima.delegate.createIdentifier(ctxt_lev_ident);   
}; 


/*
 * Original Code: x[ê]
 * Compiled Code: _runtime.lat.lub(l_x, C_l[ê], [l_ctxt || _pc])
 */
comp.level.compilePropLookUpExpr = function (prop_lookup_expr, ctxt_lev_ident) {
	var obj_ident, 
	    str; 
	
	obj_ident = prop_lookup_expr.object.name; 
	
	if((prop_lookup_expr.property.type !== 'Identifier') && !ctxt_lev_ident) {
	   // _runtime.lat.lub(l_x, l_ctxt);
	   str = '{0}.lat.lub({1}, {2})'; 
	   str = $.validator.format(str, 
	      comp.identifiers.consts.RUNTIME_IDENT, 
		  comp.identifiers.getShadowVar(obj_ident), 
		  comp.identifiers.consts.PC_IDENT); 
	} else if (ctxt_lev_ident) {
	   // _runtime.lat.lub(l_x, l_ctxt);
	   str = '{0}.lat.lub({1}, {2})'; 
	   str = $.validator.format(str, 
	      comp.identifiers.consts.RUNTIME_IDENT, 
		  comp.identifiers.getShadowVar(obj_ident), 
		  ctxt_lev_ident);   
	} else if (prop_lookup_expr.property.type === 'Identifier') {
	    // _runtime.lat.lub(l_x, l_p, _pc);
	    str = '{0}.lat.lub({1}, {2}, {3})';
	    str = $.validator.format(str, 
		   comp.identifiers.consts.RUNTIME_IDENT, 
		   comp.identifiers.getShadowVar(obj_ident), 
		   comp.identifiers.getShadowVar(prop_lookup_expr.property.name), 
		   comp.identifiers.consts.PC_IDENT);
	} else {
	    // _runtime.lat.lub(l_x, l_p, l_ctxt);
	    str = '{0}.lat.lub({1}, {2}, {3})';
	    str = $.validator.format(str, 
		   comp.identifiers.consts.RUNTIME_IDENT, 
		   comp.identifiers.getShadowVar(obj_ident), 
		   comp.identifiers.getShadowVar(prop_lookup_expr.property.name), 
		   ctxt_lev_ident);
	}
	
	return window.util.parseExpr(str);  
}; 


/*
 * Original Code: ê_1 op ê_2
 * Compiled Code: _runtime.lat.lub(C_l[e_1], C_l[e_2])
 */
comp.level.compileBinUnOpExpr = function (binop_expr, ctxt_lev_ident) {
	var call_expr, 
	    ident_level, 
	    identifiers, 
	    identifiers_levels, 
	    str;
	
	if (!ctxt_lev_ident) {
       ctxt_lev_ident = comp.identifiers.consts.PC_IDENT; 
    }
	
	identifiers = comp.utils.getAllIdentifiers(binop_expr);
	identifiers_levels = []; 
	for (var i = 0, len = identifiers.length; i<len; i++) {
	   ident_level = window.esprima.delegate.createIdentifier(
	      comp.identifiers.getShadowVar(identifiers[i]));
	   identifiers_levels.push(ident_level); 
	} 
	
	if(identifiers_levels.length > 0) {
	   // _runtime.lat.lub([identifiers])
	   str = '{0}.lat.lub()'; 
	   str = $.validator.format(str, comp.identifiers.consts.RUNTIME_IDENT); 
	   call_expr = window.util.parseExpr(str);
	   identifiers_levels.push(window.esprima.delegate.createIdentifier(ctxt_lev_ident));
	   call_expr.arguments = identifiers_levels;
	   return call_expr;   
	} else {
       return window.esprima.delegate.createIdentifier(ctxt_lev_ident);	   
	}
}; 


comp.level.cases = {
	Identifier: comp.level.compileIdentifierExpr, 
	Literal: comp.level.compileLiteralExpr, 
	ThisExpression: comp.level.compileThisExpr, 
	MemberExpression: comp.level.compilePropLookUpExpr, 
	BinaryExpression: comp.level.compileBinUnOpExpr, 
	UnaryExpression: comp.level.compileBinUnOpExpr, 
	LogicalExpression: comp.level.compileBinUnOpExpr
};


/*
 * _runtime.lat.bot 
 */
comp.level.latBotExp = function() { 
	var str; 
	// _runtime.lat.bot
	str = '{0}.lat.bot'; 
	str = $.validator.format(str, comp.identifiers.consts.RUNTIME_IDENT); 
	return window.util.parseExpr(str);
}; 


/*
 * Compile compilePropChainLookUpLev C_lookup[o, p, i]
 * 
 * 
 * _lev_i = _pc; 
 * _val_i = o;
 * while (!(_runtime.hasOwnProperty(_val_i, p)) {
 *    _lev_i = _runtime.lat.lub(_lev_i, _val_i._lev_proto, _val_i._lev_struct); 
 *    _val_i = _val_i._proto; 
 * }
 * if (_val_i) {
 *    _lev_i = _runtime.lat.lub(_lev_i, _val_i[_runtime.shadow(p)]); 
 * } else { }
 * 
 */
comp.compilePropChainLookUpLev = function (obj_ident, prop_ident, val_lev_vars) {
   var assign_lev_init_stmt, 
       assign_val_init_stmt, 
       if_stmt, 
       str, 
       while_stmt;

   // _lev_i = _pc; 
   str = '{0} = {1}'; 
   str = $.validator.format(str, 
      val_lev_vars.lev_var, 
      comp.identifiers.consts.PC_IDENT);
   assing_lev_init_stmt = window.util.parseStmt(str);
   
   // _val_i = o; 
   str = '{0} = {1}'; 
   str = $.validator.format(str, 
      val_lev_vars.val_var, 
      obj_ident);
   assing_val_init_stmt = window.util.parseStmt(str); 
   
   //while (!(_runtime.hasOwnProperty(_val_i, p)) {_lev_i = _runtime.lat.lub(_lev_i, _val_i._lev_proto, _val_i._lev_struct); _val_i = _val_i._proto; }
   str = 'while (!({0}.hasOwnProperty({1}, {2}))) {{3} = {0}.lat.lub({3}, {1}.{4}, {1}.{5}); {1} = {1}.{6}; }'; 
   str = $.validator.format(str, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      val_lev_vars.val_var,
      prop_ident, 
      val_lev_vars.lev_var,
      comp.identifiers.consts.PROTO_PROP_LEV_IDENT, 
      comp.identifiers.consts.STRUCT_PROP_IDENT, 
      comp.identifiers.consts.PROTO_PROP_IDENT);
   while_stmt = window.util.parseStmt(str); 
   
   //if (_val_i) { _lev_i = _runtime.lat.lub(_lev_i, _val_i[_runtime.shadow(p)]); } else {}
   str = 'if ({0}) { {1} = {2}.lat.lub({1}, {0}[{2}.shadow({3})]); } ';
   str = $.validator.format(str, 
      val_lev_vars.val_var,
      val_lev_vars.lev_var,
      comp.identifiers.consts.RUNTIME_IDENT,
      prop_ident
   ); 
   if_stmt = window.util.parseStmt(str); 
   
   return [
      assing_lev_init_stmt, 
      assing_val_init_stmt,
      while_stmt,
      if_stmt
   ];
};


comp.compileEnforcement = function (lev_left_literal, lev_right_literal) {
   var str; 
   
   // if(!_runtime.lat.leq(left_level,right_level)) {_runtime.diverge();}
   str = 'if(!{0}.lat.leq({1},{2})) {{0}.diverge();}';
   str = $.validator.format(str, comp.identifiers.consts.RUNTIME_IDENT, lev_left_literal, lev_right_literal); 
   return window.util.parseStmt(str); 
};


comp.setUpCompiler = function (prog_input, support_coercions, support_apis, support_eval) {
   var i, len, normalization_vars_table;
   comp._support_coercions = support_coercions; 
   comp._support_apis = support_apis; 
   comp._support_eval = support_eval; 
   comp.normalization_variables = [];
   prog_input = comp.normalize(prog_input);
   normalization_vars_table = {}; 
   for (i = 0, len = comp.normalization_variables.length; i < len; i++) {
      normalization_vars_table[comp.normalization_variables[i]] = true;
   }
   comp.normalization_vars_table = normalization_vars_table;
   return prog_input; 
}; 



// x_0, ..., x_n => ((typeof x_0) === 'object') || ((typeof x_0) !== (typeof x_1)) || ... || ((typeof x_{n-1}) !== (typeof x_n)) 
comp.buildSameTypeConstraint = function (identifiers) {
   var constraints = [], final_constraint, i, if_stmt, len, str; 
  
   // ((typeof x_0) === 'object) 
   str = '((typeof {0}) === \'object\')';
   str = $.validator.format(str, identifiers[0]);
   constraints.push(window.util.parseExpr(str));
   
   // ((typeof x_0) === (typeof x_1)) && ... ((typeof x_{n-1}) === (typeof x_n)) 
   for (i = 0, len = identifiers.length - 1; i < len; i++) {
      //((typeof x_1) === (typeof x_n))
      str = '((typeof {0}) !== (typeof {1}))'; 
      str = $.validator.format(str, identifiers[i], identifiers[i+1]);
      constraints.push(window.util.parseExpr(str));   
   }
   
   final_constraint = constraints[0]; 
   for (i = 1, len = constraints.length; i < len; i++) {
      final_constraint = window.esprima.delegate.createBinaryExpression('||', final_constraint, constraints[i]);
   }
   
   if_stmt = window.esprima.delegate.createIfStatement(
      final_constraint, 
      window.esprima.delegate.createExpressionStatement(
         window.esprima.delegate.createCallExpression(
            window.esprima.delegate.createMemberExpression(null, 
               window.esprima.delegate.createIdentifier(comp.identifiers.consts.RUNTIME_IDENT),
               window.esprima.delegate.createIdentifier('diverge')),
            [ window.esprima.delegate.createLiteral2('Illegal Coercion')  ])
      ));
      
   return if_stmt; 
};


// x => (typeof x !== 'string') && (typeof x !== 'number'); 
comp.buildPrimitiveTypeConstraint = function (identifier) {
   var constraint, if_stmt, str; 
   str = '(typeof {0} !== \'string\') && (typeof {0} !== \'number\');'; 
   str = $.validator.format(str, identifier);
   constraint = window.util.parseExpr(str); 
   
   if_stmt = window.esprima.delegate.createIfStatement(
      constraint, 
      window.esprima.delegate.createExpressionStatement(
         window.esprima.delegate.createCallExpression(
            window.esprima.delegate.createMemberExpression(null, 
               window.esprima.delegate.createIdentifier(comp.identifiers.consts.RUNTIME_IDENT),
               window.esprima.delegate.createIdentifier('diverge')),
            [ window.esprima.delegate.createLiteral2('Illegal Coercion') ])
      ));
      
   return if_stmt; 
}; 


comp.applyPrimitiveTypeConstraint = function (expr_st) {
   return (expr_st.type === 'BinaryExpression') || (expr_st.type === 'UnaryExpression') || (expr_st.type === 'LogicalExpression');
};

//  ê_0, ..., ê_n => _iflow_sig._processArg(ê_0, 0, _inspector), ..., _iflow_sig._processArg(ê_n, n, _inspector)
comp.computeProcessedArgs = function (args_exprs) {
   var current_arg_str, i, len, new_args = [], processed_arg, str;
   
   for (i = 0, len = args_exprs.length; i < len; i++) {
      current_arg_str = window.util.printExprST(args_exprs[i]); 
      // _iflow_sig._processArg(ê_0, 0, _inspector)
      str = '{0}._processArg({1}, {2}, {3})'; 
      str = $.validator.format(str,
         comp.identifiers.consts.IFLOW_SIG_IDENT, 
         current_arg_str, 
         i, 
         comp.identifiers.consts.INSPECTOR_IDENT);
      processed_arg = window.util.parseExpr(str); 
      new_args.push(processed_arg); 
   }
   return new_args; 
}; 


// ê_0, ..., ê_n => ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]
comp.computeArguments = function(args){
	var arg, compiled_args;
	compiled_args = [];  
	for(var i=0, len=args.length; i<len; i++){
		arg = $.extend(true, {}, args[i]); 
		if (arg.type === 'MemberExpression') {
		   throw new Error('MemberExpressions cannot be used as arguments');
		}
		compiled_args.push(arg); 
		compiled_args.push(this.level.compile(arg, comp.identifiers.consts.LEV_CTXT_IDENT));
	}
	return compiled_args; 
}; 


comp.computeParams = function (params) {
	var compiled_params = [], param; 
	for(var i=0, len=params.length; i<len; i++){
		param = params[i]; 
		compiled_params.push($.extend(true, {}, param));
		compiled_params.push(window.esprima.delegate.createIdentifier(comp.identifiers.getShadowVar(param.name))); 
	}
	return compiled_params; 
}; 



