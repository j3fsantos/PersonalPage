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
		   if (st.operator === 'in') {
		      return this.compileMembershipTestingExpr(st);	 
		   } else {
		   	  return this.compileBinOpExpr(st);
		   } 
		case 'LogicalExpression': 
		   return this.compileBinOpExpr(st); 
		case 'UnaryExpression': 
		   if (st.operator === 'delete') {
		   	  return this.compileDeleteExpr(st);
		   } else {
		      return this.compileUnOpExpr(st);
		   }
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
	      return this.compileVariableDeclaration(st);  
		default:  
		   if (!st.type) {
		   	throw new Error('Syntax Error - Illegal Program');
		   } else {
		   	throw new Error('Construct ' + st.type + ' is not supported yet');
		   }   
	}
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
	    val_new_vars = [],
	    lev_new_vars = [],  
	    i,
	    len,
	    original_vars_decl, 
	    stmts = st.body,
	    ret;
	     
	if (st.type !== esprima.Syntax.Program) {
	  throw new Error('Trying to compile program statement with non program');
	}
	
	for (i = 0, len = stmts.length; i < len; i++) {
	   	ret = this.compile(stmts[i]);
	   	compiled_stmts = compiled_stmts.concat(ret.stmts);
	   	val_new_vars = val_new_vars.concat(ret.val_new_vars); 
	   	lev_new_vars = lev_new_vars.concat(ret.lev_new_vars); 
	}
	
	original_vars_decl = this.utils.getProgDeclarations(st); 
	return this.createCompiledProgram(compiled_stmts, val_new_vars, lev_new_vars, original_vars_decl); 
}; 


comp.createCompiledProgram = function (compiled_stmts, val_new_vars, lev_new_vars, original_vars_decl) {
   var assignment_pc, compiled_prog_stmts, internal_vars_decl, 
       new_vars_str, stmt, str;
   
   compiled_prog_stmts = []; 
   str =  ''; 
   //Compute the declaration of the compiler's internal variables
   //var  new_vars(s'); 
   new_vars_str = this.utils.varsToString(val_new_vars.concat(lev_new_vars), true);
   str += comp.identifiers.consts.PC_IDENT + ', ' + comp.identifiers.consts.LEV_CTXT_IDENT 
      + ', ' + comp.identifiers.consts.RET_IDENT + ';';  
   if (new_vars_str) {
      str = new_vars_str + ', ' + str; 
   } else {
      str = 'var ' + str; 
   }
   internal_vars_decl = window.util.parseStmt(str);
   compiled_prog_stmts.push(internal_vars_decl); 
   if (original_vars_decl) {
      compiled_prog_stmts = compiled_prog_stmts.concat(original_vars_decl);   
   }
   
   str =  comp.identifiers.consts.RUNTIME_IDENT + '.createShadowWindowProperties(); ';
   stmt = window.util.parseStmt(str);
   compiled_prog_stmts.push(stmt); 
 
   compiled_prog_stmts = compiled_prog_stmts.concat(compiled_stmts);
	
   return esprima.delegate.createProgram(compiled_prog_stmts);  
}; 


comp.compileBlockStmt = function(st) {
   var compiled_stmt, 
       compiled_stmts = [], 
       i, 
       len, 
       val_new_vars = [],
       lev_new_vars = [], 
       ret, 
       stmts = st.body;
   
   for (i = 0, len = stmts.length; i < stmts.length; i++) {
       ret = this.compile(stmts[i]); 
       compiled_stmts = compiled_stmts.concat(ret.stmts);
       val_new_vars = val_new_vars.concat(ret.val_new_vars);
       lev_new_vars = lev_new_vars.concat(ret.lev_new_vars);   	
   }
   
   return {
   	stmts: compiled_stmts,
   	val_new_vars: val_new_vars, 
   	lev_new_vars: lev_new_vars 
   }; 
};


comp.compileVariableDeclaration = function (st) {
    return {
   	   stmts: [],
   	   val_new_vars: [], 
   	   lev_new_vars: [] 
    }; 
};



comp.compileExprStmt = function(expr_stmt) {
   var ret;
   
  
   ret = this.compile(expr_stmt.expression);
   
   /*
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
   }*/
  
   return ret;
}; 



comp.compileIdentifierExpr = function (ident_expr) {
   var expr, lev_new_var, lev_stmt, new_vars, shadow_name, stmts, str, val_new_var, val_stmt; 
   
   new_vars = this.identifiers.getLevValHolderVars(); 
   lev_new_var = new_vars.lev_holder;
   val_new_var = new_vars.val_holder;
   
   shadow_name = comp.identifiers.getShadowVar(ident_expr.name);
   
   str = '{0} = {1}.lat.lub({2}, {3});';
   str = $.validator.format(str, lev_new_var, comp.identifiers.consts.RUNTIME_IDENT, comp.identifiers.consts.PC_IDENT, shadow_name); 
   lev_stmt = window.util.parseStmt(str);
   
   str = '{0} = {1};';
   str = $.validator.format(str, val_new_var, ident_expr.name); 
   val_stmt = window.util.parseStmt(str);
   
   return {
      stmts: [
         lev_stmt, 
         val_stmt
      ], 
      lev_new_vars: [ lev_new_var ],
      val_new_vars: [ val_new_var ], 
      expr_val: window.esprima.delegate.createIdentifier(val_new_var),
      expr_lev: window.esprima.delegate.createIdentifier(lev_new_var)
   };
};

comp.compileLiteralExpr = function (literal_expr) {
   var expr, lev_new_var, lev_stmt, new_vars, stmts, str, val_new_var, val_stmt; 
   
   new_vars = this.identifiers.getLevValHolderVars(); 
   lev_new_var = new_vars.lev_holder;
   val_new_var = new_vars.val_holder;
   
   str = '{0} = {1};';
   str = $.validator.format(str, lev_new_var, comp.identifiers.consts.PC_IDENT); 
   lev_stmt = window.util.parseStmt(str);
   
   str = '{0} = {1};';
   str = $.validator.format(str, val_new_var, literal_expr.raw); 
   val_stmt = window.util.parseStmt(str);
   
   return {
      stmts: [
         lev_stmt, 
         val_stmt
      ], 
      lev_new_vars: [ lev_new_var ],
      val_new_vars: [ val_new_var ],
      expr_val: $.extend(true, {}, literal_expr),
      expr_lev: window.esprima.delegate.createIdentifier(lev_new_var) 
   };
};


comp.compileThisExpr = function (this_expr) {
   var expr, lev_new_var, lev_stmt, new_vars, stmts, str, val_new_var, val_stmt; 
   
   new_vars = this.identifiers.getLevValHolderVars(); 
   lev_new_var = new_vars.lev_holder;
   val_new_var = new_vars.val_holder;
   
   str = '{0} = {1};';
   str = $.validator.format(str, lev_new_var, comp.identifiers.consts.PC_IDENT); 
   lev_stmt = window.util.parseStmt(str);
   
   str = '{0} = this;';
   str = $.validator.format(str, val_new_var); 
   val_stmt = window.util.parseStmt(str);
   
   expr = $.extend(true, {}, this_expr);
   return {
      stmts: [
         lev_stmt, 
         val_stmt
      ],
      lev_new_vars: [ lev_new_var ],
      val_new_vars: [ val_new_var ],
      expr_val: window.esprima.delegate.createIdentifier(val_new_var),
      expr_lev: window.esprima.delegate.createIdentifier(lev_new_var) 
   };
}; 

comp.compileUnOpExpr = function (un_op_expr) {
   var ret, stmts, new_vars, expr_val, expr_lev, lev_new_var, 
         val_new_var, assign_lev_stmt, assign_val_stmt,
         lev_new_vars, val_new_vars;
   
   ret = this.compile(un_op_expr.argument);
   stmts = ret.stmts;
   lev_new_vars = ret.lev_new_vars;
   val_new_vars = ret.val_new_vars;  
   expr_val = window.esprima.delegate.createUnaryExpression(un_op_expr.operator, $.extend(true, {}, ret.expr_val)); 
   expr_lev = ret.expr_lev; 
   
   new_vars = this.identifiers.getLevValHolderVars(); 
   lev_new_var = new_vars.lev_holder;
   val_new_var = new_vars.val_holder;
   lev_new_vars.push(lev_new_var); 
   val_new_vars.push(val_new_var);
   
    //Illegal Coercion
   stmt = comp.computeCoercionConstraint(ret.expr_val); 
   stmts.push(stmt);
   
   assign_lev_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(lev_new_var), 
   	  $.extend(true, {}, expr_lev));
   assign_lev_stmt = window.esprima.delegate.createExpressionStatement(assign_lev_stmt);	 
   stmts.push(assign_lev_stmt);
   
   assign_val_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(val_new_var), 
   	  $.extend(true, {}, expr_val)); 
   assign_val_stmt = window.esprima.delegate.createExpressionStatement(assign_val_stmt);	 
   stmts.push(assign_val_stmt);
   
   return {
      stmts: stmts, 
      lev_new_vars: lev_new_vars,
      val_new_vars: val_new_vars,
      expr_val: $.extend(true, {}, expr_val),
      expr_lev: $.extend(true, {}, expr_lev) 
   };
}; 

comp.compileBinOpExpr = function (bin_op_expr) {
   var stmts, ret_left, ret_right, new_vars; 
   var expr_val, expr_lev, runtime_lat_lub_st; 
   var new_vars, lev_new_var, val_new_var, lev_new_vars, val_new_vars; 
   var assign_val_stmt, assign_lev_stmt; 
   
   ret_left = this.compile(bin_op_expr.left);
   stmts = ret_left.stmts;
   lev_new_vars = ret_left.lev_new_vars; 
   val_new_vars = ret_left.val_new_vars;
   
   ret_right = this.compile(bin_op_expr.right);
   stmts = stmts.concat(ret_right.stmts);
   lev_new_vars = lev_new_vars.concat(ret_right.lev_new_vars); 
   val_new_vars = val_new_vars.concat(ret_right.val_new_vars); 
   
   expr_val = window.esprima.delegate.createBinaryExpression(bin_op_expr.operator, 
      $.extend(true, {}, ret_left.expr_val), 
      $.extend(true, {}, ret_right.expr_val)); 
   
   runtime_lat_lub_st = window.util.parseExpr(comp.identifiers.consts.RUNTIME_IDENT + '.lat.lub');
   expr_lev = window.esprima.delegate.createCallExpression(runtime_lat_lub_st, [
      $.extend(true, {}, ret_left.expr_lev), 
      $.extend(true, {}, ret_right.expr_lev)]); 
   
   new_vars = this.identifiers.getLevValHolderVars(); 
   lev_new_var = new_vars.lev_holder;
   val_new_var = new_vars.val_holder;
   val_new_vars.push(val_new_var); 
   lev_new_vars.push(lev_new_var);
   
    //Illegal Coercion
   stmt = comp.computeCoercionConstraint(ret_left.expr_val); 
   stmts.push(stmt);
   stmt = comp.computeCoercionConstraint(ret_right.expr_val); 
   stmts.push(stmt);
   
   
   assign_lev_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(lev_new_var), 
   	  $.extend(true, {}, expr_lev));
   assign_lev_stmt = window.esprima.delegate.createExpressionStatement(assign_lev_stmt);	 
   stmts.push(assign_lev_stmt);
 
   assign_val_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(val_new_var), 
   	  $.extend(true, {}, expr_val)); 
   assign_val_stmt = window.esprima.delegate.createExpressionStatement(assign_val_stmt);	 
   stmts.push(assign_val_stmt);
   
   return {
      stmts: stmts, 
      val_new_vars: val_new_vars,
      lev_new_vars: lev_new_vars, 
      expr_val: window.esprima.delegate.createIdentifier(val_new_var),
      expr_lev: window.esprima.delegate.createIdentifier(lev_new_var)
   };
}; 



comp.compileAssignmentExpr = function (assign_expr) {
   if (assign_expr.left.type == 'MemberExpression') {
      return this.compilePropertyUpdateExpr(assign_expr);  
   } else {
   	return this.compileVarAssignmentExpr(assign_expr); 
   }
}; 

comp.compileVarAssignmentExpr = function (assign_expr) {
   var ret, stmts, new_vars; 
   var val_new_vars, lev_new_vars; 
   var shadow_name; 
   var assign_val_stmt, assign_lev_stmt; 
   var check_stmt, str; 
   
   ret = this.compile(assign_expr.right);
   stmts = ret.stmts;
   val_new_vars = ret.val_new_vars;
   lev_new_vars = ret.lev_new_vars;  
   
   shadow_name = comp.identifiers.getShadowVar(assign_expr.left.name);
   
   // $check($runtime.lat.leq($pc, $shadow_x)); 
   str = '{0}({1}.lat.leq({2}, {3}))'; 
   str = $.validator.format(str, 
   	  comp.identifiers.consts.CHECK_IDENT, 
   	  comp.identifiers.consts.RUNTIME_IDENT, 
   	  comp.identifiers.consts.PC_IDENT, 
   	  shadow_name); 
   check_stmt = window.util.parseStmt(str);
   stmts.push(check_stmt);
   
   assign_lev_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(shadow_name), 
   	  $.extend(true, {}, ret.expr_lev));
   assign_lev_stmt = window.esprima.delegate.createExpressionStatement(assign_lev_stmt);	 
   stmts.push(assign_lev_stmt);
   
   assign_val_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(assign_expr.left.name), 
   	  $.extend(true, {}, ret.expr_val)); 
   assign_val_stmt = window.esprima.delegate.createExpressionStatement(assign_val_stmt);	 
   stmts.push(assign_val_stmt);
   
   return {
      stmts: stmts, 
      val_new_vars: val_new_vars,
      lev_new_vars: lev_new_vars,  
      expr_val: ret.expr_val,
      expr_lev: ret.expr_lev 
   };
}; 



/*
 * Property Look-Up Expression
 * Original Code: e_1[e_2]^i
 * C[e1] = e1'
 * C[e2] = e2'
 * Compilied Code:
 * e1'
 * e2'
 * $iflow_sig = $register($val_e1, $val_e2);  
 * if($iflow_sig) {
 *    $iflow_sig.check($val_e1, $val_e2, $lev_e1, $lev_e2); 
 *    $val_i = $val_e1[$val_e2]; 
 *    $lev_i = $iflow_sig.label($val_i, $val_e1, $val_e2, $lev_e1, $lev_e2);  
 * } else {
 * 	    
 * }
 */
comp.compilePropLookUpExpr = function (prop_lookup_expr) {
   var stmts, ret_obj, ret_prop, prop_expr; 
   var expr_val, expr_lev, runtime_lat_lub_st; 
   var new_vars, lev_new_var, val_new_var, lev_new_vars, val_new_vars; 
   var str, assign_iflow_sig_stmt; 
   var compiled_if, compiled_uninstrumented_lookup, compiled_instrumented_lookup; 
   var  obj_expr_val_str, prop_expr_val_str;
  
   if (!prop_lookup_expr.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(prop_lookup_expr.property.name);	
   } else {
   	  prop_expr = prop_lookup_expr.property;
   }
   
   ret_object = this.compile(prop_lookup_expr.object);
   stmts = ret_object.stmts;
   lev_new_vars = ret_object.lev_new_vars; 
   val_new_vars = ret_object.val_new_vars;
   
   ret_prop = this.compile(prop_expr);
   stmts = stmts.concat(ret_prop.stmts);
   lev_new_vars = lev_new_vars.concat(ret_prop.lev_new_vars); 
   val_new_vars = val_new_vars.concat(ret_prop.val_new_vars); 

   new_vars = this.identifiers.getLevValHolderVars(); 
   lev_new_var = new_vars.lev_holder;
   val_new_var = new_vars.val_holder;
   val_new_vars.push(val_new_var); 
   lev_new_vars.push(lev_new_var);
  
   obj_expr_val_str = window.util.printExprST(ret_object.expr_val);
   prop_expr_val_str = window.util.printExprST(ret_prop.expr_val);
   
   //$iflow_sig = $register($val_e1, $val_e2);  
   str = '{0} = {1}({2}, {3});'; 
   str = $.validator.format(str, 
      comp.identifiers.consts.IFLOW_SIG_IDENT, 
	  comp.identifiers.consts.IFLOW_REG_IDENT,
	  obj_expr_val_str, prop_expr_val_str);
   assign_iflow_sig_stmt = window.util.parseStmt(str);
   stmts.push(assign_iflow_sig_stmt); 
	            
   // if($iflow_sig) {  } else {  }
   str = 'if({0}) {} else {}'; 
   str = $.validator.format(str, this.identifiers.consts.IFLOW_SIG_IDENT); 
   compiled_if = window.util.parseStmt(str);
   stmts.push(compiled_if);  

   
   compiled_uninstrumented_lookup = this.compileUnInstrumentedLookUpExpr(ret_object.expr_val, ret_object.expr_lev, 
   	  ret_prop.expr_val, ret_prop.expr_lev, val_new_var, lev_new_var);
   
   compiled_instrumented_lookup = this.compileInstrumentedLookUpExpr(ret_object.expr_val, ret_object.expr_lev, 
   	  ret_prop.expr_val, ret_prop.expr_lev, val_new_var, lev_new_var);	
	
	
   compiled_if.consequent.body = compiled_uninstrumented_lookup; 
   compiled_if.alternate.body = compiled_instrumented_lookup;
	
   return {
   	  stmts: stmts, 
   	  val_new_vars: val_new_vars,
      lev_new_vars: lev_new_vars,  
      expr_val: window.esprima.delegate.createIdentifier(val_new_var),
      expr_lev: window.esprima.delegate.createIdentifier(lev_new_var) 
   };
};




/*
 * Property Look-Up Expression
 * $check(..., 'Illegal Coercion');
 * $lev = $runtime.lat.lub($lev_o, $lev_p, $inspect($val_o, $val_p));
 * if ($val_p in $val_o) {
 *   $lev = $runtime.lat.lub($lev, $val_o[$shadowV($val_p)])
 * } 
 * $check($legal($val_p));
 * $val = $val_o[$val_p];
 */
comp.compileInstrumentedLookUpExpr = function (obj_expr_val, obj_expr_lev, prop_expr_val, prop_expr_lev, val_var, lev_var) {
    var obj_expr_val_str, obj_expr_lev_str, prop_expr_val_str, prop_expr_lev_str; 
    var stmts, str;
    var lev_init_stmt, check_legal_stmt, val_updt_stmt; 
    
    obj_expr_val_str = window.util.printExprST(obj_expr_val);
    obj_expr_lev_str = window.util.printExprST(obj_expr_lev);
    prop_expr_val_str = window.util.printExprST(prop_expr_val);
    prop_expr_lev_str = window.util.printExprST(prop_expr_lev);
   
    stmts = []; 
   
    //Illegal Coercion
    stmt = comp.computeCoercionConstraint(prop_expr_val); 
    stmts.push(stmt);
   
    //$lev = $runtime.lat.lub($lev_o, $lev_p, $inspect($val_o, $val_p));
    str = '{0} = {1}.lat.lub({2}, {3}, {4}({5}, {6}))';
    str = $.validator.format(str, 
       lev_var,
       comp.identifiers.consts.RUNTIME_IDENT, 
       obj_expr_lev_str, 
       prop_expr_lev_str, 
       comp.identifiers.consts.INSPECT_IDENT, 
       obj_expr_val_str, 
       prop_expr_val_str); 
    lev_init_stmt = window.util.parseStmt(str);
    stmts.push(lev_init_stmt);
    
    // if ($val_p in $val_o) { $lev = $runtime.lat.lub($lev, $val_o[$shadowV($val_p)]) } 
    str = 'if ({2} in {1}) { {3} = {0}.lat.lub({3}, {1}[{4}({2})])  }';
    str = $.validator.format(str, 
   	   comp.identifiers.consts.RUNTIME_IDENT, 
   	   obj_expr_val_str,
   	   prop_expr_val_str, 
   	   lev_var, 
   	   comp.identifiers.consts.PROP_DYN_SHADOW); 
    lev_init_stmt = window.util.parseStmt(str);
    stmts.push(lev_init_stmt);
    
    // $check($legal($val_p));
    str = '{0}({1}({2}));'; 
    str = $.validator.format(str, 
   	   comp.identifiers.consts.CHECK_IDENT, 
   	   comp.identifiers.consts.LEGAL_IDENT,
   	   prop_expr_val_str);
    check_legal_stmt = window.util.parseStmt(str);
    stmts.push(check_legal_stmt);
    
    // $val = $val_o[$val_p];
    str = '{0} = {1}[{2}];'; 
    str = $.validator.format(str, val_var, obj_expr_val_str, prop_expr_val_str);
    val_updt_stmt = window.util.parseStmt(str);
    stmts.push(val_updt_stmt);
   
    return stmts; 
};


/*
   $iflow_sig.check($lev_o, $lev_p, $val_o, $val_p); 
   $val = $val_o[$val_p]
   $lev = $iflow_sig.label($val, $lev_o, $lev_p, $val_o, $val_p); 
*/
comp.compileUnInstrumentedLookUpExpr = function (obj_expr_val, obj_expr_lev, prop_expr_val, prop_expr_lev, val_var, lev_var) {
    var obj_expr_val_str, obj_expr_lev_str, prop_expr_val_str, prop_expr_lev_str; 
    var stmts, str;
    var check_stmt, val_updt_stmt, lev_updt_stmt; 
    
    obj_expr_val_str = window.util.printExprST(obj_expr_val);
    obj_expr_lev_str = window.util.printExprST(obj_expr_lev);
    prop_expr_val_str = window.util.printExprST(prop_expr_val);
    prop_expr_lev_str = window.util.printExprST(prop_expr_lev);
   
    stmts = []; 
   
    // $iflow_sig.check($lev_o, $lev_p, $val_o, $val_p); 
    str = '{0}.check({1}, {2}, {3}, {4});'; 
    str = $.validator.format(str, 
      comp.identifiers.consts.IFLOW_SIG_IDENT, 
      obj_expr_lev_str, 
      prop_expr_lev_str,
      obj_expr_val_str, 
      prop_expr_val_str);
    check_stmt = window.util.parseStmt(str);
    stmts.push(check_stmt);  
    
    // $val = $val_o[$val_p];
    str = '{0} = {1}[{2}];'; 
    str = $.validator.format(str, val_var, obj_expr_val_str, prop_expr_val_str);
    val_updt_stmt = window.util.parseStmt(str);
    stmts.push(val_updt_stmt);
	
    //$lev = $iflow_sig.label($val, $lev_o, $lev_p, $val_o, $val_p);
    str = '{0} = {1}.label({2}, {3}, {4}, {5}, {6});';
    str = $.validator.format(str, 
       lev_var, 
       comp.identifiers.consts.IFLOW_SIG_IDENT,  
       val_var, 
       obj_expr_lev_str, 
       prop_expr_lev_str,
       obj_expr_val_str, 
       prop_expr_val_str);
    lev_updt_stmt = window.util.parseStmt(str);
    stmts.push(lev_updt_stmt);
   
    return stmts; 
};

/*
 * 
 * e_p
 * e_o
 * $lev = $runtime.lat.lub($lev_p, $lev_o, $inspect($val_o, $val_p));
 * if ($runtime.hasOwnProperty($val_o, $val_p)) {
 *   $lev = $runtime.lat.lub($lev, $val_o[$shadowE($val_p)])
 * } 
 * $check($legal($val_p));
 * $val = $val_p in $val_o;
*/
comp.compileMembershipTestingExpr = function (in_expr) {
   var str, stmts, ret_obj, ret_prop; 
   var obj_expr_val_str, obj_expr_lev_str, prop_expr_val_str, prop_expr_lev_str;
   var new_vars, lev_new_var, val_new_var, lev_new_vars, val_new_vars; 
   var lev_init_stmt, check_legal_stmt, val_updt_stmt; 
     
   ret_prop = this.compile(in_expr.left);
   stmts = ret_prop.stmts;
   lev_new_vars = ret_prop.lev_new_vars; 
   val_new_vars = ret_prop.val_new_vars;
   
   ret_obj = this.compile(in_expr.right);
   stmts = stmts.concat(ret_obj.stmts);
   lev_new_vars = lev_new_vars.concat(ret_obj.lev_new_vars); 
   val_new_vars = val_new_vars.concat(ret_obj.val_new_vars); 
 
   obj_expr_val_str = window.util.printExprST(ret_obj.expr_val);
   obj_expr_lev_str = window.util.printExprST(ret_obj.expr_lev);
   prop_expr_val_str = window.util.printExprST(ret_prop.expr_val);
   prop_expr_lev_str = window.util.printExprST(ret_prop.expr_lev);

   new_vars = this.identifiers.getLevValHolderVars(); 
   lev_new_var = new_vars.lev_holder;
   val_new_var = new_vars.val_holder;
   val_new_vars.push(val_new_var); 
   lev_new_vars.push(lev_new_var);
  
   //Illegal Coercion
   stmt = comp.computeCoercionConstraint(ret_prop.expr_val); 
   stmts.push(stmt);
  
   //$lev = $runtime.lat.lub($lev_o, $lev_p, $inspect($val_o, $val_p));
   str = '{0} = {1}.lat.lub({2}, {3}, {4}({5}, {6}))';
   str = $.validator.format(str, 
       lev_new_var,
       comp.identifiers.consts.RUNTIME_IDENT, 
       obj_expr_lev_str, 
       prop_expr_lev_str, 
       comp.identifiers.consts.INSPECT_IDENT, 
       obj_expr_val_str, 
       prop_expr_val_str); 
   lev_init_stmt = window.util.parseStmt(str);
   stmts.push(lev_init_stmt);
   
    // if ($runtime.hasOwnProperty($val_o, $val_p)) { $lev = $runtime.lat.lub($lev, $val_o[$shadowE($val_p)]) } 
    str = 'if ({2} in {1}) { {3} = {0}.lat.lub({3}, {1}[{4}({2})])  }';
    str = $.validator.format(str, 
   	   comp.identifiers.consts.RUNTIME_IDENT, 
   	   obj_expr_val_str,
   	   prop_expr_val_str, 
   	   lev_new_var, 
   	   comp.identifiers.consts.EXIST_DYN_SHADOW); 
    lev_init_stmt = window.util.parseStmt(str);
    stmts.push(lev_init_stmt);
   
    // $check($legal($val_p));
    str = '{0}({1}({2}));'; 
    str = $.validator.format(str, 
   	   comp.identifiers.consts.CHECK_IDENT, 
   	   comp.identifiers.consts.LEGAL_IDENT,
   	   prop_expr_val_str);
    check_legal_stmt = window.util.parseStmt(str);
    stmts.push(check_legal_stmt);
    
    // $val = $val_p in $val_o;
    str = '{0} = {1} in {2};'; 
    str = $.validator.format(str, val_new_var, prop_expr_val_str, obj_expr_val_str);
    val_updt_stmt = window.util.parseStmt(str);
    stmts.push(val_updt_stmt);
    
    return {
   	  stmts: stmts, 
   	  val_new_vars: val_new_vars,
      lev_new_vars: lev_new_vars,  
      expr_val: window.esprima.delegate.createIdentifier(val_new_var),
      expr_lev: window.esprima.delegate.createIdentifier(lev_new_var) 
    };
};

/*
 * Original Code: o[ê_0] = ê_1 
 * Compilied Code:
 * e_0'
 * e_1'
 * e_2'
 * $check($legal($val_p));
 * if ($runtime.hasOwnProperty($val_o, $val_p)) {
 *   $check($runtime.lat.leq($runtime.lat.lub($lev_o, $lev_p), $val_o[$shadowV($val_p)]));
 * } else {
 * 	 $check($runtime.lat.leq($runtime.lat.lub($lev_o, $lev_p), $val_o.$struct));
 *   $val_o[$shadowE($val_p)] = $runtime.lat.lub($lev_o, $lev_p);
 * }
 * $val_o[$shadowV($val_p)] = $runtime.lat.lub($lev_o, $lev_p, $lev_right); 
 * $val_o[$val_p] = $val_right;
 */
comp.compilePropertyUpdateExpr = function (prop_updt_expr) {
   var str, stmts, ret_obj, ret_prop, ret_right, prop_expr; 
   var new_vars, lev_new_var, val_new_var, lev_new_vars, val_new_vars; 
   var obj_expr_val_str, obj_expr_lev_str, prop_expr_val_str, prop_expr_lev_str, right_expr_val_str, right_expr_lev_str;
   var if_stmt, check_legal_stmt, check_then_stmt, check_else_stmt, lev_updt, val_updt; 
   var normal_comp_stmts; 
    
   if (!prop_updt_expr.left.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(prop_updt_expr.left.property.name);	
   } else {
   	  prop_expr = prop_updt_expr.left.property;
   }
   
   ret_obj = this.compile(prop_updt_expr.left.object);
   stmts = ret_obj.stmts;
   lev_new_vars = ret_obj.lev_new_vars; 
   val_new_vars = ret_obj.val_new_vars;
   
   ret_prop = this.compile(prop_expr);
   stmts = stmts.concat(ret_prop.stmts);
   lev_new_vars = lev_new_vars.concat(ret_prop.lev_new_vars); 
   val_new_vars = val_new_vars.concat(ret_prop.val_new_vars); 
   
   ret_right = this.compile(prop_updt_expr.right);
   stmts = stmts.concat(ret_right.stmts);
   lev_new_vars = lev_new_vars.concat(ret_right.lev_new_vars); 
   val_new_vars = val_new_vars.concat(ret_right.val_new_vars); 
   
   obj_expr_val_str = window.util.printExprST(ret_obj.expr_val);
   obj_expr_lev_str = window.util.printExprST(ret_obj.expr_lev);
   prop_expr_val_str = window.util.printExprST(ret_prop.expr_val);
   prop_expr_lev_str = window.util.printExprST(ret_prop.expr_lev);
   right_expr_val_str = window.util.printExprST(ret_right.expr_val);
   right_expr_lev_str = window.util.printExprST(ret_right.expr_lev);
   
   //Illegal Coercion
   stmt = comp.computeCoercionConstraint(ret_prop.expr_val); 
   stmts.push(stmt);
   
    // $check($legal($val_p));
    str = '{0}({1}({2}));'; 
    str = $.validator.format(str, 
   	   comp.identifiers.consts.CHECK_IDENT, 
   	   comp.identifiers.consts.LEGAL_IDENT,
   	   prop_expr_val_str);
    check_legal_stmt = window.util.parseStmt(str);
    stmts.push(check_legal_stmt);
    
    normal_comp_stmts = [];
    
    // if ($runtime.hasOwnProperty($val_o, $val_p)) { } else { }
    str = 'if ({0}.hasOwnProperty({1}, {2})) { } else { }'; 
    str = $.validator.format(str, 
   	   comp.identifiers.consts.RUNTIME_IDENT, 
   	   obj_expr_val_str,
   	   prop_expr_val_str);
    if_stmt = window.util.parseStmt(str);
    normal_comp_stmts.push(if_stmt);
    
    // $check($runtime.lat.leq($runtime.lat.lub($lev_o, $lev_p), $val_o[$shadowV($val_p)]));
    str = '{0}({1}.lat.leq({1}.lat.lub({2}, {3}), {4}[{5}({6})]));';
    str = $.validator.format(str, 
       comp.identifiers.consts.CHECK_IDENT,
   	   comp.identifiers.consts.RUNTIME_IDENT, 
   	   obj_expr_lev_str, 
   	   prop_expr_lev_str,
   	   obj_expr_val_str, 
   	   comp.identifiers.consts.PROP_DYN_SHADOW, 
   	   prop_expr_val_str);
    check_then_stmt = window.util.parseStmt(str);
    if_stmt.consequent.body = [ check_then_stmt ]; 
    
    //$check($runtime.lat.leq($runtime.lat.lub($lev_o, $lev_p), $val_o.$struct));
    str = '{0}({1}.lat.leq({1}.lat.lub({2}, {3}), {4}.{5}));';
    str = $.validator.format(str, 
       comp.identifiers.consts.CHECK_IDENT,
   	   comp.identifiers.consts.RUNTIME_IDENT, 
   	   obj_expr_lev_str, 
   	   prop_expr_lev_str,
   	   obj_expr_val_str,
   	   comp.identifiers.consts.STRUCT_PROP_IDENT);
    check_else_stmt = window.util.parseStmt(str);
    
    // $val_o[$shadowE($val_p)] = $runtime.lat.lub($lev_o, $lev_p);
    str = '{0}[{1}({2})] = {3}.lat.lub({4}, {5});';
    str = $.validator.format(str, 
       obj_expr_val_str, 
       comp.identifiers.consts.EXIST_DYN_SHADOW, 
       prop_expr_val_str, 
       comp.identifiers.consts.RUNTIME_IDENT,
       obj_expr_lev_str, 
       prop_expr_lev_str);
    lev_updt = window.util.parseStmt(str);
    
    if_stmt.alternate.body = [ check_else_stmt, lev_updt ];
    
    // $val_o[$shadowV($val_p)] = $runtime.lat.lub($lev_o, $lev_p, $lev_right);
    str = '{0}[{1}({2})] = {3}.lat.lub({4}, {5}, {6});';
    str = $.validator.format(str, 
       obj_expr_val_str, 
       comp.identifiers.consts.PROP_DYN_SHADOW,
       prop_expr_val_str, 
       comp.identifiers.consts.RUNTIME_IDENT,
       obj_expr_lev_str, 
       prop_expr_lev_str, 
       right_expr_lev_str);
    lev_updt = window.util.parseStmt(str);
    normal_comp_stmts.push(lev_updt);
    
    // $val_o[$val_p] = $val_right;
    str = '{0}[{1}] = {2};';
    str = $.validator.format(str, 
       obj_expr_val_str, 
       prop_expr_val_str,
       right_expr_val_str); 
    val_updt = window.util.parseStmt(str);
    normal_comp_stmts.push(val_updt);
    
    stmts = stmts.concat(this.generateIFlowSigWrapperPropUdpt(
    	  obj_expr_val_str, 
    	  prop_expr_val_str, 
    	  right_expr_val_str, 
          obj_expr_lev_str,
          prop_expr_lev_str, 
          right_expr_lev_str, 
          normal_comp_stmts));
    
    return {
      stmts: stmts, 
      lev_new_vars: lev_new_vars,
      val_new_vars: val_new_vars,
      expr_val: ret_right.expr_val,
      expr_lev: ret_right.expr_lev 
    };
}; 


/*
 * 
 * $iflow_sig = $register($val_obj, $val_prop, 'update');  
 * if($iflow_sig) {
 *    $iflow_sig.check($val_obj, $val_prop, $val_right, $lev_obj, $lev_prop, $lev_right); 
 *    $val_obj[$val_prop] = $val_right; 
 *    $iflow_sig.label($val_obj, $val_prop, $val_right, $lev_obj, $lev_prop, $lev_right);  
 * } else {
 * 	      
 * }
 *  
 */
comp.generateIFlowSigWrapperPropUdpt = function (val_obj, val_prop, val_right, lev_obj, lev_prop, lev_right, normal_comp_stmts) {
	 var stmt, stmts, str;
     var compiled_if, check_stmt, val_updt_stmt, lev_updt_stmt; 
      
     stmts = []; 
     
     //$iflow_sig = $register($val_obj, $val_prop);  
     str = '{0} = {1}({2}, {3}, \'update\');'; 
     str = $.validator.format(str, 
        comp.identifiers.consts.IFLOW_SIG_IDENT, 
	    comp.identifiers.consts.IFLOW_REG_IDENT,
	    val_obj, val_prop);
     stmt = window.util.parseStmt(str);
     stmts.push(stmt); 
	            
     // if($iflow_sig) {  } else {  }
     str = 'if({0}) {} else {}'; 
     str = $.validator.format(str, this.identifiers.consts.IFLOW_SIG_IDENT); 
     compiled_if = window.util.parseStmt(str);
     stmts.push(compiled_if);  
   
     // $iflow_sig.check($lev_obj, $lev_prop, $lev_right, $val_obj, $val_prop, $val_right);
     str = '{0}.check({1}, {2}, {3}, {4}, {5}, {6});';
     str = $.validator.format(str, 
       comp.identifiers.consts.IFLOW_SIG_IDENT, 
       lev_obj, lev_prop, lev_right, 
       val_obj, val_prop, val_right);
     check_stmt = window.util.parseStmt(str);
    
     // $val_obj[$val_prop] = $val_right
     str = '{0}[{1}] = {2};';
      str = $.validator.format(str, 
       comp.identifiers.consts.IFLOW_SIG_IDENT, 
       val_obj, val_prop, val_right);
     val_updt_stmt = window.util.parseStmt(str);
	
     //$iflow_sig.label($lev_obj, $lev_prop,$lev_prop, $val_obj, $val_prop, $val_right);
     str = '{0}.label({1}, {2}, {3}, {4}, {5}, {6});';
     str = $.validator.format(str, 
       comp.identifiers.consts.IFLOW_SIG_IDENT, 
       lev_obj, lev_prop, lev_right, 
       val_obj, val_prop, val_right);
     lev_updt_stmt = window.util.parseStmt(str);
   
     compiled_if.consequent.body = [ check_stmt, val_updt_stmt, lev_updt_stmt]; 
     compiled_if.alternate.body = normal_comp_stmts;
	 
	 return stmts; 
};




/*
 * Original Code: {} 
 * Compilied Code:
 * $val = {}; 
 * $val.$struct = $pc; 
 * $val[$shadowE('_proto_')] = $pc;  
 * $val[$shadowV('_proto_')] = $pc; 
 * $lev = $pc;   
 */
comp.compileObjectExpr = function (obj_expr) {
    var new_vars, lev_new_var, val_new_var; 
    var str, stmt, stmts;
   
    stmts = []; 
    
    new_vars = this.identifiers.getLevValHolderVars(); 
    lev_new_var = new_vars.lev_holder;
    val_new_var = new_vars.val_holder;
   
    //$val = {}; 
    str = '{0} = {};';
    str = $.validator.format(str, val_new_var);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
   
    //$val.$struct = $pc; 
    str = '{0}.{1} = {2};';
    str = $.validator.format(str, 
   	   val_new_var, 
   	   comp.identifiers.consts.STRUCT_PROP_IDENT, 
   	   comp.identifiers.consts.PC_IDENT);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
   
    // $val[$shadowE('_proto_')] = $pc; 
    str = '{0}[{1}({2})] = {3}; ';
    str = $.validator.format(str, 
   	   val_new_var, 
   	   comp.identifiers.consts.EXIST_DYN_SHADOW,
   	   comp.identifiers.consts.PROTO_PROP_STR, 
   	   comp.identifiers.consts.PC_IDENT);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
    
    // $val[$shadowV('_proto_')] = $pc; 
    str = '{0}[{1}({2})] = {3}';
    str = $.validator.format(str, 
   	   val_new_var, 
   	   comp.identifiers.consts.PROP_DYN_SHADOW,
   	   comp.identifiers.consts.PROTO_PROP_STR, 
   	   comp.identifiers.consts.PC_IDENT);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
    
    // $lev = $pc;  
    str = '{0} = {1};';
    str = $.validator.format(str, 
   	   lev_new_var, 
   	   comp.identifiers.consts.PC_IDENT);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
    
    return {
       stmts: stmts, 
       lev_new_vars: [ lev_new_var ],
       val_new_vars: [ val_new_var ], 
       expr_val: window.esprima.delegate.createIdentifier(val_new_var),
       expr_lev: window.esprima.delegate.createIdentifier(lev_new_var)
    };
}; 

/* 
 * Original Code: delete e_o[e_p]
 * Compilied Code:
 * 
 * e_o'
 * e_p' 
 * $check($legal($val_p));
 * $check($runtimle.lat.leq($runtime.lat.lub($lev_o, $lev_p), $val_o[$shadowE($val_p)]);
 * $lev = $val_o[$shadowE($val_p)];
 * delete $val_o[$shadowE($val_p)];
 * delete $val_o[$shadowV($val_p)];
 * $val = delete $val_o[$val_p]
 */
comp.compileDeleteExpr = function (delete_expr) {
    var str, stmt, stmts, ret_obj, ret_prop, prop_expr; 
    var obj_expr_val_str, obj_expr_lev_str, prop_expr_val_str, prop_expr_lev_str;
    var new_vars, lev_new_var, val_new_var, lev_new_vars, val_new_vars;
   
    if (!delete_expr.argument.computed) {
       prop_expr = window.esprima.delegate.createLiteral2(delete_expr.argument.property.name);	
    } else {
   	   prop_expr = delete_expr.argument.property;
    }
   
    ret_obj = this.compile(delete_expr.argument.object);
    stmts = ret_obj.stmts;
    lev_new_vars = ret_obj.lev_new_vars; 
    val_new_vars = ret_obj.val_new_vars;
   
    ret_prop = this.compile(prop_expr);
    stmts = stmts.concat(ret_prop.stmts);
    lev_new_vars = lev_new_vars.concat(ret_prop.lev_new_vars); 
    val_new_vars = val_new_vars.concat(ret_prop.val_new_vars); 
   	
    new_vars = this.identifiers.getLevValHolderVars(); 
    lev_new_var = new_vars.lev_holder;
    val_new_var = new_vars.val_holder;
    val_new_vars.push(val_new_var); 
    lev_new_vars.push(lev_new_var);
   
    obj_expr_val_str = window.util.printExprST(ret_obj.expr_val);
    obj_expr_lev_str = window.util.printExprST(ret_obj.expr_lev);
    prop_expr_val_str = window.util.printExprST(ret_prop.expr_val);
    prop_expr_lev_str = window.util.printExprST(ret_prop.expr_lev);
   
   //Illegal Coercion
   stmt = comp.computeCoercionConstraint(ret_prop.expr_val); 
   stmts.push(stmt);
   
    // $check($legal($val_p));
    str = '{0}({1}({2}));'; 
    str = $.validator.format(str, 
   	   comp.identifiers.consts.CHECK_IDENT, 
   	   comp.identifiers.consts.LEGAL_IDENT,
   	   prop_expr_val_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);
    
    // $check($runtime.lat.leq($runtime.lat.lub($lev_o, $lev_p), $val_o[$shadowE($val_p)]));
    str = '{0}({1}.lat.leq({1}.lat.lub({2}, {3}), {4}[{5}({6})]));';
    str = $.validator.format(str, 
       comp.identifiers.consts.CHECK_IDENT,
   	   comp.identifiers.consts.RUNTIME_IDENT, 
   	   obj_expr_lev_str, 
   	   prop_expr_lev_str,
   	   obj_expr_val_str, 
   	   comp.identifiers.consts.EXIST_DYN_SHADOW, 
   	   prop_expr_val_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
     
    // $lev = $val_o[$shadowE($val_p)];
    str = '{0} = {1}[{2}({3})];'; 
    str = $.validator.format(str,
       lev_new_var, 
       obj_expr_val_str, 
       comp.identifiers.consts.EXIST_DYN_SHADOW,
       prop_expr_val_str); 
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);   
     
    // delete $val_o[$shadowE($val_p)];
    str = 'delete {0}[{1}({2})];';
    str = $.validator.format(str,
       obj_expr_val_str, 
       comp.identifiers.consts.EXIST_DYN_SHADOW, 
       prop_expr_val_str); 
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);  
    
    // delete $val_o[$shadowV($val_p)];
    str = 'delete {0}[{1}({2})];';
    str = $.validator.format(str,
       obj_expr_val_str, 
       comp.identifiers.consts.PROP_DYN_SHADOW, 
       prop_expr_val_str); 
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
    
    // $val = delete $val_o[$val_p]
    str = '{0} = delete {1}[{2}];';
    str = $.validator.format(str,
       val_new_var, 
       obj_expr_val_str, 
       prop_expr_val_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
    
    return {
       stmts: stmts, 
       lev_new_vars: lev_new_vars,
       val_new_vars: val_new_vars, 
       expr_val: window.esprima.delegate.createIdentifier(val_new_var),
       expr_lev: window.esprima.delegate.createIdentifier(lev_new_var)
    };
};


/*
 * Original Code: while(e_0) { s }, 
 * Compiled Code: 
 * e_0'
 * $pc_holder = $pc; 
 * $pc = $runtime.lat.lub($pc, $lev_0); 
 * while ($val_0) {
 * 	   s'
 *     e_0'
 * } 
 * $pc = $pc_holder; 
 */
comp.compileWhileStmt = function (while_stmt) { 
    var str, stmt, stmts, ret_test; 
    var test_expr_val_str, test_expr_lev_str;
    var lev_new_vars, val_new_vars, pc_holder;
    var ret_body, compiled_while; 
  
    ret_test = this.compile(while_stmt.test);
    stmts = ret_test.stmts;
    lev_new_vars = ret_test.lev_new_vars; 
    val_new_vars = ret_test.val_new_vars;
    pc_holder = this.identifiers.getPcHolderVar(); 
    lev_new_vars.push(pc_holder); 
    
    test_expr_val_str = window.util.printExprST(ret_test.expr_val);
    test_expr_lev_str = window.util.printExprST(ret_test.expr_lev);
    
    //Illegal Coercion
   stmt = comp.computeCoercionConstraint(ret_test.expr_val); 
   stmts.push(stmt);
    
    //$pc_holder = $pc; 
    str = '{0} = {1}';
    str = $.validator.format(str, 
   	   pc_holder,  
   	   this.identifiers.consts.PC_IDENT);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);
    
    // $pc = $runtime.lat.lub($pc, $lev_0); 
    str = '{0} = {1}.lat.lub({0}, {2});'; 
    str = $.validator.format(str, 
   	   this.identifiers.consts.PC_IDENT,
   	   comp.identifiers.consts.RUNTIME_IDENT, 
   	   test_expr_lev_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
 
    //while(ê) { s' }
    ret_body = this.compile(while_stmt.body);
    compiled_while = esprima.delegate.createWhileStatement(
      $.extend(true, {}, ret_test.expr_val), 
      esprima.delegate.createBlockStatement(
      	ret_body.stmts.concat(ret_test.stmts)));
    lev_new_vars = lev_new_vars.concat(ret_body.lev_new_vars); 
    val_new_vars = val_new_vars.concat(ret_body.val_new_vars);    
    stmts.push(compiled_while); 
   
    //_pc = _pc_holderi; 
    str = '{0} = {1};'; 
    str = $.validator.format(str, 
   	   this.identifiers.consts.PC_IDENT, 
   	   pc_holder);
    stmt = window.util.parseStmt(str); 
    stmts.push(stmt);
   
    return {
       stmts: stmts, 
       lev_new_vars: lev_new_vars,
       val_new_vars: val_new_vars
    }; 
};

/*
 * Original Code: if(e_0) { s_1 } else { s_2 }, C[s_1] = s_1', C[s_2] = s_2', C[e_0] = s_0', $val_0 , $lev_0
 * Compiled Code: 
 * s_0'
 * $pc_holder = $pc; 
 * $pc = $runtime.lat.lub($pc, $lev_0); 
 * if ($val_0) {
 * 	   s_0'
 * } else {
 * 	   s_1'
 * }
 * $pc = $pc_holder; 
 */
comp.compileIfStmt = function (if_stmt) { 
    var str, stmt, stmts, ret_test; 
    var test_expr_val_str, test_expr_lev_str;
    var lev_new_vars, val_new_vars, pc_holder;
    var ret_consequent, ret_alternate, compiled_if; 
    
    ret_test = this.compile(if_stmt.test);
    stmts = ret_test.stmts;
    lev_new_vars = ret_test.lev_new_vars; 
    val_new_vars = ret_test.val_new_vars;
    pc_holder = this.identifiers.getPcHolderVar(); 
    lev_new_vars.push(pc_holder); 
    
    test_expr_val_str = window.util.printExprST(ret_test.expr_val);
    test_expr_lev_str = window.util.printExprST(ret_test.expr_lev);
    
    //Illegal Coercion
    stmt = comp.computeCoercionConstraint(ret_test.expr_val); 
    stmts.push(stmt);
    
    //$pc_holder = $pc; 
    str = '{0} = {1}';
    str = $.validator.format(str, 
   	   pc_holder,  
   	   this.identifiers.consts.PC_IDENT);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);
    
    // $pc = $runtime.lat.lub($pc, $lev_0); 
    str = '{0} = {1}.lat.lub({0}, {2});'; 
    str = $.validator.format(str, 
   	   this.identifiers.consts.PC_IDENT,
   	   comp.identifiers.consts.RUNTIME_IDENT, 
   	   test_expr_lev_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
    
    // if ($val_0) {} else {}
    str = 'if ({0}) {} else {}';
    str = $.validator.format(str, test_expr_val_str); 
    compiled_if = window.util.parseStmt(str);
    stmts.push(compiled_if);
    
    // consequent
    ret_consequent = this.compile(if_stmt.consequent);
    compiled_if.consequent.body = ret_consequent.stmts; 
    lev_new_vars = lev_new_vars.concat(ret_consequent.lev_new_vars); 
    val_new_vars = val_new_vars.concat(ret_consequent.val_new_vars); 
    
    // alternate 
    if (if_stmt.alternate) {
      ret_alternate = this.compile(if_stmt.alternate);
      compiled_if.alterate.body = ret_alternate.stmts; 
      lev_new_vars = lev_new_vars.concat(ret_alternate.lev_new_vars); 
      val_new_vars = val_new_vars.concat(ret_alternate.val_new_vars); 
    }
    
    //_pc = _pc_holderi; 
    str = '{0} = {1};'; 
    str = $.validator.format(str, 
   	   this.identifiers.consts.PC_IDENT, 
   	   pc_holder);
    stmt = window.util.parseStmt(str); 
    stmts.push(stmt);
   
    return {
       stmts: stmts, 
       lev_new_vars: lev_new_vars,
       val_new_vars: val_new_vars
    }; 
  
}; 

comp.compileCallExpr = function (call_expr) {
	switch (call_expr.callee.type) { 
	   case 'Identifier':   
	      switch (call_expr.callee.name) {
	      	case 'upg_var':          return this.compileUpgdVarExpr(call_expr); 
	      	case 'upg_prop_val':     return this.compileUpgdPropValExpr(call_expr); 
	      	case 'upg_prop_exist':   return this.compileUpgdPropExistExpr(call_expr);
	      	case 'upg_struct':       return this.compileUpgdStructExpr(call_expr); 
	        default:                 return this.compileFunCallExpr(call_expr);;	
	      }
	   case 'MemberExpression': return this.compileMethodCallExpr(call_expr); 
	   default: throw new Error('Invalid Method Call'); 
	}
}; 


/*
 * Original code: upg_var(x, lev)
 * Compiled code:
 *  $check($runtime.lat.leq($pc, $shadow_x));
 *  $shadow_x = $runtime.lat.lub($pc, 'lev');
 */
comp.compileUpgdVarExpr = function (call_exp_st) {
   var stmt, stmts, str;
   var ident, shadow_ident;
   
   ident = call_exp_st.arguments[0].name;
   shadow_ident = comp.identifiers.getShadowVar(ident);
   stmts = [];
   	 
   // $check($runtime.lat.leq($pc, $shadow_x));
   str = '{0}({1}.lat.leq({2}, {3}));';
   str = $.validator.format(str,
      comp.identifiers.consts.CHECK_IDENT, 
      comp.identifiers.consts.RUNTIME_IDENT,
      comp.identifiers.consts.PC_IDENT, 
      shadow_ident);
   stmt = window.util.parseStmt(str);
   stmts.push(stmt);
      
   //$shadow_x = $runtime.lat.lub($pc, lev);
   str = '{0} = {1}.lat.lub({2}, {3})';
   str = $.validator.format(str,
      shadow_ident, 
      comp.identifiers.consts.RUNTIME_IDENT, 
      comp.identifiers.consts.PC_IDENT,
      call_exp_st.arguments[1].raw);
   stmt = window.util.parseStmt(str);
   stmts.push(stmt);
   
   return {
       stmts: stmts, 
       lev_new_vars: [],
       val_new_vars: []
    }; 
};


/*
 * Original code: upg_prop_val(o, 'p', 'lev')
 * Compiled code: 
 *  $check($runtime.lat.leq($pc, o[$shadowV('p')]));
 *  $check($runtime.hasOwnProperty(o, 'p'));
 *  o[$shadowV('p')] = $runtime.lat.lub($pc, 'lev');
 */
comp.compileUpgdPropValExpr = function (call_exp_st) {
	var stmt, stmts, str;
	var obj_str, prop_str, lev_str;  
	
	obj_str = call_exp_st.arguments[0].name;
	prop_str = call_exp_st.arguments[1].raw;
	lev_str = call_exp_st.arguments[2].raw;
	
	stmts = [];
	
	// $check($runtime.lat.leq($pc, o[$shadowV('p')]));
	str = '{0}({1}.lat.leq({2}, {3}[{4}({5})]));';
    str = $.validator.format(str,
       comp.identifiers.consts.CHECK_IDENT, 
       comp.identifiers.consts.RUNTIME_IDENT,
       comp.identifiers.consts.PC_IDENT, 
       obj_str, 
       comp.identifiers.consts.PROP_DYN_SHADOW,
       prop_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);
    
    
    // $check($runtime.hasOwnProperty(o, 'p'));
    str = '{0}({1}.hasOwnProperty({2}, {3}));';
    str = $.validator.format(str,
       comp.identifiers.consts.CHECK_IDENT, 
       comp.identifiers.consts.RUNTIME_IDENT,
       obj_str, 
       prop_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);
    
    // o[$shadowV('p')] = $runtime.lat.lub($pc, 'lev');
    str = '{0}[{1}({2})] = {3}.lat.lub({4}, {5});';
    str = $.validator.format(str,
       obj_str, 
       comp.identifiers.consts.PROP_DYN_SHADOW,
       prop_str, 
       comp.identifiers.consts.RUNTIME_IDENT,
       comp.identifiers.consts.PC_IDENT, 
       lev_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);
    
    return {
       stmts: stmts, 
       lev_new_vars: [],
       val_new_vars: []
    }; 
};



/*
 * Original code: upg_prop_exist(o, 'p', 'lev')
 * Compiled code: 
 *  $check($runtime.lat.leq($pc, o[$shadowE('p')]));
 *  $check($runtime.hasOwnProperty(o, 'p'));
 *  o[$shadowE('p')] = $runtime.lat.lub($pc, 'lev');
 */
comp.compileUpgdPropExistExpr = function (call_exp_st) {
	var stmt, stmts, str;
	var obj_str, prop_str, lev_str;  
	
	obj_str = call_exp_st.arguments[0].name;
	prop_str = call_exp_st.arguments[1].raw;
	lev_str = call_exp_st.arguments[2].raw;
	
	stmts = [];
	
	// $check($runtime.lat.leq($pc, o[$shadowV('p')]));
	str = '{0}({1}.lat.leq({2}, {3}[{4}({5})]));';
    str = $.validator.format(str,
       comp.identifiers.consts.CHECK_IDENT, 
       comp.identifiers.consts.RUNTIME_IDENT,
       comp.identifiers.consts.PC_IDENT, 
       obj_str, 
       comp.identifiers.consts.EXIST_DYN_SHADOW,
       prop_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);
    
    
    // $check($runtime.hasOwnProperty(o, 'p'));
    str = '{0}({1}.hasOwnProperty({2}, {3}));';
    str = $.validator.format(str,
       comp.identifiers.consts.CHECK_IDENT, 
       comp.identifiers.consts.RUNTIME_IDENT,
       obj_str, 
       prop_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);
    
    // o[$shadowV('p')] = $runtime.lat.lub($pc, 'lev');
    str = '{0}[{1}({2})] = {3}.lat.lub({4}, {5});';
    str = $.validator.format(str,
       obj_str, 
       comp.identifiers.consts.EXIST_DYN_SHADOW,
       prop_str, 
       comp.identifiers.consts.RUNTIME_IDENT,
       comp.identifiers.consts.PC_IDENT, 
       lev_str);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt);
    
    return {
       stmts: stmts, 
       lev_new_vars: [],
       val_new_vars: []
    }; 
};

/*
 * Original code: upg_struct(o, 'lev')
 * Compiled code: 
 *    $check($runtime.lat.leq($pc, o.$struct));
 *    o.$struct = $runtime.lat.lub($pc, 'lev');
 */
comp.compileUpgdStructExpr = function (call_exp_st) {
   var stmt, stmts, str;
   var obj_str, lev_str;  

   obj_str = call_exp_st.arguments[0].name;
   lev_str = call_exp_st.arguments[1].raw;
   
   stmts = []; 
   
   //$check($runtime.lat.leq($pc, o.$struct));
   str = '{0}({1}.lat.leq({2}, {3}.{4}));';
   str = $.validator.format(str, 
       comp.identifiers.consts.CHECK_IDENT, 
       comp.identifiers.consts.RUNTIME_IDENT,
       comp.identifiers.consts.PC_IDENT, 
       obj_str, 
       comp.identifiers.consts.STRUCT_PROP_IDENT); 
   stmt = window.util.parseStmt(str);
   stmts.push(stmt);
   
   // o.$struct = $runtime.lat.lub($pc, 'lev');
   str = '{0}.{1} = {2}.lat.lub({3}, {4});';
   str = $.validator.format(str, 
       obj_str, 
       comp.identifiers.consts.STRUCT_PROP_IDENT,
       comp.identifiers.consts.RUNTIME_IDENT,
       comp.identifiers.consts.PC_IDENT, 
       lev_str); 
   stmt = window.util.parseStmt(str);
   stmts.push(stmt);
      
   return {
       stmts: stmts, 
       lev_new_vars: [],
       val_new_vars: []
    }; 
};
   

/*
 * Function call
 * Original Code: e_0(e_1)^i 
 * Compilied Code: C[e_0] = e_0', $val_0, $lev_0; C[e_1] = e_1', $val_1, $lev_1
 * 
 * $iflow_sig = $register($val_0, $val_1);  
 * if($iflow_sig) {
 *    $iflow_sig.check($val_0, $val_1, $lev_0, $lev_1); 
 *    $val_i = $val_0[$val_1]; 
 *    $lev_i = $iflow_sig.label($val_i, $val_0, $val_1, $lev_0, $lev_1);  
 * } else {
 * 	      
 * }
 *  
 */
comp.generateIFlowSigWrapper = function (new_val_var, new_lev_var, ret_args, redex, normal_comp_stmts, funcall) {
	 var stmt, stmts, str;
	 var lev_vars, val_vars;
	 var lev_vars_string, val_vars_string; 
     var compiled_if, check_stmt, val_updt_stmt, lev_updt_stmt, local_eval_stmt; 
      
     lev_vars = []; 
     val_vars = [];
     stmts = []; 
     
     for (var i = 0, len = ret_args.length; i < len; i++) {
        val_vars.push(window.util.printExprST(ret_args[i].expr_val)); 
        lev_vars.push(window.util.printExprST(ret_args[i].expr_lev));
     }
     
     lev_vars_string = this.utils.varsToString(lev_vars); 
     val_vars_string = this.utils.varsToString(val_vars);
     
     //$iflow_sig = $register($val_e1, $val_e2);  
     str = '{0} = {1}({2}, {3});'; 
     str = $.validator.format(str, 
        comp.identifiers.consts.IFLOW_SIG_IDENT, 
	    comp.identifiers.consts.IFLOW_REG_IDENT,
	    val_vars[0], val_vars[1]);
     stmt = window.util.parseStmt(str);
     stmts.push(stmt); 
	            
     // if($iflow_sig) {  } else {  }
     str = 'if({0}) {} else {}'; 
     str = $.validator.format(str, this.identifiers.consts.IFLOW_SIG_IDENT); 
     compiled_if = window.util.parseStmt(str);
     stmts.push(compiled_if);  
   
     // $local_eval = function (x) { return eval(x); };
     // str = '{0}.check(' + comp.identifiers.consts.LOCAL_EVAL + ', ';
     /*
     str = '{0} = function (x) {return eval(x); }; ';
     str = $.validator.format(str, 
       comp.identifiers.consts.LOCAL_EVAL);
     local_eval_stmt = window.util.parseStmt(str);
     */
   
     if (funcall) {
         // $iflow_sig.check($local_eval, $lev_0, $lev_1,..., $lev_n, $val_0, $val_1, ...,$val_n); 
        str = '{0}.check(';
        str += lev_vars_string + ', ' + val_vars_string;
        str += ');'; 
        str = $.validator.format(str, 
           comp.identifiers.consts.IFLOW_SIG_IDENT);
        check_stmt = window.util.parseStmt(str);
     } else {
     	// $iflow_sig.check($lev_0, $lev_1,..., $lev_n, $val_0, $val_1, ...,$val_n); 
        str = '{0}.check(';
        str += lev_vars_string + ', ' + val_vars_string;
        str += ');'; 
        str = $.validator.format(str, 
           comp.identifiers.consts.IFLOW_SIG_IDENT);
        check_stmt = window.util.parseStmt(str);
     }
    
     // $val = redex_str
     val_updt_stmt = window.esprima.delegate.createAssignmentExpression(
   	   '=', 
   	   window.esprima.delegate.createIdentifier(new_val_var), 
   	   $.extend(true, {}, redex));
     val_updt_stmt = window.esprima.delegate.createExpressionStatement(val_updt_stmt);
	 
	/* if (funcall) {
	     //$iflow_sig.label($local_eval, $lev_0, $lev_1,..., $lev_n, $val_0, $val_1, ...,$val_n);
         str = comp.identifiers.consts.IFLOW_SIG_IDENT; 
         str += '.label(' + comp.identifiers.consts.LOCAL_EVAL + ', ' + lev_vars_string + ', ' + val_vars_string + ');'; 
         lev_updt_stmt = window.util.parseStmt(str);
	 } else {*/
	 	 //$lev = $iflow_sig.label($val, $lev_0, $lev_1,..., $lev_n, $val_0, $val_1, ...,$val_n);
         str = new_lev_var + ' = ' + comp.identifiers.consts.IFLOW_SIG_IDENT; 
         str += '.label(' + new_val_var + ', ' + lev_vars_string + ', ' + val_vars_string + ');'; 
         lev_updt_stmt = window.util.parseStmt(str);
	 //}
    
    /* if (funcall) {
        compiled_if.consequent.body = [ local_eval_stmt, check_stmt, lev_updt_stmt]; 	
     } else {*/
     	compiled_if.consequent.body = [ check_stmt, val_updt_stmt, lev_updt_stmt]; 
    // }
     
     compiled_if.alternate.body = normal_comp_stmts;
	 
	 return stmts; 
};


/*
 * Function call
 * Original Code: e_0(e_1)^i 
 * Compilied Code: C[e_0] = e_0', $val_0, $lev_0; C[e_1] = e_1', $val_1, $lev_1
 * 
 * $ret = $val_0($lev_0, $val_0, $lev_0, $val_1, $lev_1, ...)
 * $lev_i = $ret.lev;
 * $val_i = $ret.val;
 */
comp.compileFunCallExpr = function (call_expr) { 
    var str, stmt, stmts, ret_test; 
    var ret_fun, ret_arg, ret_args; 
    var processed_args, compiled_call; 
    var new_vars, lev_new_var, val_new_var, lev_new_vars, val_new_vars; 
    var normal_comp_stmts; 
    var fun_name; 
    var processed_same_funcall;
    
    ret_fun = this.compile(call_expr.callee);
    stmts = ret_fun.stmts;
    lev_new_vars = ret_fun.lev_new_vars; 
    val_new_vars = ret_fun.val_new_vars;
    
    ret_args = []; 
    for (var i = 0, len = call_expr.arguments.length; i < len; i++) {
       	ret_arg = this.compile(call_expr.arguments[i]); 
       	ret_args.push(ret_arg);
       	lev_new_vars = lev_new_vars.concat(ret_arg.lev_new_vars); 
       	val_new_vars = val_new_vars.concat(ret_arg.val_new_vars); 
       	stmts = stmts.concat(ret_arg.stmts);
    }
    
    new_vars = this.identifiers.getLevValHolderVars(); 
    lev_new_var = new_vars.lev_holder;
    val_new_var = new_vars.val_holder;
    val_new_vars.push(val_new_var); 
    lev_new_vars.push(lev_new_var);

    // Processed Funcall - but the same!!!!!
    processed_args = [];  
    for (var i = 0, len = ret_args.length; i < len; i++) {
       processed_args.push($.extend(true, {}, ret_args[i].expr_val));
    }
    processed_same_funcall = window.esprima.delegate.createCallExpression(
      $.extend(true, {}, ret_fun.expr_val),
      processed_args);
 
    
    normal_comp_stmts = []; 
    //$val_0($lev_0, $val_0, $lev_0, $val_1, $lev_1, ...)
    processed_args = this.computeArguments(ret_args);
    compiled_call = window.esprima.delegate.createCallExpression(
      $.extend(true, {}, ret_fun.expr_val),
      processed_args);
    stmt = window.esprima.delegate.createAssignmentExpression(
   	   '=', 
   	   window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT), 
   	   compiled_call);
    stmt = window.esprima.delegate.createExpressionStatement(stmt);
    normal_comp_stmts.push(stmt);
    	
    //$lev_i = $ret.lev;
    str = '{0} = {1}.{2};'; 
    str = $.validator.format(str, 
   	   lev_new_var, 
   	   comp.identifiers.consts.RET_IDENT, 
   	   comp.identifiers.consts.LEV_RET);
    stmt = window.util.parseStmt(str); 
    normal_comp_stmts.push(stmt);
    
    //$val_i = $ret.val;
    str = '{0} = {1}.{2};'; 
    str = $.validator.format(str, 
   	   val_new_var, 
   	   comp.identifiers.consts.RET_IDENT, 
   	   comp.identifiers.consts.VAL_RET);
    stmt = window.util.parseStmt(str); 
    normal_comp_stmts.push(stmt);
    
    //changed my mind about function calls as extension points :(
    if (call_expr.callee.type === 'Identifier') {
       ret_args.unshift({
       	  expr_val: window.esprima.delegate.createIdentifier(call_expr.callee.name),
       	  expr_lev: window.esprima.delegate.createIdentifier(comp.identifiers.consts.PC_IDENT)
       });
       
       ret_args.unshift({
          expr_val: window.esprima.delegate.createLiteral2('window'), 
    	  expr_lev: window.esprima.delegate.createIdentifier(comp.identifiers.consts.PC_IDENT)
       }); 
       
       stmts = stmts.concat(this.generateIFlowSigWrapper(val_new_var, lev_new_var, ret_args, 
          processed_same_funcall, normal_comp_stmts, true));
    } else {
       stmts = stmts.concat(normal_comp_stmts);
    }
    
    return {
       stmts: stmts, 
       lev_new_vars: lev_new_vars,
       val_new_vars: val_new_vars, 
       expr_val: window.esprima.delegate.createIdentifier(val_new_var),
       expr_lev: window.esprima.delegate.createIdentifier(lev_new_var)
    };
}; 




/*
 * Method call
 * Original Code: e_o[e_p](e_0, ..., e_n) 
 *  C(e_o) = e_o', $val_o, $lev_o 
 *  C(e_p) = e_p', $val_p, $lev_p
 *  C(e_i) = e_i', $val_i, $lev_i
 * Compiled Code: 
 * e_o', e_p', e_0', ..., e_n'
 * $check($legal($val_p));
 * $levCtxt = $runtime.lat.lub($lev_o, $lev_p, $inspect($val_o, $val_p)); 
 * $ret = $val_o[$val_p]($levCtxt, $val_0, $lev_0, ..., $val_n, $lev_n)
 * $lev = $ret.lev; 
 * $val = $ret.val;
 */
comp.compileMethodCallExpr = function (method_call_expr) {
	var str, stmt, stmts, ret_obj, ret_prop, ret_arg, ret_args, prop_expr; 
    var obj_expr_val_str, obj_expr_lev_str, prop_expr_val_str, prop_expr_lev_str;
    var new_vars, lev_new_var, val_new_var, lev_new_vars, val_new_vars;
    var processed_args, compiled_call, normal_comp_stmts; 
    var processed_same_methodcall;
    
    if (!method_call_expr.callee.computed) {
       prop_expr = window.esprima.delegate.createLiteral2(method_call_expr.callee.property.name);	
    } else {
   	   prop_expr = method_call_expr.callee.property;
    }
  
    
    ret_obj = this.compile(method_call_expr.callee.object);
    stmts = ret_obj.stmts;
    lev_new_vars = ret_obj.lev_new_vars; 
    val_new_vars = ret_obj.val_new_vars;
   
    ret_prop = this.compile(prop_expr);
    stmts = stmts.concat(ret_prop.stmts);
    lev_new_vars = lev_new_vars.concat(ret_prop.lev_new_vars); 
    val_new_vars = val_new_vars.concat(ret_prop.val_new_vars); 
   
    obj_expr_val_str = window.util.printExprST(ret_obj.expr_val);
    obj_expr_lev_str = window.util.printExprST(ret_obj.expr_lev);
    prop_expr_val_str = window.util.printExprST(ret_prop.expr_val);
    prop_expr_lev_str = window.util.printExprST(ret_prop.expr_lev);
    
    ret_args = []; 
    for (var i = 0, len = method_call_expr.arguments.length; i < len; i++) {
       	ret_arg = this.compile(method_call_expr.arguments[i]); 
       	ret_args.push(ret_arg);
       	lev_new_vars = lev_new_vars.concat(ret_arg.lev_new_vars); 
       	val_new_vars = val_new_vars.concat(ret_arg.val_new_vars); 
       	stmts = stmts.concat(ret_arg.stmts);
    }
     
    new_vars = this.identifiers.getLevValHolderVars(); 
    lev_new_var = new_vars.lev_holder;
    val_new_var = new_vars.val_holder;
    val_new_vars.push(val_new_var); 
    lev_new_vars.push(lev_new_var);
    normal_comp_stmts = []; 
    
    // $check($legal($val_p));
    str = '{0}({1}({2}));'; 
    str = $.validator.format(str, 
   	   comp.identifiers.consts.CHECK_IDENT, 
   	   comp.identifiers.consts.LEGAL_IDENT,
   	   prop_expr_val_str);
    stmt = window.util.parseStmt(str);
    normal_comp_stmts.push(stmt);
    
    // Processed Funcall - but the same!!!!!
    processed_args = [];  
    for (var i = 0, len = ret_args.length; i < len; i++) {
       processed_args.push($.extend(true, {}, ret_args[i].expr_val));
    }
    processed_same_methodcall = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createMemberExpression('[', 
      	 $.extend(true, {}, ret_obj.expr_val),
      	 $.extend(true, {}, ret_prop.expr_val)),
      processed_args);
    
    //$levCtxt = $runtime.lat.lub($lev_o, $lev_p, $inspect($val_o, $val_p)); 
    str = '{0} = {1}.lat.lub({2}, {3}, {4}({5}, {6}));';
    str = $.validator.format(str, 
   	   comp.identifiers.consts.LEV_CTXT_IDENT, 
   	   comp.identifiers.consts.RUNTIME_IDENT,
   	   obj_expr_lev_str, 
   	   prop_expr_lev_str, 
   	   comp.identifiers.consts.INSPECT_IDENT, 
   	   obj_expr_val_str, 
   	   prop_expr_val_str);
    stmt = window.util.parseStmt(str);
    normal_comp_stmts.push(stmt);
    
    //$ret = $val_o[$val_p]($pc, $lev_0, $val_0, $lev_0, $val_1, $lev_1, ...); 
    processed_args = this.computeArguments(ret_args);
    compiled_call = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createMemberExpression(
         '[', 
         $.extend(true, {}, ret_obj.expr_val),
         $.extend(true, {}, ret_prop.expr_val)), 
      processed_args);
    stmt = window.esprima.delegate.createAssignmentExpression(
   	   '=', 
   	   window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT), 
   	   compiled_call);
    stmt = window.esprima.delegate.createExpressionStatement(stmt);
    normal_comp_stmts.push(stmt);	   
    
    //$lev_i = $ret.lev;
    str = '{0} = {1}.{2};'; 
    str = $.validator.format(str, 
   	   lev_new_var, 
   	   comp.identifiers.consts.RET_IDENT, 
   	   comp.identifiers.consts.LEV_RET);
    stmt = window.util.parseStmt(str); 
    normal_comp_stmts.push(stmt);
    
    //$val_i = $ret.val;
    str = '{0} = {1}.{2};'; 
    str = $.validator.format(str, 
   	   val_new_var, 
   	   comp.identifiers.consts.RET_IDENT, 
   	   comp.identifiers.consts.VAL_RET);
    stmt = window.util.parseStmt(str); 
    normal_comp_stmts.push(stmt);
    
    ret_args.unshift(ret_prop);
    ret_args.unshift(ret_obj);
    stmts = stmts.concat(this.generateIFlowSigWrapper(val_new_var, lev_new_var, ret_args, 
          processed_same_methodcall, normal_comp_stmts, false));
    
    return {
       stmts: stmts, 
       lev_new_vars: lev_new_vars,
       val_new_vars: val_new_vars, 
       expr_val: window.esprima.delegate.createIdentifier(val_new_var),
       expr_lev: window.esprima.delegate.createIdentifier(lev_new_var)
    };
};

/*
 * Original Code: function(x_0, ..., x_n) { s }, C[s] = s', new_vars
 * Compiled body: s'' = 
 *     var new_vars; 
 *     var vars(s);
 *     s'
 * Compiled function literal: 
 *  $lev = $pc; 
 *  $val = function($pc, x1, $lev_x1, ..., xn, $lev_xn) { s'' };   
 */
comp.compileFunctionLiteralExpr = function (funlit_exp) {
    var new_vars, lev_new_var, val_new_var;
    var str, stmt, stmts; 
    var new_fun_lit;
	     
    new_vars = this.identifiers.getLevValHolderVars(); 
    lev_new_var = new_vars.lev_holder;
    val_new_var = new_vars.val_holder;
    stmts = []; 
    
    //$lev = $pc; 
    str = '{0} = {1}; '; 
    str = $.validator.format(str, 
       lev_new_var, 
       this.identifiers.consts.PC_IDENT);
    stmt = window.util.parseStmt(str);
    stmts.push(stmt); 
    
    new_fun_lit = this.computeNewFunctionLiteral(funlit_exp);
    stmt = window.esprima.delegate.createAssignmentExpression(
   	   '=', 
   	   window.esprima.delegate.createIdentifier(val_new_var), 
   	   new_fun_lit);
    stmt = window.esprima.delegate.createExpressionStatement(stmt);
    stmts.push(stmt);	   
    
    return {
       stmts: stmts, 
       lev_new_vars: [ lev_new_var ],
       val_new_vars: [ val_new_var ], 
       expr_val: window.esprima.delegate.createIdentifier(val_new_var),
       expr_lev: window.esprima.delegate.createIdentifier(lev_new_var)
    };
};


/* Original Code: function(x0, ..., xn) { s }, 
 * 
 *  C[s] = s', new_vars
 * Compiled Code
 *  function($pc, x0, $lev_x0, ..., xn, $lev_xn) { 
 *     var new_vars, $pc_base; 
 *     var vars(s);
 *     s'
 *  }
 */
comp.computeNewFunctionLiteral = function (funlit_exp) {
	var body, var_decls, params, process_params; 
	var ret_body, processed_fun_lit; 
	var lev_new_vars, val_new_vars, new_vars_str; 
	var stmt, stmts; 
	var str; 
	
	body = funlit_exp.body; 
	var_decls = comp.utils.getOriginalDeclarations(funlit_exp);
	params = funlit_exp.params;
	processed_params = comp.computeParams(params);
	processed_params.unshift(
       window.esprima.delegate.createIdentifier(comp.identifiers.consts.PC_IDENT));
	
	ret_body = this.compile(body);
    stmts = ret_body.stmts;
    lev_new_vars = ret_body.lev_new_vars; 
    val_new_vars = ret_body.val_new_vars;
     
    if (var_decls) {
       stmts = var_decls.concat(stmts);
    }
    
    if (lev_new_vars && (lev_new_vars.length > 0)) {
       new_vars_str = this.utils.varsToString(val_new_vars.concat(lev_new_vars));
       str = 'var ' + new_vars_str + ';';
       stmt = window.util.parseStmt(str);
       stmts.unshift(stmt);	
    }
    
    processed_fun_lit = window.esprima.delegate.createFunctionExpression(null, processed_params, [], 
    	window.esprima.delegate.createBlockStatement(stmts)); 
    return processed_fun_lit; 
};  


/*
 * Original Code: return e, 
 * C[e] = e', $v, $l
 * Compiled Code
 * e'
 * $check($runtime.lat.leq($pc, $pc_fun));
 * return {val: $v, lev: $l}
 */
comp.compileReturnStmt = function (ret_stmt) {
    var str, stmt, stmts, ret; 
    var prop_val, prop_lev;
    
    ret = this.compile(ret_stmt.argument);
    stmts = ret.stmts;
    
    // $check($runtime.lat.leq($pc, $pc_fun));
    str = '{0}({1}.lat.leq({2}, {3}));';
    str = $.validator.format(str, 
   	   comp.identifiers.consts.CHECK_IDENT, 
   	   comp.identifiers.consts.RUNTIME_IDENT, 
   	   comp.identifiers.consts.PC_IDENT, 
   	   comp.identifiers.consts.PC_FUN_IDENT);
    stmt = window.util.parseStmt(str); 
    stmts.push(stmt);
    
    // return {val: $v, lev: $l};
    // val: $v
    prop_val = window.esprima.delegate.createProperty('init',
      window.esprima.delegate.createIdentifier(this.identifiers.consts.VAL_RET), 
      $.extend(true, {}, ret.expr_val));
	
    //_lev: C_l[ê]
    prop_lev = window.esprima.delegate.createProperty('init',
       window.esprima.delegate.createIdentifier(this.identifiers.consts.LEV_RET), 
       $.extend(true, {}, ret.expr_lev));

    // return {val: $v, lev: $l};
    stmt = window.esprima.delegate.createReturnStatement(
       window.esprima.delegate.createObjectExpression([prop_val, prop_lev])); 
    stmts.push(stmt);
  
    return {
       stmts: stmts, 
       lev_new_vars: ret.lev_new_vars,
       val_new_vars: ret.val_new_vars
    };
   
}; 


// e_1, ..., e_n => $pc, $val_1, $lev_1, ..., $val_n, $lev_n 
comp.computeArguments = function(ret_args){
	var lev_arg, val_arg, compiled_args;
	
	compiled_args = [];  
	compiled_args.push(window.esprima.delegate.createIdentifier(this.identifiers.consts.PC_IDENT));
	for(var i=0, len=ret_args.length; i<len; i++){
		val_arg = $.extend(true, {}, ret_args[i].expr_val); 
		lev_arg = $.extend(true, {}, ret_args[i].expr_lev);
		compiled_args.push(val_arg);
		compiled_args.push(lev_arg);
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


comp.computeCoercionConstraint = function (expr) {
    var expr_str, str, stmt; 
    
    expr_str = window.util.printExprST(expr);
    
    str = '$check(((typeof {0}) === \'string\') || ((typeof {0}) === \'number\') || ((typeof {0}) === \'boolean\'), \'Illegal Coercion\');';
    str = $.validator.format(str, expr_str);
    stmt = window.util.parseStmt(str); 
    
    return stmt; 
};


