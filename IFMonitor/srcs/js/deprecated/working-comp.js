var comp = {
	AUX_IDENT: '_aux',
	LEV_VAR_IDENT: '_lev_',
	LEV_PROP_IDENT: '_lev', 
	PC_HOLDER: '_pc_holder_',  
	VAL_VAR_IDENT: '_val_',
	VAL_PROP_IDENT: '_val'  
}; 

comp.consts = {
	COMPUTE_NEW_OBJ_LEVEL_IDENT: '_GetNewObjLevel', 
   COMPUTE_RET_LEVEL_IDENT : '_computeReturnLevel',
   COMPUTE_RET_VALUE_IDENT: '_computeReturnValue',  
   ENFORCE_INSTR_IDENT : '_enforceInstr',
   GET_COMPUTE_RET_LEVEL_FUN_IDENT : '_GetComputeRetLevelFun',
   GET_COMPUTe_RET_VALUE_FUN_IDENT: '_GetComputeRetValueFun',
   GET_ENFORCE_FUN_IDENT : '_GetEnforceFun',
   GET_UPDATE_ARGS_LEVELS_FUN_IDENT : '_GetUpdateArgsFun', 
   UPDATE_ARGS_LEVELS_IDENT : '_updateArgsLevels', 
   UPGRADE_VAR_IDENT: 'upgVar', 
   UPGRADE_PROP_IDENT: 'upgProp', 
   UPGRADE_STRUCT_IDENT: 'upgStruct', 
   UPGRADE_URL_IDENT: 'upgUrlLev',
   UPGRADE_LEVEL_IDENT: 'upgLevel', 
   PROCESS_ARG: '_processArg', 
   PROCESS_RET_VALUE: '_processRetValue', 
   IS_VALID_OP_INVOCATION: '_isValidBinOpInvocation'
};

comp.getAuxIdentifierStr = function (i) {
   if (isFinite(i)) {
   	return comp.AUX_IDENT + '_' + i; 
   } else {
   	return comp.AUX_IDENT + '_1';  
   }
};

comp.getFreeValLevVars = (function () {
   var i = 0;
   return function() {
      var val_var = this.VAL_VAR_IDENT + i,
          lev_var = this.LEV_VAR_IDENT + i; 
      i++;
      return {
      	val_var: val_var, 
      	lev_var: lev_var
      };
   }
})();

comp.getPcHolderVar = (function() {
   var i = 0;
   return function() {
      i++;
      return { pc_holder: this.PC_HOLDER+i };
   };
})();

comp.getAuxIdent = function (i) {
	return esprima.delegate.createIdentifier(this.getAuxIdentifierStr(i));  
};

comp.isSimpleCallExp = function(call_exp) { 
	var type = call_exp.type, 
	    fun_type = call_exp.callee.type;
	return (type === esprima.Syntax.CallExpression) && (fun_type === esprima.Syntax.Identifier); 
};

comp.compile = function(st){
	if(!st) return st; 
	switch(st.type)	{
		case 'Program': 
		   return this.processProgram(st); 
		case 'ExpressionStatement': 
		   return this.processExprStmt(st); 
		case 'CallExpression':
		   return this.processCallExp(st); 
		case 'NewExpression': 
		   return this.processConstructorCallExp(st);  
		case 'ObjectExpression': 
		   return this.processObjectExp(st); 
		case 'AssignmentExpression': 
		   return  this.processAssignmentExp(st); 
		case 'Literal': 
		   return this.processLiteralExp(st); 
		case 'Identifier': 
		   return this.processIdentifierExp(st);   
		case 'MemberExpression': 
		   return this.processPropLookUpExp(st); 
		case 'ThisExpression': 
		   return this.processThisExp(st);
		case 'BinaryExpression': 
		   return this.processBinOpExp(st); 
		case 'UnaryExpression': 
		   return this.processUnOpExp(st);
	   case 'BlockStatement':
	      return this.processBlockStmt(st);
	   case 'WhileStatement': 
	      return this.processWhileStmt(st); 
	   case 'IfStatement':
	      return this.processIfStmt(st);  
	   case 'ReturnStatement': 
	      return this.processReturnStmt(st);  
	   case 'FunctionExpression': 
	      return this.processFunctionLiteralExp(st); 
	   case 'VariableDeclaration': 
	      return null;  
	   case 'ArrayExpression': 
	      return this.processArrayExp(st);
		default:  
		   if (!st.type) {
		   	throw new Error('Syntax Error - Illegal Program')
		   } else {
		   	throw new Error('Construct ' + st.type + ' is not supported yet')
		   }   
	}
};


/*
 * Original code: s
 *   s = var x1, ..., xn; s' 
 *   C[s'] = s''               
 * Compiled code: 
 *   var x1, ..., xn; 
 *   var  
 *    
 *   _SetVarLev('x', _lat.lub(C_l[x], l), _lab);
 */
comp.processProgram = function (st) {
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
	
	original_vars_decl = this.getProgDeclarations(st); 
	
	return this.createCompiledProgram(compiled_stmts, new_vars, original_vars_decl); 
}; 


comp.createCompiledProgram = function (compiled_stmts, new_vars, original_vars_decl) {
   var compiled_prog_stmts = [];
   
	//Compute the declaration of the compiler's internal variables
	//var _lab, _aux, new_vars(s'); 
	str = 'var _lab, _aux_1, _aux_2, _aux_3';  
	new_vars_str = this.newVarsToString(new_vars); 
	if (new_vars_str != '') {
		str += ', ' + new_vars_str; 
	}
	str += ';'; 
	internal_vars_decl = window.util.parseStmt(str);
   compiled_prog_stmts.push(internal_vars_decl); 
	
	//Compute the declaration of the original variables
	//var vars(s);
	if (original_vars_decl) {
		 original_vars_decl = $.extend(true, {}, original_vars_decl);
		 compiled_prog_stmts.push(original_vars_decl);
	} 
	
	//_pc = _lat.bot;
	str = '_pc = _lat._bot; ';
	assignment_1 = window.util.parseStmt(str);
	compiled_prog_stmts.push(assignment_1);
	
	//_lab = _InitLab(vars(s), _pc); 
	decl_vars_array_expr = this.buildDeclVarsArrayExpr(original_vars_decl);
	args = [ 
	   decl_vars_array_expr, 
	   window.esprima.delegate.createIdentifier(this.level.PC_IDENT),
   ]; 
	init_lab_call = window.esprima.delegate.createCallExpression(
		window.esprima.delegate.createIdentifier(this.level.INIT_LAB_IDENT), 
		args
	);
	init_lab_assignment = window.esprima.delegate.createAssignmentExpression(
		'=',
		window.esprima.delegate.createIdentifier(this.level.LAB_IDENT),  
		init_lab_call); 
	init_lab_assignment = window.esprima.delegate.createExpressionStatement(init_lab_assignment); 
	compiled_prog_stmts.push(init_lab_assignment); 
	
	compiled_prog_stmts = compiled_prog_stmts.concat(compiled_stmts);
	
	return esprima.delegate.createProgram(compiled_prog_stmts);  
}; 




comp.processBlockStmt = function(st) {
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
   	compiled_stmts: [ esprima.delegate.createBlockStatement(compiled_stmts) ],
   	new_vars: new_vars 
   }; 
};

comp.processExprStmt = function(expr_stmt) {
	var compiled_st; 
   if (expr_stmt.type !== esprima.Syntax.ExpressionStatement) {
      throw new Error('Trying to compile expression statement with non expression statement');
   }
   compiled_st = comp.compile(expr_stmt.expression);
   if (!compiled_st.hasOwnProperty('compiled_stmts')) {
   	compiled_st = {
   		compiled_stmts: [ esprima.delegate.createExpressionStatement(compiled_st) ], 
   		new_vars: [ ]
      }; 
   }
   return compiled_st;
}; 

comp.processCallExp = function (call_exp_st) {
	switch (call_exp_st.callee.type) { 
	   case 'Identifier':
	      switch (call_exp_st.callee.name) {
	      	case this.consts.UPGRADE_VAR_IDENT: 
	      	   return this.processUpgdVarExp(call_exp_st); 
	      	case this.consts.UPGRADE_PROP_IDENT: 
	      	   return this.processUpgdPropExp(call_exp_st); 
	      	case this.consts.UPGRADE_STRUCT_IDENT:
	      	   return this.processUpgdStructExp(call_exp_st); 
	      	case this.consts.UPGRADE_LEVEL_IDENT:
	      	   return this.processUpgdLevelExp(call_exp_st);
	      	case this.consts.UPGRADE_URL_IDENT:
	      	   return this.processUpgdUrlExp(call_exp_st)  
	         default: 
	            return this.processFunCallExp(call_exp_st);	
	      }
	   case 'MemberExpression': 
	      return this.processMethodCallExp(call_exp_st); 
	   default: throw new Error('Invalid Method Call'); 
	}
}; 


/*
 * Original code: upgVar(x, l)
 * Compiled code:
 *   _enforce(_pc, C_l[x]); 
 *   _SetVarLev('x', _lat.lub(C_l[x], l), _lab);
 */
comp.processUpgdVarExp = function (call_exp_st) {
	var compiled_stmt_1,
	    compiled_stmt_2,  
	    str, 
	    var_identifier, 
	    var_level_expr, 
	    var_level_expr_str, 
	    new_level_str; 
	    
	//_enforce(_pc, C_l[x]);
	var_identifier = call_exp_st.arguments[0].name; 
	var_level_expr = this.level.processIdentifier(var_identifier); 
	var_level_expr_str = window.util.printExprST(var_level_expr);
   str = '_Enforce(_pc, {0});';
   str = $.validator.format(str, var_level_expr_str);
   compiled_stmt_1 = window.util.parseStmt(str);
	
	//_SetVarLev('x', _lat.lub(C_l[x], l), _lab);
	new_level_str = call_exp_st.arguments[1].value; 
   str = '_SetVarLev(\'{0}\', _lat.lub({1}, \'{2}\'), _lab);';
	str = $.validator.format(str, var_identifier, var_level_expr_str, new_level_str);
   compiled_stmt_2 = window.util.parseStmt(str);
   
   return {
      compiled_stmts: [ compiled_stmt_1, compiled_stmt_2 ],
      new_vars: [ ]
   };
};


/*
 * Original code: upgProp(x, prop, l)
 * Compiled code: 
 *    _Enforce(_lat.lub(C_l[x], _pc), _GetPropLev(x, prop)); 
 *    _SetPropLev(x, prop, _lat.lub(l, _GetPropLev(x,prop)));
 */
comp.processUpgdPropExp = function (call_exp_st) {
	var compiled_stmt,
	    new_level_str,
	    obj_identifier, 
	    obj_identifier_level_expr, 
	    obj_identifier_level_expr_str, 
	    prop_expr_str,   
	    str; 
	
	//_Enforce(_lat.lub(C_l[x], _pc), _GetPropLev(x, prop));
	obj_identifier = call_exp_st.arguments[0].name;
	obj_identifier_level_expr = this.level.processIdentifier(obj_identifier); 
	obj_identifier_level_expr_str = window.util.printExprST(obj_identifier_level_expr);
	prop_expr_str = call_exp_st.arguments[1].value;
	str = '_Enforce(_lat.lub({2}, _pc), _GetPropLev({0}, \'{1}\'));';
	str = $.validator.format(str, obj_identifier, prop_expr_str, obj_identifier_level_expr_str);  
   compiled_stmt_1 = window.util.parseStmt(str);
   
	new_level_str = call_exp_st.arguments[2].value; 
   str = '_SetPropLev({0}, \'{1}\', _lat.lub({2}, \'{3}\', _GetPropLev({0},\'{1}\')));';
	str = $.validator.format(str, obj_identifier, prop_expr_str, obj_identifier_level_expr_str, new_level_str);
   compiled_stmt_2 = window.util.parseStmt(str);
	
   return {
      compiled_stmts: [ compiled_stmt_1, compiled_stmt_2 ],
      new_vars: [ ]
   };
};


/*
 * Original code: upgStruct(x, l)
 * Compiled code: 
 *    _Enforce(_lat.lub(C_l[x], _pc), _GetStructLev(x)); 
 *    _SetStructLev(x, _lat.lub(l, _GetStructLev(x)));
 */
comp.processUpgdStructExp = function (call_exp_st) {
	var compiled_stmt_1, 
	    compiled_stmt_2,
	    new_level_str, 
	    obj_identifier, 
	    obj_identifier_level_expr, 
	    obj_identifier_level_expr_str, 
	    str; 
	
   //_Enforce(_lat.lub(C_l[x], _pc), _GetStructLev(x));
   obj_identifier = call_exp_st.arguments[0].name;
   obj_identifier_level_expr = this.level.processIdentifier(obj_identifier); 
   obj_identifier_level_expr_str = window.util.printExprST(obj_identifier_level_expr);
   str = '_Enforce(_lat.lub({1}, _pc), _GetStructLev({0}));';
   str = $.validator.format(str, obj_identifier, obj_identifier_level_expr_str);  
   compiled_stmt_1 = window.util.parseStmt(str);
   
   //_SetStructLev(x, _lat.lub(l, _GetStructLev(x)));
   new_level_str = call_exp_st.arguments[1].value; 
   str = '_SetStructLev({0}, _lat.lub(\'{1}\', _GetStructLev({0})));';
   str = $.validator.format(str, obj_identifier, new_level_str);  
   compiled_stmt_2 = window.util.parseStmt(str);
   
   return {
      compiled_stmts: [ compiled_stmt_1, compiled_stmt_2 ],
      new_vars: [ ]
   };
};


/*
 * Original code: upgLevel(x, l)
 * Compiled code: 
 *    _Enforce(_lat.lub(C_l[x], _pc), _GetLevel(x)); 
 *    _SetLevel(x, _lat.lub(l, _GetLevel(x)));
 */
comp.processUpgdLevelExp = function(call_exp_st) {
   var compiled_stmt_1, 
	    compiled_stmt_2,
	    new_level_str, 
	    obj_identifier, 
	    obj_identifier_level_expr, 
	    obj_identifier_level_expr_str, 
	    str; 
	
	// _Enforce(_lat.lub(C_l[x], _pc), _GetLevel(x));
   obj_identifier = call_exp_st.arguments[0].name;
   obj_identifier_level_expr = this.level.processIdentifier(obj_identifier); 
   obj_identifier_level_expr_str = window.util.printExprST(obj_identifier_level_expr);
   str = '_Enforce(_lat.lub({1}, _pc), _GetLevel({0}));';
   str = $.validator.format(str, obj_identifier, obj_identifier_level_expr_str);  
   compiled_stmt_1 = window.util.parseStmt(str);
   
	// _SetLevel(x, _lat.lub(l, _GetLevel(x)));
   new_level_str = call_exp_st.arguments[1].value; 
   str = '_SetStructLev({0}, _lat.lub(\'{1}\', _GetLevel({0})));';
   str = $.validator.format(str, obj_identifier, new_level_str);  
   compiled_stmt_2 = window.util.parseStmt(str);
   
   return {
      compiled_stmts: [ compiled_stmt_1, compiled_stmt_2 ],
      new_vars: [ ]
   };
};


/*
 * Original code: upgUrl(x, level)
 * Compiled code: 
 *    _Enforce(_lat.lub(C_l[x], _pc), _GetUrlLev(x)); 
 *    _SetUrlLev(x, _lat.lub(l, _GetUrlLev(x)));
 */
comp.processUpgdUrlExp = function(call_exp_st) {
	var compiled_stmt_1, 
	    compiled_stmt_2,
	    new_level_str, 
	    str, 
	    url_expr, 
	    url_expr_str, 
	    url_level_expr, 
	    url_level_expr_str; 
	
	// _Enforce(_lat.lub(C_l[x], _pc), _GetUrlLev(x));
   url_expr = call_exp_st.arguments[0];
   url_expr_str = window.util.printExprST(url_expr);
   url_level_expr = this.level.process(url_expr); 
   url_level_expr_str = window.util.printExprST(url_level_expr);
   str = '_Enforce(_lat.lub({1}, _pc), _GetUrlLev({0}));';
   str = $.validator.format(str, url_expr_str, url_level_expr_str);  
   compiled_stmt_1 = window.util.parseStmt(str);
   
	// _SetUrlLev(x, _lat.lub(l, _GetUrlLev(x)));
   new_level_str = call_exp_st.arguments[1].value; 
   str = '_SetUrlLev({0}, _lat.lub(\'{1}\', _GetUrlLev({0})));';
   str = $.validator.format(str, url_expr_str, new_level_str);  
   compiled_stmt_2 = window.util.parseStmt(str);
   
   return {
      compiled_stmts: [ compiled_stmt_1, compiled_stmt_2 ],
      new_vars: [ ]
   };
};

/*
 * Function call
 * Original Code: x(ê) 
 * Compilied Code: s_1 = C[x(ê)], s_2 = C_u[x(ê)]
 * if(x.instrumented) {
 * 	s_1
 * } else {
 * 	s_2
 * }
 *  
 */
comp.processFunCallExp = function (funcall_expr) {
	var compiled_if,
	    compiled_instrumented_call_expr_stmts, 
	    compiled_uninstrumented_call_expr_stmts,
	    fun_indentifier_str,  
	    str; 
	
	fun_indentifier_str = funcall_expr.callee.name;
	val_lev_vars = this.getFreeValLevVars();
	
	str = 'if({0}._instrumented) {} else {}'; 
	str = $.validator.format(str, fun_indentifier_str); 
	compiled_if = window.util.parseStmt(str);
	
	
	compiled_uninstrumented_call_expr_stmts = this.processUnInstrumentedFunCallExp(funcall_expr, val_lev_vars);
	compiled_instrumented_call_expr_stmts = this.processInstrumentedFunCallExp(funcall_expr, val_lev_vars); 
	
	compiled_if.consequent.body = compiled_instrumented_call_expr_stmts; 
	compiled_if.alternate.body = compiled_uninstrumented_call_expr_stmts;
	
	return {
      compiled_stmts: [
         compiled_if
      ],
      new_vars: [ val_lev_vars ]
   };
}


/*
 * Instrumented function call
 * Original Code: x(ê) 
 * Compilied Code:
 * _aux_1 = x(ê, C_l[ê], _lat.lub(C_l[x], _pc));
 * _val_i = aux_1._val; 
 * _lev_i = aux_1._lev; 
 */
comp.processInstrumentedFunCallExp = function (call_expr, val_lev_vars) { 
   var args_exprs, 
       args_levels_array_expr,
       assignment_1,  
       assignment_2, 
       assignment_3, 
       context_level, 
       identifier_level_expr, 
       identifier_level_expr_str, 
       str;  
   
     
   //_lat.lub(C_l[x], _pc);
   identifier_level_expr = this.level.processIdentifier(call_expr.callee.name);
   identifier_level_expr_str = window.util.printExprST(identifier_level_expr);
   str = '_lat.lub({0}, _pc)';  
   str = $.validator.format(str, identifier_level_expr_str);
   context_level_expr = window.util.parseExpr(str);
   
   //_aux_1 = x(ê, C_l[ê], _lat.lub(C_l[x], _pc)); 
   args_exprs = call_expr.arguments;
   args_levels_array_expr = this.level.computeArgumentLevels(args_exprs);
   args_exprs.push(args_levels_array_expr); 
   args_exprs.push(context_level_expr);
   compiled_call_expr = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createIdentifier(call_expr.callee.name),
      args_exprs);
   assignment_1 = window.esprima.delegate.createAssignmentExpression(
      '=', 
      window.esprima.delegate.createIdentifier(this.getAuxIdentifierStr(1)),
      compiled_call_expr); 
     
   assignment_1 = window.esprima.delegate.createExpressionStatement(assignment_1); 
   
   //_val_i = aux_1._val;
   //_lev_i = aux_1._lev;
   
   str = '{0} = _aux_1._val;'; 
   str = $.validator.format(str, val_lev_vars.val_var);
   assignment_2 = window.util.parseStmt(str);
   str = '{0} = _aux_1._lev;';
   str = $.validator.format(str, val_lev_vars.lev_var);
   assignment_3 = window.util.parseStmt(str);
   
	return [assignment_1, assignment_2, assignment_3];  
}; 


/*
 * Unisntrumented function call
 * Original code: f(ê_1, ..., ê_n)
 * Instrumented Code: 
 * 
 *  _aux_1 = _lat.lub(_GetVarLev('f', _lab), _pc) 
 * 
 *  _enforceInstr = _GetEnforceFun(f);
 *  _computeRetLevel = _GetComputeRetLevelFun(f);
 *  _computeRetVal = _GetComputeRetVal(f);
 *  _updtArgsLevels = _GetUpdtArgsLevelsFun(f);
 *  _processArg = _GetProcessArg(f);
 *  
 *  _enforceInstr(ê_1, ..., ê_n, args_levels, _aux_1);
 *  _aux_2 = f(_processArg(ê_1, 1), ...,_processArg(ê_n, n));  
 *  _val_i = _computeRetVal(ê_1, ..., ê_n, args_levels, _aux_1, _aux_2); 
 *  _lev_i = _computeRetLevel(ê_1, ..., ê_n, args_levels, _aux_1, _aux_2);
 *  _updtArgsLevels(ê_1, ..., ê_n, args_levels, _aux_1, _aux_2); 
 */
comp.processUnInstrumentedFunCallExp = function (funcall_expr, val_lev_vars) {
	var args_levels_array_expr, 
	    assignment_expr_aux, 
	    call_expr_aux, 
	    compiled_args,
	    compiled_args_aux, 
	    compiled_stmt_1, 
	    compiled_stmt_2,
	    compiled_stmt_3,
	    compiled_stmt_4,
	    compiled_stmt_5,
	    compiled_stmt_6,
	    compiled_stmt_7,
	    compiled_stmt_8,  
	    compiled_stmt_9, 
	    compiled_stmt_10,
	    compiled_stmt_11,  
	    compiled_stmt_12, 
	    fun_indentifier_str,
	    i, 
	    len,  
	    processed_args, 
	    str;
	
	fun_indentifier_str = funcall_expr.callee.name; 
   
   // ctxt_level => _aux_1 = _lat.lub(_GetVarLev('f', _lab), _pc)
	str = '_aux_1 = _lat.lub(_GetVarLev(\'{0}\', _lab), _pc);'; 
	str = $.validator.format(str, fun_indentifier_str);
	compiled_stmt_1 = window.util.parseStmt(str);
	
	// (x1, ..., xn, args_levels, _aux_1)
	compiled_args = $.extend(true, [], funcall_expr.arguments); 
	args_levels_array_expr = this.level.computeArgumentLevels(compiled_args);
	compiled_args.push(args_levels_array_expr); 
	compiled_args.push(window.esprima.delegate.createIdentifier(this.getAuxIdentifierStr(1)));
	
	//_enforceInstr = _GetEnforceFun(f);
	str = '_enforceInstr = _GetEnforceFun({0});'; 
	str = $.validator.format(str, fun_indentifier_str);
	compiled_stmt_2 = window.util.parseStmt(str);
	
	//_computeReturnLevel = _getComputRetLevelFun(f);
	str = '_computeReturnLevel = _GetComputeRetLevelFun({0});';
	str = $.validator.format(str, fun_indentifier_str);
	compiled_stmt_3 = window.util.parseStmt(str);
	
	//_computeReturnValue = _GetComputeRetVal(f);
	str = '_computeReturnValue = _GetComputeRetValFun({0});'; 
	str = $.validator.format(str, fun_indentifier_str);
	compiled_stmt_4 = window.util.parseStmt(str);
	
	//_updtArgsLevels = _GetUpdtArgsLevelsFun(f);
	str = '_updateArgsLevels = _GetUpdtArgsLevelsFun({0});';
	str = $.validator.format(str, fun_indentifier_str);
	compiled_stmt_5 = window.util.parseStmt(str);

	//_processArg = _GetProcessArg(f);
	str = '_processArg = _GetProcessArg({0});';
	str = $.validator.format(str, fun_indentifier_str);
	compiled_stmt_6 = window.util.parseStmt(str);

   //_enforceInstr(x1, ..., xn, args_levels, _aux_1);
   call_expr_aux = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createIdentifier(this.consts.ENFORCE_INSTR_IDENT),
      $.extend(true, [], compiled_args));
   compiled_stmt_7 = window.esprima.delegate.createExpressionStatement(call_expr_aux);  
   
   // evaluator = function($) { return eval($); }
   str = 'evaluator = function($) { return eval($); };';
   compiled_stmt_8 = window.util.parseStmt(str);
   
   // (_processArg(ê_1, 1, evaluator), ...,_processArg(ê_n, n, evaluator))
   compiled_args_aux = []; 
   for(i = 0, len = funcall_expr.arguments.length; i < len; i++) {
   	call_expr_aux = window.esprima.delegate.createCallExpression(
         window.esprima.delegate.createIdentifier('_processArg'),
         [
            $.extend(true, {}, funcall_expr.arguments[i]), 
            window.esprima.delegate.createLiteral2(i+1),
            window.esprima.delegate.createIdentifier('evaluator')
         ]);
      compiled_args_aux[i] = call_expr_aux;  
   }
   
   // _aux_2 = f(_processArg(ê_1, 1), ...,_processArg(ê_n, n));
   call_expr_aux = window.esprima.delegate.createCallExpression(
   	window.esprima.delegate.createIdentifier(fun_indentifier_str),
      compiled_args_aux);
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
   	'=', 
   	window.esprima.delegate.createIdentifier(this.getAuxIdentifierStr(2)), 
   	call_expr_aux
   );
   compiled_stmt_9 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
   
   // (x1, ..., xn, args_levels, _aux_1, _aux_2)
   compiled_args.push(window.esprima.delegate.createIdentifier(this.getAuxIdentifierStr(2)));
   
   //_val_i = _computeRetVal(x1, ..., xn, args_levels, _aux_1, _aux_2); 
   call_expr_aux = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createIdentifier(this.consts.COMPUTE_RET_VALUE_IDENT), 
      $.extend(true, [], compiled_args)
   );
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
   	'=', 
   	window.esprima.delegate.createIdentifier(val_lev_vars.val_var), 
   	$.extend(true, [], call_expr_aux)
   );
   compiled_stmt_10 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
   
   //_lev_i = _computeRetLevel(x1, ..., xn, args_levels, _aux_1, _aux_2);
   call_expr_aux = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createIdentifier(this.consts.COMPUTE_RET_LEVEL_IDENT),
      $.extend(true, [], compiled_args));
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
   	'=', 
   	window.esprima.delegate.createIdentifier(val_lev_vars.lev_var), 
   	call_expr_aux
   );   
   compiled_stmt_11 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
   
   //_updtArgsLevels(x1, ..., xn, args_levels, _aux_1, _aux_2); 
   call_expr_aux = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createIdentifier(this.consts.UPDATE_ARGS_LEVELS_IDENT),
      $.extend(true, [], compiled_args));
	compiled_stmt_12 = window.esprima.delegate.createExpressionStatement(call_expr_aux);
	
	return  [
      compiled_stmt_1,
      compiled_stmt_2, 
      compiled_stmt_3, 
      compiled_stmt_4, 
      compiled_stmt_5, 
      compiled_stmt_6,
      compiled_stmt_7, 
      compiled_stmt_8, 
      compiled_stmt_9, 
      compiled_stmt_10, 
      compiled_stmt_11, 
      compiled_stmt_12 
   ];
};


/*
 * Method call
 * Original Code: x[ê_1](ê_2, ..., ê_n) 
 * Compilied Code: s_1 = C[x[ê_1](ê_2, ..., ê_n) ], s_2 = C_u[x[ê_1](ê_2, ..., ê_n) ]
 * _isValidPropertyAccess(x, ê_1);
 * if(x[ê_1]._instrumented) {
 * 	s_1
 * } else {
 * 	s_2
 * }
 *  
 */
comp.processMethodCallExp = function (method_call_expr, val_lev_vars) {
	var compiled_if,
	    compiled_instrumented_method_call_expr_stmts, 
	    compiled_uninstrumented_method_call_expr_stmts,
	    member_expr, 
	    member_expr_str,
	    obj_identifier_str,  
	    str, 
	    type_validation_statement; 
	
	member_expr = $.extend(true, {}, method_call_expr.callee.property);
	member_expr_str = window.util.printExprST(member_expr);
	obj_identifier_str = method_call_expr.callee.object.name; 
	
	if (!val_lev_vars) {
	   val_lev_vars = this.getFreeValLevVars();
	}
	
	// _isValidPropertyAccess(x, ê_1);
	str = '_isValidPropertyAccess({0}, {1});'; 
	str = $.validator.format(str, obj_identifier_str, member_expr_str);
	type_validation_statement = window.util.parseStmt(str);
	
	str = 'if({0}._instrumented) {} else {}'; 
	str = $.validator.format(str, member_expr_str); 
	compiled_if = window.util.parseStmt(str);

	compiled_uninstrumented_method_call_expr_stmts = this.processUnInstrumentedMethodCallExp(method_call_expr, val_lev_vars);
	compiled_instrumented_method_call_expr_stmts = this.processInstrumentedMethodCallExp(method_call_expr, val_lev_vars);
	
	compiled_if.consequent.body = compiled_instrumented_method_call_expr_stmts; 
	compiled_if.alternate.body = compiled_uninstrumented_method_call_expr_stmts;
	
	return {
      compiled_stmts: [
         type_validation_statement, 
         compiled_if
      ],
      new_vars: [ val_lev_vars ]
   };
}


/*
 * Original Code: x[ê_1](ê_2) 
 * Compilied Code:
 * _aux_1 = _lat.lub(C_l[x], C_l[ê_1], _GetPropLev(x, ê_1), _pc);
 * _aux_1 = x[ê_1](ê_2, C_l[ê_2], _aux_1);
 * _val_i = aux_1._val; 
 * _lev_i = aux_1._lev;  
 */
comp.processInstrumentedMethodCallExp = function (method_call_expr, val_lev_vars) {
   var arg_level_exp, 
       args_exprs, 
       args_levels_exprs, 
       assignment_1, 
       assignment_2, 
       compiled_args_exprs, 
       compiled_method_call, 
       compiled_member_expr, 
       obj_level_expr, 
       obj_level_expr_str, 
       obj_ident, 
       prop_expr, 
       prop_expr_str, 
       prop_level_expr, 
       prop_level_expr_str, 
       str, 
       val_lev_vars;

   // _lat.lub(C_l[x], C_l[e_1], _GetPropLev(x, ê_1), _pc);
   obj_ident = method_call_expr.callee.object.name;
   prop_expr = $.extend(true, {}, method_call_expr.callee.property);
   prop_expr_str = window.util.printExprST(prop_expr);
   obj_level_expr = this.level.processIdentifier(obj_ident);
   obj_level_expr_str = window.util.printExprST(obj_level_expr);
   prop_level_expr = this.level.process(prop_expr);
   prop_level_expr_str = window.util.printExprST(prop_level_expr);
   str = '_aux_1 = _lat.lub({2}, {3}, _GetPropLev({0}, {1}), _pc);';
   str = $.validator.format(str, obj_ident, prop_expr_str, obj_level_expr_str, prop_level_expr_str);
   assignment_1 = window.util.parseStmt(str);

   //aux = x[ê_1](ê_2, C_l[ê_2], _aux_1);
   // {3}: array with the level of each argument
   args_exprs = method_call_expr.arguments;
   args_levels_exprs = this.level.computeArgumentLevels(args_exprs);
   compiled_args_exprs = args_exprs;
   compiled_args_exprs.push(args_levels_exprs);
   compiled_args_exprs.push(this.getAuxIdent());
   compiled_member_expr = $.extend(true, {}, method_call_expr.callee);
   compiled_method_call = window.esprima.delegate.createCallExpression(compiled_member_expr, compiled_args_exprs);
   str = '_aux_1 = {0}; '
   str = $.validator.format(str, window.util.printExprST(compiled_method_call));
   assignment_2 = window.util.parseStmt(str);

   //_val_i = _aux_1._val;
   //_lev_i = _aux_1._lev;
   str = '{0} = _aux_1._val;'; 
   str = $.validator.format(str, val_lev_vars.val_var);
   assignment_3 = window.util.parseStmt(str);
   str = '{0} = _aux_1._lev;';
   str = $.validator.format(str, val_lev_vars.lev_var);
   assignment_4 = window.util.parseStmt(str);
   
   return [
      assignment_1, 
      assignment_2, 
      assignment_3, 
      assignment_4
   ];
};


/*
 * Uninstrumented method call
 * Original Code: x[ê_1](ê_2, ..., ê_n) 
 * Compilied Code:
 *  _aux = _lat.lub(C_l[x], C_l[ê_1], _GetPropLev(x, ê_1), _pc);
 *  _enforceInstr = _GetEnforceMethod(x, ê_1);
 *  _computeRetLevel = _GetComputeRetLevelMethod(x, ê_1);
 *  _updtArgsLevels = _GetUpdtArgsLevelsMethod(x, ê_1);
 *  _processRetValue = _GetProcessRetValue(x, ê_1);
 *  _enforceInstr(ê_1, ê_2, ..., ê_n, args_levels, ctxt_level); 
 *  _val_i = x[ê_1](ê_2, ..., ê_n); 
 *  _val_i = _processRetValue(ê_1, ê_2, ..., ê_n, args_levels, ctxt_level, _val_i);
 *  _lev_i = _computeRetLevel(ê_1, ê_2, ..., ê_n, args_levels, ctxt_level);
 *  _updtArgsLevels(ê_1, ê_2, ..., ê_n, args_levels, ctxt_level); 
 */
comp.processUnInstrumentedMethodCallExp = function (method_call_expr, val_lev_vars) {
	var aux_identifier, 
	    args_exprs, 
	    args_levels_array_expr, 
	    assignment_expr_aux, 
	    call_expr_aux, 
	    compiled_stmt_1,
	    compiled_stmt_2,
	    compiled_stmt_3,
	    compiled_stmt_4,
	    compiled_stmt_5,
	    compiled_stmt_6,
	    compiled_stmt_7,
	    compiled_stmt_8,
	    compiled_stmt_9, 
	    compiled_stmt_10, 
	    obj_identifier_str, 
	    obj_level_expr, 
	    obj_level_expr_str, 
	    prop_expr, 
	    prop_expr_level, 
	    prop_expr_level_str, 
	    prop_expr_str, 
	    str, 
	    val_lev_vars; 
	
	// aux_identifier
	aux_identifier = window.esprima.delegate.createIdentifier(this.getAuxIdentifierStr(1)); 
	
   // _aux = _lat.lub(C_l[x], C_l[e_1], _GetPropLev(x, ê_1), _pc);
   obj_identifier_str = method_call_expr.callee.object.name; 
   obj_level_expr = this.level.processIdentifier(obj_identifier_str);
   obj_level_expr_str = window.util.printExprST(obj_level_expr);
   prop_expr = $.extend(true, {}, method_call_expr.callee.property);
   prop_expr_str = window.util.printExprST(prop_expr);
   prop_expr_level = this.level.process(prop_expr);
   prop_expr_level_str = window.util.printExprST(prop_expr_level);
	str = '_aux_1 = _lat.lub({2}, {3}, _GetPropLev({0}, {1}), _pc);' 
   str = $.validator.format(str, obj_identifier_str, prop_expr_str, obj_level_expr_str, prop_expr_level_str);
   compiled_stmt_1 = window.util.parseStmt(str);
	
   //_enforceInstr = _GetEnforceMethod(x, ê_1);
   str = '_enforceInstr = _GetEnforceMethod({0}, {1});'; 
   str = $.validator.format(str, obj_identifier_str, prop_expr_str);
   compiled_stmt_2 = window.util.parseStmt(str); 
	
	//_computeRetLevel = _GetComputeRetLevelMethod(x, ê_1);
	str = '_computeReturnLevel = _GetComputeRetLevelMethod({0}, {1});'; 
   str = $.validator.format(str, obj_identifier_str, prop_expr_str);
   compiled_stmt_3 = window.util.parseStmt(str);  
   
   //_updtArgsLevels = _GetUpdtArgsLevelsMethod(x, ê_1);
   str = '_updateArgsLevels = _GetUpdtArgsLevelsMethod({0}, {1});'; 
   str = $.validator.format(str, obj_identifier_str, prop_expr_str);
   compiled_stmt_4 = window.util.parseStmt(str);
   
   //_processRetValue = _GetProcessRetValue(x, ê_1);
   str = '_processRetValue = _GetProcessRetValue({0}, {1});';
   str = $.validator.format(str, obj_identifier_str, prop_expr_str);
   compiled_stmt_5 = window.util.parseStmt(str);
   
   //(x, ê_2, ..., ê_n, args_levels, ctxt_level)
   args_exprs = [ window.esprima.delegate.createIdentifier(obj_identifier_str) ]; 
   args_exprs = args_exprs.concat($.extend(true, [], method_call_expr.arguments));
   args_levels_array_expr = this.level.computeArgumentLevels(args_exprs);
   args_exprs.push(args_levels_array_expr); 
   args_exprs.push(aux_identifier); 
	
	//_enforceInstr(x, ê_2, ..., ê_n, args_levels, ctxt_level);
   call_expr_aux = window.esprima.delegate.createCallExpression(
	   window.esprima.delegate.createIdentifier(this.consts.ENFORCE_INSTR_IDENT), 
	   $.extend(true, [], args_exprs)	
	); 
	compiled_stmt_6 = window.esprima.delegate.createExpressionStatement(call_expr_aux);  
	
	//_val_i = x[ê_1](ê_2, ..., ê_n); 
	call_expr_aux = $.extend(true, {}, method_call_expr);
	assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
		'=', 
		window.esprima.delegate.createIdentifier(val_lev_vars.val_var), 
		call_expr_aux
	);
	compiled_stmt_7 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);  
	
	//_val_i = _processRetValue(ê_1, ê_2, ..., ê_n, args_levels, ctxt_level, _val_i);
	args_exprs.push(window.esprima.delegate.createIdentifier(val_lev_vars.val_var));
	call_expr_aux = window.esprima.delegate.createCallExpression(
		window.esprima.delegate.createIdentifier(this.consts.PROCESS_RET_VALUE), 
		 $.extend(true, [], args_exprs)
	);
	args_exprs.pop(); 
	assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
		'=', 
		window.esprima.delegate.createIdentifier(val_lev_vars.val_var), 
		call_expr_aux
	);
	compiled_stmt_8 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);   
	
	//_lev_i = _computeRetLevel(x, ê_2, ..., ê_n, args_levels, ctxt_level);
	call_expr_aux = window.esprima.delegate.createCallExpression(
		window.esprima.delegate.createIdentifier(this.consts.COMPUTE_RET_LEVEL_IDENT), 
		 $.extend(true, [], args_exprs)
	); 
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
	   '=', 
		window.esprima.delegate.createIdentifier(val_lev_vars.lev_var), 
		call_expr_aux
	);
	compiled_stmt_9 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);  
	
	//_updtArgsLevels(x, ê_2, ..., ê_n, args_levels, ctxt_level); 
	call_expr_aux = window.esprima.delegate.createCallExpression(
	   window.esprima.delegate.createIdentifier(this.consts.UPDATE_ARGS_LEVELS_IDENT), 
	   $.extend(true, [], args_exprs)	
	); 
	compiled_stmt_10 = window.esprima.delegate.createExpressionStatement(call_expr_aux);  
	
	return [
      compiled_stmt_1, 
      compiled_stmt_2, 
      compiled_stmt_3, 
      compiled_stmt_4, 
      compiled_stmt_5, 
      compiled_stmt_6, 
      compiled_stmt_7, 
      compiled_stmt_8, 
      compiled_stmt_9, 
      compiled_stmt_10
   ];
};



comp.processConstructorCallExp = function(constructor_call_expr) {
   var compiled_if, 
       compiled_instrumented_constructor_call_expr_stmts, 
       compiled_uninstrumented_constructor_call_expr_stmts, 
       constructor_expr, 
       constructor_expr_str, 
       str;

   constructor_expr = $.extend(true, {}, constructor_call_expr.callee);
   constructor_expr_str = window.util.printExprST(constructor_expr);
   val_lev_vars = this.getFreeValLevVars();

   str = 'if({0}._instrumented) {} else {}';
   str = $.validator.format(str, constructor_expr_str);
   compiled_if = window.util.parseStmt(str);

   compiled_uninstrumented_constructor_call_expr_stmts = this.processUnInstrumentedConstructorCallExp(constructor_call_expr, val_lev_vars);
   compiled_instrumented_constructor_call_expr_stmts = this.processInstrumentedConstructorCallExp(constructor_call_expr, val_lev_vars);

   compiled_if.consequent.body = compiled_instrumented_constructor_call_expr_stmts;
   compiled_if.alternate.body = compiled_uninstrumented_constructor_call_expr_stmts;

   return {
      compiled_stmts : [compiled_if],
      new_vars : [val_lev_vars]
   };
}


/*
 * Original Code: new x(ê) 
 * Compilied Code:
 * _lev_i = _lat.lub(C_l[x], x._pc); 
 * _val_i = _InitObject(Object.create(x.prototype), _lat.lub(C_l[x], _pc));
 * _aux_1 = x.call(_val_i,ê, C_l[ê], C_l[x]); 
 * if(aux_1) { 
 * 	_lev_i = _aux_1._val; 
 *    _val_i = _aux_1._lev; 
 * } 
 */
comp.processInstrumentedConstructorCallExp = function (constructor_call_expr, val_lev_vars) {
   var args_exprs, 
       args_levels_exprs,
       assignment_1,
       assignment_2,  
       assignment_3,
       compiled_args_exprs, 
       if_stmt_st, 
       obj_ident, 
       obj_level_expr,
       obj_level_expr_str, 
       str, 
       val_lev_vars; 
        
   //_lev_i = _lat.lub(C_l[x], x._pc);
   obj_ident = constructor_call_expr.callee.name; 
   obj_level_expr = this.level.processIdentifier(obj_ident);
   obj_level_expr_str = window.util.printExprST(obj_level_expr);
   str = '{0} = _lat.lub({1}, {2}._pc);'; 
   str = $.validator.format(str, val_lev_vars.lev_var, obj_level_expr_str, obj_ident);
   assignment_1 = window.util.parseStmt(str);
   
   //_val_i = _InitObject(Object.create(x.prototype), C_l[x], x.prototype);
   str = '{0} = _InitObject(Object.create({1}.prototype), _lat.lub({2}, _pc), {1}.prototype);'; 
   str = $.validator.format(str, val_lev_vars.val_var, obj_ident, obj_level_expr_str);
   assignment_2 = window.util.parseStmt(str);
   
   //_aux_1 = x.call(_val_i,ê, C_l[ê], C_l[x]); 
   str = '_aux_1 = {0}.call();'; 
   str = $.validator.format(str, obj_ident); 
   assignment_3 = window.util.parseStmt(str); 
   args_exprs = constructor_call_expr.arguments;
   args_levels_exprs = this.level.computeArgumentLevels(args_exprs);
   compiled_args_exprs = [ esprima.delegate.createIdentifier(val_lev_vars.val_var) ];
   compiled_args_exprs = compiled_args_exprs.concat(args_exprs); 
   compiled_args_exprs.push(args_levels_exprs);
   compiled_args_exprs.push(obj_level_expr);
   assignment_3.expression.right.arguments = compiled_args_exprs; 
   
   // if (_aux_1) { _lev_i = _aux._val;  _val_i = _aux._lev; }
   str = 'if (_aux_1) { {0} = _aux_1._val; {1} =  _aux_1._lev; }'; 
   str = $.validator.format(str, val_lev_vars.lev_var, val_lev_vars.val_var);   
   if_stmt_st = window.util.parseStmt(str);
   
   return [
      assignment_1, 
      assignment_2, 
      assignment_3, 
      if_stmt_st
   ];

}


/*
 * Uninstrumented method call
 * Original Code: new F(ê_1, ..., ê_n) 
 * Compilied Code:
 *  _aux_1 = _lat.lub(C_l[x], _pc);
 *  _enforceInstr = _GetEnforceConstructor(F);
 *  _computeRetLevel = _GetNewObjLevel(F);
 *  _updtArgsLevels = _GetUpdtArgsLevelsConstructor(F);
 *  _enforceInstr(ê_1, ..., ê_n, args_levels, _aux_1); 
 *  _val_i = new F(ê_1, ..., ê_n);
 *  _lev_i = _computeRetLevel(ê_1, ..., ê_n, args_levels, _aux_1, _val_i);
 *  _updtArgsLevels(ê_1, ..., ê_n, args_levels, _aux_1); 
*/
comp.processUnInstrumentedConstructorCallExp = function (constructor_call_expr, val_lev_vars) {
	var args_exprs,
	    assignment_expr_aux,  
	    aux_identifier, 
	    call_expr_aux, 
	    compiled_stmt_1, 
	    compiled_stmt_2,
	    compiled_stmt_3,
	    compiled_stmt_4,
	    compiled_stmt_5,
	    compiled_stmt_6, 
	    compiled_stmt_7,
	    compiled_stmt_8,
	    obj_identifier_str, 
	    str, 
	    val_lev_vars;
	
	// aux_identifier
	aux_identifier = window.esprima.delegate.createIdentifier(this.getAuxIdentifierStr(1)); 
	
	//_aux_1 = _lat.lub(C_l[x], _pc);
	obj_identifier_str = constructor_call_expr.callee.name; 
	str = '_aux_1 = _lat.lub(_GetVarLev(\'{0}\', _lab), _pc);';
	str = $.validator.format(str, obj_identifier_str); 
	compiled_stmt_1 = window.util.parseStmt(str);
	
	//_enforceInstr = _GetEnforceFun(F);
	str = '_enforceInstr = _GetEnforceConstructor({0});'; 
	str = $.validator.format(str, obj_identifier_str);
	compiled_stmt_2 = window.util.parseStmt(str);
	
	//_computeRetLevel = _GetComputeRetLevelFun(F);
	str = '_computeRetLevel = _GetNewObjLevel({0});'; 
	str = $.validator.format(str, obj_identifier_str);
	compiled_stmt_3 = window.util.parseStmt(str);
	
	//_updtArgsLevels = _GetUpdtArgsLevelsFun(F);
	str = '_updtArgsLevels = _GetUpdtArgsLevelsConstructor({0});';
	str = $.validator.format(str, obj_identifier_str);
	compiled_stmt_4 = window.util.parseStmt(str);
	
	//(ê_1, ê_2, ..., ê_n, args_levels, _aux_1)
	args_exprs = $.extend(true, [], constructor_call_expr.arguments);
   args_levels_array_expr = this.level.computeArgumentLevels(args_exprs);
   args_exprs.push(args_levels_array_expr); 
   args_exprs.push(aux_identifier); 
   
   //_enforceInstr(ê_1, ..., ê_n, args_levels, _aux_1);
	call_expr_aux = window.esprima.delegate.createCallExpression(
	   window.esprima.delegate.createIdentifier('_enforceInstr'), 
	   $.extend(true, [], args_exprs)	
	); 
	compiled_stmt_5 = window.esprima.delegate.createExpressionStatement(call_expr_aux);
	
	//_val_i = x[ê_1](ê_2, ..., ê_n); 
	call_expr_aux = $.extend(true, {}, constructor_call_expr);
	assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
		'=', 
		window.esprima.delegate.createIdentifier(val_lev_vars.val_var), 
		call_expr_aux
	);
	compiled_stmt_6 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);  
	
	args_exprs.push(window.esprima.delegate.createIdentifier(val_lev_vars.val_var)); 
	
	//_lev_i = _computeRetLevel(ê_1, ..., ê_n, args_levels, _aux_1, _val_i);
	call_expr_aux = window.esprima.delegate.createCallExpression(
		window.esprima.delegate.createIdentifier('_computeRetLevel'), 
		 $.extend(true, [], args_exprs)
	); 
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
	   '=', 
		window.esprima.delegate.createIdentifier(val_lev_vars.lev_var), 
		call_expr_aux
	);
	compiled_stmt_7 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux); 
	
	//_updtArgsLevels(ê_1, ..., ê_n, args_levels, _aux_1); 
	call_expr_aux = window.esprima.delegate.createCallExpression(
	   window.esprima.delegate.createIdentifier('_updtArgsLevels'), 
	   $.extend(true, [], args_exprs)	
	); 
	compiled_stmt_8 = window.esprima.delegate.createExpressionStatement(call_expr_aux);  
	
	return [
      compiled_stmt_1, 
      compiled_stmt_2, 
      compiled_stmt_3, 
      compiled_stmt_4, 
      compiled_stmt_5,  
      compiled_stmt_6, 
      compiled_stmt_7, 
      compiled_stmt_8
   ];
		
}


/*
 * Original Code: {} 
 * Compilied Code:
 * _vali = _InitObject({}, _pc); 
 * _levi = _pc; 
 */
comp.processObjectExp = function (obj_expr) {
   var assignment_1, 
       assignment_2, 
       str, 
       val_lev_vars; 
        
   val_lev_vars = this.getFreeValLevVars();
   
   str = '{0} = _InitObject({}, _pc);';
   str = $.validator.format(str, val_lev_vars.val_var);  
   assignment_1 = window.util.parseStmt(str);
   
   str = '{0} = _pc;';
   str = $.validator.format(str, val_lev_vars.lev_var);  
   assignment_2 = window.util.parseStmt(str);
   
   return {
      compiled_stmts: [
         assignment_1, 
         assignment_2
      ], 
      new_vars: [ val_lev_vars ]
   };
}; 


/*
 * Original Code: {} 
 * Compilied Code:
 * _vali = _InitObject({}, _pc); 
 * _levi = _pc; 
 */
comp.processArrayExp = function (obj_expr) {
   var assignment_1, 
       assignment_2, 
       str, 
       val_lev_vars; 
       
   val_lev_vars = this.getFreeValLevVars();
   
   str = '{0} = _InitObject([], _pc);';
   str = $.validator.format(str, val_lev_vars.val_var);  
   assignment_1 = window.util.parseStmt(str);
   
   str = '{0} = _pc;';
   str = $.validator.format(str, val_lev_vars.lev_var);  
   assignment_2 = window.util.parseStmt(str);
   
   return {
      compiled_stmts: [
         assignment_1, 
         assignment_2
      ], 
      new_vars: [ val_lev_vars ]
   };
}; 


comp.processAssignmentExp = function (assign_expr) {
   if (assign_expr.left.type == 'MemberExpression') {
      return this.processPropertyUpdateExp(assign_expr);  
   } else {
   	return this.processVarAssignmentExp(assign_expr); 
   }
}; 

/*
 * Original Code: x[ê_1] = ê_2 
 * Compilied Code:
 * _isValidPropertyAccess(x, ê_1); 
 * if(x.hasOwnProperty(_val_i)) {
 *    _Enforce(_lat.lub(C_l[x], _lev_i, _pc), _GetPropLev(x, _val_i));	
 * } else {
 * 	_Enforce(_lat.lub(C_l[x], _lev_i, _pc), _GetStructLev(x));   
 * }
 * _SetPropLev(x, _val_i, _lat.lub(C_l[x], _lev_i, C_l[ê_2])); 
 * _InitObject(Object.create(x.prototype), C_l[x]);
 * x[_val_i] = ê_2; 
 */
comp.processPropertyUpdateExp = function (prop_updt_expr) {
	var call_stmt, 
	    compiled_prop_updt, 
	    enforce_stmt_1_str,
	    enforce_stmt_2_str, 
	    if_stmt, 
	    new_val_expr, 
	    new_val_expr_str, 
	    new_val_level_expr, 
	    new_val_level_expr_str, 
	    obj_ident, 
	    obj_level_expr, 
	    obj_level_expr_str, 
	    prop_expr, 
	    prop_expr_str, 
	    prop_level_expr, 
	    prop_level_expr_str, 
	    str, 
	    type_validation_stmt; 

   // _isValidPropertyAccess(x, ê_1);
   obj_ident = prop_updt_expr.left.object.name;
   prop_expr = $.extend(true, {}, prop_updt_expr.left.property);
	prop_expr_str = window.util.printExprST(prop_expr);
	str = '_isValidPropertyAccess({0}, {1});'; 
	str = $.validator.format(str, obj_ident, prop_expr_str); 
	type_validation_stmt = window.util.parseStmt(str);
	
	//_Enforce(_lat.lub(C_l[x], C_l[ê_1]), _GetPropLev(x, ê_1))
	obj_level_expr = this.level.processIdentifier(obj_ident);
	obj_level_expr_str = window.util.printExprST(obj_level_expr);
	prop_level_expr = this.level.process(prop_expr); 
	prop_level_expr_str = window.util.printExprST(prop_level_expr);
	str = '_Enforce(_lat.lub({0}, {1}, _pc), _GetPropLev({2}, {3}));';
	enforce_stmt_1_str = $.validator.format(str, obj_level_expr_str, prop_level_expr_str, obj_ident, prop_expr_str);   
	
	//_Enforce(_lat.lub(C_l[x], C_l[ê_1]), _GetStructLev(x))
	str = '_Enforce(_lat.lub({0}, {1}, _pc), _GetStructLev({2}));';
	enforce_stmt_2_str = $.validator.format(str, obj_level_expr_str, prop_level_expr_str, obj_ident);   
	
	// if(x.hasOwnProperty(ê_1)) { enforce_1 } else { enforce_2 }
	str = 'if({0}.hasOwnProperty({1})) { {2} } else { {3} }'; 
	str = $.validator.format(str, obj_ident, prop_expr_str, enforce_stmt_1_str, enforce_stmt_2_str);
	if_stmt = window.util.parseStmt(str);
	
	// _SetPropLev(x, ê_1, _lat.lub(C_l[x], C_l[ê_1], C_l[ê_2]));
	new_val_expr = $.extend(true, {}, prop_updt_expr.right);
	new_val_expr_str = window.util.printExprST(new_val_expr);
	new_val_level_expr = this.level.process(new_val_expr);
	new_val_level_expr_str = window.util.printExprST(new_val_level_expr);
	str = '_SetPropLev({0}, {1}, _lat.lub({2}, {3}, {4}));';
	str = $.validator.format(str, obj_ident, prop_expr_str, obj_level_expr_str, prop_level_expr_str, new_val_level_expr_str); 
	call_stmt = window.util.parseStmt(str);
	
	//  x[ê_1] = ê_2;
	str = '{0}[{1}] = {2};'; 
	str = $.validator.format(str, obj_ident, prop_expr_str, new_val_expr_str);
	compiled_prop_updt = window.util.parseStmt(str);
	
	return {
	   compiled_stmts: [
	      type_validation_stmt,
	      if_stmt,
	      call_stmt, 
	      compiled_prop_updt
	   ], 
	   new_vars: [ ]
   }; 
}; 


comp.processVarAssignmentExp = function (var_assignment_exp) {
	var compiled_right_side, 
	    original_right_side;
	original_right_side = var_assignment_exp.right; 
	compiled_right_side = this.compile(original_right_side); 
   if (compiled_right_side.hasOwnProperty('compiled_stmts')) {
      // right side is very simple expression
      return this.processSimpleVarAssignmentExp(var_assignment_exp.left.name, original_right_side, compiled_right_side); 	
   } else {
   	// right side is simple expression
   	return this.processVerySimplVarAssignmentExp(var_assignment_exp.left.name, original_right_side, compiled_right_side); 
   }
};

/*
 * Original Code: x = ê, where ê is simple
 * C[ê] = s, _vali, _levi
 * Compiled Code: 
 * s
 * _Enforce(_pc, C_l[x]); 
 * _SetVarLev('x', _lev_i, _lab); 
 * x = _vali; 
 */
comp.processSimpleVarAssignmentExp = function (ident, original_right_side, compiled_right_side) {
   var compiled_assignment, 
       enforce_stmt, 
       left_side_level_expr, 
       left_side_level_expr_str, 
       lev_var_ident, 
       set_var_stmt, 
       str, 
       val_var_ident; 
   
   //_Enforce(_pc, C_l[x]);
   left_side_level_expr = this.level.processIdentifier(ident);
   left_side_level_expr_str = window.util.printExprST(left_side_level_expr);
   str = '_Enforce(_pc, {0});';
   str = $.validator.format(str, left_side_level_expr_str);
   enforce_stmt = window.util.parseStmt(str);
   
   //_SetVarLev('x', _lev_i, _lab);
   lev_var_ident = compiled_right_side.new_vars[0].lev_var; 
   str = '_SetVarLev(\'{0}\', {1}, _lab);';
   str = $.validator.format(str, ident, lev_var_ident);
   set_var_stmt = window.util.parseStmt(str);
   
   //x = _vali;
   val_var_ident = compiled_right_side.new_vars[0].val_var; 
	str = '{0} = {1};'; 
	str = $.validator.format(str, ident, val_var_ident);
	compiled_assignment = window.util.parseStmt(str);
	
	compiled_right_side.compiled_stmts.push(enforce_stmt); 
	compiled_right_side.compiled_stmts.push(set_var_stmt); 
	compiled_right_side.compiled_stmts.push(compiled_assignment);
	
	return compiled_right_side;     
}; 

/*
 * Original Code: x = ê, where ê is very simple
 * Compiled Code: 
 * _Enforce(_pc, C_l[x]); 
 * _SetVarLev('x', _lat.lub(C_l[ê], _pc), _lab); 
 * x = ê; 
 */
comp.processVerySimplVarAssignmentExp = function (ident, original_right_side, compiled_right_side) {
   var compiled_assignment, 
       compiled_right_side_expr_str,
       enforce_stmt, 
       left_side_level_expr, 
       left_side_level_expr_str,
       right_side_level_expr, 
       right_side_level_expr_str,
       set_var_level_stmt,   
       str; 
   
   //_Enforce(_pc, C_l[x]);
   left_side_level_expr = this.level.processIdentifier(ident);
   left_side_level_expr_str = window.util.printExprST(left_side_level_expr);
   str = '_Enforce(_pc, {0});';
   str = $.validator.format(str, left_side_level_expr_str);
   enforce_stmt = window.util.parseStmt(str);
   
   //_SetVarLev('x', _lat.lub(C_l[ê], _pc), _lab); 
   right_side_level_expr = this.level.process(original_right_side);
   right_side_level_expr_str = window.util.printExprST(right_side_level_expr);
   str = '_SetVarLev(\'{0}\', _lat.lub({1}, _pc), _lab);';
   str = $.validator.format(str, ident, right_side_level_expr_str); 
   set_var_level_stmt = window.util.parseStmt(str);
   
   //assignement
   compiled_right_side_expr_str = window.util.printExprST(compiled_right_side); 
   str = '{0} = {1};'; 
   str = $.validator.format(str, ident, compiled_right_side_expr_str); 
   compiled_assignment = window.util.parseStmt(str);
   	
   return {
   	compiled_stmts: [
   	   enforce_stmt, 
   	   set_var_level_stmt, 
   	   compiled_assignment 
   	], 
   	new_vars: [ ]
   }     	
};

/*
 * Original Code: return ê - where ê is very simple
 * Compiled Code:
 * return {_val: ê, _lev: _lat.lub(C_l[ê], _pc)}
 */
comp.processReturnStmt = function (ret_stmt) {
	var compiled_ret_stmt, 
	    prop_val, 
	    prop_lev, 
	    ret_object, 
	    ret_val_expr, 
	    ret_level_expr, 
	    ret_level_expr_str, 
	    str; 
	
	//_val: ê
	ret_val_expr = $.extend(true, {}, ret_stmt.argument);
   prop_val = window.esprima.delegate.createProperty('init',
       window.esprima.delegate.createIdentifier(this.VAL_PROP_IDENT), 
       ret_val_expr
   );
	
	//_lev: _lat.lub(C_l[ê], _pc)
	ret_level_expr = this.level.process(ret_val_expr);
	ret_level_expr_str = window.util.printExprST(ret_level_expr);  
	str = '_lat.lub({0}, _pc)'; 
	str = $.validator.format(str, ret_level_expr_str);
	ret_level_expr = window.util.parseExpr(str); 
	prop_lev = window.esprima.delegate.createProperty('init',
       window.esprima.delegate.createIdentifier(this.LEV_PROP_IDENT), 
       ret_level_expr
   );
	
	//{_val: ê, _lev: _lat.lub(C_l[ê], _pc)}
	ret_object = window.esprima.delegate.createObjectExpression([
		prop_val, 
		prop_lev
	]); 
	//return {_val: ê, _lev: _lat.lub(C_l[ê], _pc)}
	compiled_ret_stmt = window.esprima.delegate.createReturnStatement(ret_object); 
		
   return {
   	compiled_stmts: [ compiled_ret_stmt ], 
   	new_vars: [ ]
   }; 
}; 

/*
 * Original Code: function(x_1, ..., x_n) { s }, C[s] = s' 
 * Compiled body: s'' = 
 *     var _lab, _aux, new_vars(s'); 
 *     var vars(s);
 *     _pc = _lat.lub(_pc, arguments.callee._pc); 
 *     _lab = _InitLab(arguments.callee._lab, ['x_1', ..., 'x_n'], args_levels, vars(s), _pc); 
 *     s' 
 * Compiled function literal: 
 *  _val_i = function(x_1, ..., x_n, args_levels, _external_pc) { s'' };  
 *  _val_i._lab = _lab; 
 *  _val_i._pc = _pc;
 *  _val_i._instrumented = true;  
 *  _lev_i = _pc; 
 */
comp.processFunctionLiteralExp = function (funlit_exp) {
	var assignment_1, 
	    assignment_2,
	    assignment_3,
	    assignment_4,
	    assignment_5,
	    compiled_funlit, 
	    val_lev_vars, 
	    str;
	     
	compiled_funlit = this.computeNewFunctionLiteral(funlit_exp); 
	val_lev_vars = this.getFreeValLevVars();
	
	//_val_i = function(x_1, ..., x_n, args_levels, _external_pc) { s'' };  
	assignment_1 = window.esprima.delegate.createAssignmentExpression(
	   '=',
	   window.esprima.delegate.createIdentifier(val_lev_vars.val_var), 
	   compiled_funlit 
   );
   assignment_1 = window.esprima.delegate.createExpressionStatement(assignment_1);
   
   //_val_i._lab = _lab; 
   str = ' {0}._lab = _lab;'
   str = $.validator.format(str, val_lev_vars.val_var);
   assignment_2 = window.util.parseStmt(str);
   
   //_val_i._pc = _pc; 
   str = '{0}._pc = _pc;' 
   str = $.validator.format(str, val_lev_vars.val_var);
   assignment_3 = window.util.parseStmt(str);
   
   //_val_i._instrumented = true;  
   str = '{0}._instrumented = true;' 
   str = $.validator.format(str, val_lev_vars.val_var);
   assignment_4 = window.util.parseStmt(str);
   
   //_lev_i = _pc; 
   str = '{0} = _pc; '; 
   str = $.validator.format(str, val_lev_vars.lev_var);
   assignment_5 = window.util.parseStmt(str);
	
	return {
		compiled_stmts: [ assignment_1, assignment_2, assignment_3, assignment_4, assignment_5 ] , 
		new_vars: [ val_lev_vars ]
	}; 
}


comp.computeNewFunctionLiteral = function (funlit_exp) {
	var args,
	    args_array_expr, 
	    assignment_1, 
	    body_stmts = [], 
	    compiled_body,
	    compiled_params, 
	    decl_vars_array_expr,
	    fun_scope_lab_ident,
	    funlit_body, 
	    init_lab_assignment,
	    init_lab_call, 
	    internal_vars_decl,   
	    new_vars_str,
	    original_vars_decl,
	    str;
	
	//Compute the new params
	//(x_1, ..., x_n, args_levels, _external_pc)
	compiled_params = $.extend(true, [], funlit_exp.params); 
	compiled_params.push(window.esprima.delegate.createIdentifier(this.level.ARGS_LEVELS_PARAM));
	compiled_params.push(window.esprima.delegate.createIdentifier(this.level.PC_IDENT));  
	
	//Compute the declaration of the compiler's internal variables
	//var _lab, _aux, new_vars(s'); 
	str = 'var _lab, _aux_1, _aux_2'; 
	compiled_body = this.compile(funlit_exp.body); 
	new_vars_str = this.newVarsToString(compiled_body.new_vars); 
	if (new_vars_str != '') {
		str += ', ' + new_vars_str; 
	}
	str += ';'; 
	internal_vars_decl = window.util.parseStmt(str);
   body_stmts.push(internal_vars_decl); 
	
	//Compute the declaration of the original variables
	//var vars(s);
	original_vars_decl =  this.getOriginalDeclarations(funlit_exp);
	if (original_vars_decl) {
		 original_vars_decl = $.extend(true, {}, original_vars_decl);
		 body_stmts.push(original_vars_decl);
	} 
	
	//_pc = _lat.lub(_pc, arguments.callee._pc);
	str = '_pc = _lat.lub(_pc, arguments.callee._pc); ';
	assignment_1 = window.util.parseStmt(str);
	body_stmts.push(assignment_1);
	
	//_lab = _InitLab(arguments.callee._lab, ['x_1', ..., 'x_n'], args_levels, vars(s), _pc); 
	args_array_expr = this.buildArgsArrayExpr(funlit_exp.params);
	decl_vars_array_expr = this.buildDeclVarsArrayExpr(original_vars_decl); 
	str = 'arguments.callee._lab'; 
	fun_scope_lab_ident = window.util.parseExpr(str);
	args = [ 
	   fun_scope_lab_ident, 
	   args_array_expr,
	   window.esprima.delegate.createIdentifier(this.level.ARGS_LEVELS_PARAM),  
	   decl_vars_array_expr, 
	   window.esprima.delegate.createIdentifier(this.level.PC_IDENT),
   ]; 
	init_lab_call = window.esprima.delegate.createCallExpression(
		window.esprima.delegate.createIdentifier(this.level.INIT_LAB_IDENT), 
		args
	);
	init_lab_assignment = window.esprima.delegate.createAssignmentExpression(
		'=',
		window.esprima.delegate.createIdentifier(this.level.LAB_IDENT),  
		init_lab_call); 
	init_lab_assignment = window.esprima.delegate.createExpressionStatement(init_lab_assignment); 
	body_stmts.push(init_lab_assignment); 
	
	// Add the compiled body to the stmts
	compiled_body.compiled_stmts[0].body = body_stmts.concat(compiled_body.compiled_stmts[0].body);
	
	// compute instrumented function literal
	return window.esprima.delegate.createFunctionExpression(null, compiled_params, [], compiled_body.compiled_stmts[0]);  
}; 


comp.processIdentifierExp = function (ident_st) {
	return $.extend(true, {}, ident_st);
};

comp.processLiteralExp = function (literal_st) {
	return $.extend(true, {}, literal_st);
};

comp.processThisExp = function (this_st) {
  	return $.extend(true, {}, this_st);
}; 


/* Original Code: x[ê]
   Compiled Code: 
   _isValidPropertyAccess(x, ê);
   _val_i = x[ê]; 
   _lev_i = C_l[x[ê]]; 
*/ 
comp.processPropLookUpExp = function (prop_lookup_expr) {
	var assignment_aux, 
	    assignment_stmt_1, 
	    assignment_stmt_2, 
	    obj_ident, 
	    prop_expr, 
	    prop_expr_str, 
	    str, 
	    type_validation_stm; 
	    
	// _isValidPropertyAccess(x, ê_1);
   obj_ident = prop_lookup_expr.object.name;
   prop_expr = $.extend(true, {}, prop_lookup_expr.property);
	prop_expr_str = window.util.printExprST(prop_expr);
	str = '_isValidPropertyAccess({0}, {1});'; 
	str = $.validator.format(str, obj_ident, prop_expr_str); 
	type_validation_stmt = window.util.parseStmt(str);
	
	val_lev_vars = this.getFreeValLevVars();
	
	// _val_i = x[ê];
	assignment_aux = window.esprima.delegate.createAssignmentExpression(
		'=',
		window.esprima.delegate.createIdentifier(val_lev_vars.val_var),  
		prop_lookup_expr); 
	assignment_stmt_1 = window.esprima.delegate.createExpressionStatement(assignment_aux);
	 
	// _lev_i = C_l[x[ê]]; 
	assignment_aux = window.esprima.delegate.createAssignmentExpression(
		'=',
		window.esprima.delegate.createIdentifier(val_lev_vars.lev_var),  
		this.level.process(prop_lookup_expr));
   assignment_stmt_2 = window.esprima.delegate.createExpressionStatement(assignment_aux);
	
   return {
   	compiled_stmts: [
   	   type_validation_stmt, 
   	   assignment_stmt_1, 
   	   assignment_stmt_2
   	], 
   	new_vars: [
   	   val_lev_vars
   	]
   };
};


/*
 * Original Code: ê_1 op ê_2
 * Compiled code: 
 *    _isValidOpInvocation(op, ê_1, ê_2);
 *    _val_i = ê_1 op ê_2; 
 *    _lev_i = C_l[ê_1 op ê_2];  
 */
comp.processBinOpExp = function (bin_op_expr) {
	var assignment_aux, 
	    assignment_stmt_1, 
	    assignment_stmt_2, 
	    assignment_stmt_3,
	    call_expr_aux, 
	    val_lev_vars; 
	    
	val_lev_vars = this.getFreeValLevVars();
	
	// _isValidOpInvocation(op, ê_1, ê_2);
	call_expr_aux = window.esprima.delegate.createCallExpression(
		window.esprima.delegate.createIdentifier(this.consts.IS_VALID_OP_INVOCATION), 
		[
		   window.esprima.delegate.createLiteral2(bin_op_expr.operator), 
		   bin_op_expr.left, 
		   bin_op_expr.right
		]
	);
	assignment_stmt_1 = window.esprima.delegate.createExpressionStatement(call_expr_aux);
	
	// _val_i = ê_1 op ê_2;
	assignment_aux = window.esprima.delegate.createAssignmentExpression(
		'=',
		window.esprima.delegate.createIdentifier(val_lev_vars.val_var),  
		$.extend(true, {}, bin_op_expr)); 
	assignment_stmt_2 = window.esprima.delegate.createExpressionStatement(assignment_aux);
	
	// _lev_i = C_l[ê_1 op ê_2]; 
	assignment_aux = window.esprima.delegate.createAssignmentExpression(
		'=',
		window.esprima.delegate.createIdentifier(val_lev_vars.lev_var),  
		this.level.process(bin_op_expr));
   assignment_stmt_3 = window.esprima.delegate.createExpressionStatement(assignment_aux);
	
	return {
   	compiled_stmts: [ 
   	   assignment_stmt_1, 
   	   assignment_stmt_2, 
   	   assignment_stmt_3
   	], 
   	new_vars: [
   	   val_lev_vars
   	]
   };
	
	
}; 


/*
 * Original Code: op ê
 * Compiled code: 
 *    _isValidOpInvocation(op, ê);
 *    _val_i = op ê; 
 *    _lev_i = C_l[op ê];  
 */
comp.processUnOpExp = function (un_op_expr) {
	var assignment_aux, 
	    assignment_stmt_1, 
	    assignment_stmt_2, 
	    assignment_stmt_3,
	    call_expr_aux, 
	    val_lev_vars; 
	
	val_lev_vars = this.getFreeValLevVars();
	
	// _isValidOpInvocation(op, ê);
	call_expr_aux = window.esprima.delegate.createCallExpression(
		window.esprima.delegate.createIdentifier(this.consts.IS_VALID_OP_INVOCATION), 
		[
		   window.esprima.delegate.createLiteral2(un_op_expr.operator), 
		   un_op_expr.argument
		]
	);
	assignment_stmt_1 = window.esprima.delegate.createExpressionStatement(call_expr_aux);
	
	// _val_i = ê_1 op ê_2;
	assignment_aux = window.esprima.delegate.createAssignmentExpression(
		'=',
		window.esprima.delegate.createIdentifier(val_lev_vars.val_var),  
		$.extend(true, {}, un_op_expr)); 
	assignment_stmt_2 = window.esprima.delegate.createExpressionStatement(assignment_aux);
	
	// _lev_i = C_l[ê_1 op ê_2]; 
	assignment_aux = window.esprima.delegate.createAssignmentExpression(
		'=',
		window.esprima.delegate.createIdentifier(val_lev_vars.lev_var),  
		this.level.process(un_op_expr.argument));
   assignment_stmt_3 = window.esprima.delegate.createExpressionStatement(assignment_aux);
	
	return {
   	compiled_stmts: [ 
   	   assignment_stmt_1, 
   	   assignment_stmt_2, 
   	   assignment_stmt_3
   	], 
   	new_vars: [
   	   val_lev_vars
   	]
   };
}; 

/*
 * Original Code: while(ê) { s }, C[s] = s'
 * Compiled Code: 
 * _pc_holder_i = _pc; 
 * _pc = _lat.lub(_pc, C_l[ê]); 
 * while(ê) { s' }
 * _pc = _pc_holderi; 
 */
comp.processWhileStmt = function (while_stmt) { 
   var assignment_1, 
       assignment_2, 
       assignment_3,
       compiled_body, 
       compiled_while,
       new_vars, 
       pc_holder_var, 
       pc_holder_ident, 
       str, 
       test_expr, 
       test_expr_str, 
       test_level_expr, 
       test_level_expr_str; 
   
   //_pc_holder_i = _pc;
   pc_holder_var = this.getPcHolderVar();
   new_vars = [ pc_holder_var ];
   pc_holder_ident = pc_holder_var.pc_holder;  
   str = '{0} = _pc';
   str = $.validator.format(str, pc_holder_ident);
   assignment_1 = window.util.parseStmt(str);
   
   //_pc = _lat.lub(_pc, C_l[ê]);
   test_expr = $.extend(true, {}, while_stmt.test);
   test_expr_str = window.util.printExprST(test_expr);
   test_level_expr = this.level.process(test_expr);
   test_level_expr_str = window.util.printExprST(test_level_expr);
   str = '_pc = _lat.lub(_pc, {0}); '; 
   str = $.validator.format(str, test_level_expr_str);
   assignment_2 = window.util.parseStmt(str);
   
   //while(ê) { s' }
   compiled_body = this.compile(while_stmt.body); 
   compiled_while = esprima.delegate.createWhileStatement(test_expr, compiled_body.compiled_stmts[0]); 
   new_vars = new_vars.concat(compiled_body.new_vars); 
   
   //_pc = _pc_holderi; 
   str = '_pc = {0};'; 
   str = $.validator.format(str, pc_holder_ident);
   assignment_3 = window.util.parseStmt(str); 
   
   return {
   	compiled_stmts: [
   	   assignment_1,
   	   assignment_2,  
   	   compiled_while, 
   	   assignment_3
   	], 
   	new_vars: new_vars
   }  
};

/*
 * Original Code: if(ê) { s_1 } else { s_2 }, C[s_1] = s_1', C[s_2] = s_2' 
 * Compiled Code: 
 * _pc_holder_i = _pc; 
 * _pc = _lat.lub(_pc, C_l[ê]); 
 * if (ê) { s_1' } else { s_2' } 
 * _pc = _pc_holder_i;
 *  
 */
comp.processIfStmt = function (if_stmt) { 
	var assignment_1, 
	    assignment_2, 
	    assignment_3, 
	    compiled_else_stmt,
	    compiled_if_stmt, 
	    compiled_then_stmt,
	    new_vars,
	    pc_holder_ident,  
	    pc_holder_var, 
	    str, 
	    test_expr, 
	    test_expr_str, 
	    test_level_expr, 
	    test_level_expr_str;
	
	// _pc_holder_i = _pc; 
	pc_holder_var = this.getPcHolderVar();
	new_vars = [ pc_holder_var ];
	pc_holder_ident = pc_holder_var.pc_holder;  
   str = '{0} = _pc';
   str = $.validator.format(str, pc_holder_ident);
   assignment_1 = window.util.parseStmt(str);
   
   // _pc = _lat.lub(_pc, C_l[ê]); 
   test_expr = $.extend(true, {}, if_stmt.test);
   test_expr_str = window.util.printExprST(test_expr);
   test_level_expr = this.level.process(test_expr);
   test_level_expr_str = window.util.printExprST(test_level_expr);
   str = '_pc = _lat.lub(_pc, {0});'; 
   str = $.validator.format(str, test_level_expr_str);
   assignment_2 = window.util.parseStmt(str);
	
	// if (ê) { s_1' } else { s_2' } 
	compiled_then_stmt = this.compile(if_stmt.consequent);
	compiled_else_stmt = this.compile(if_stmt.alternate); 
	compiled_if_stmt = window.esprima.delegate.createIfStatement(
      test_expr, 
      compiled_then_stmt.compiled_stmts[0],
      compiled_else_stmt ? compiled_else_stmt.compiled_stmts[0] : null); 
   new_vars = new_vars.concat(compiled_then_stmt.new_vars); 
   new_vars = compiled_else_stmt ? new_vars.concat(compiled_else_stmt.new_vars) : new_vars; 
	
	// _pc = _pc_holder_i
	str = '_pc = {0};';
	str = $.validator.format(str, pc_holder_ident); 
	assignment_3 = window.util.parseStmt(str);
	
	return {
   	compiled_stmts: [
   	   assignment_1, 
   	   assignment_2, 
   	   compiled_if_stmt, 
   	   assignment_3
   	], 
   	new_vars: new_vars
   }  
}; 

// Levels and stuff

comp.level = {
	ARGS_LEVELS_PARAM: '_args_levels',
	INIT_LAB_IDENT: '_InitLab', 
	LAB_IDENT: '_lab',
	PC_IDENT: '_pc',
	getVarLevIdent: '_GetVarLev',
	getPropLevIdent: '_GetPropLev', 
	latLit: '_lat', 
	latBot: '_bot', 
	ub: '_ub', 
}; 

comp.level.getPropLevelCall = function(obj, prop){
	var obj = util.deepCopy(obj); 
	var prop = util.deepCopy(prop); 
	var getPropLevelIdent = esprima.delegate.createLiteral2(this.getPropLevelIdent);
	return esprima.delegate.createCallExpression(getPropLevelIdent, [obj, prop]); 	 
}; 

comp.level.ubFunCall = function(args) { 
	var lat = esprima.delegate.createLiteral2(this.latLit); 
	var ub = esprima.delegate.createLiteral2(this.ub);
	
	var memberExp = esprima.delegate.createMemberExpression('[', lat, ub); 
	return esprima.delegate.createCallExpression(memberExp, args); 
}; 

comp.level.latBotExp = function() { 
	var lat = esprima.delegate.createIdentifier(this.latLit);
	var bot = esprima.delegate.createLiteral2(this.latBot);
	return esprima.delegate.createMemberExpression('[', lat, bot); 
}; 

comp.level.process = function(exp){
	switch (exp.type) {
	   case 'Identifier':
	      return this.processIdentifier(exp.name);
	   case 'Literal': 
		   return this.processLiteral();
		case 'ThisExpression': 
		   return this.processThis();
		case 'MemberExpression': 
		   return this.processPropLookUp(exp);   
		case 'BinaryExpression': 
		   return this.processBinOp(exp); 
		case 'UnaryExpression': 
		   return this.processUnOp(exp); 
	   default: throw new Error('error in compilation of expression level')
	}
}; 

/*
 * original code: x 
 * compiled code: _GetVarLev('x', _lab)
 */
comp.level.processIdentifier = function (ident) { 
	var ident = esprima.delegate.createLiteral2(ident); 
	var getVarLevIdent = esprima.delegate.createIdentifier(this.getVarLevIdent);
	var labIdent = esprima.delegate.createIdentifier(this.LAB_IDENT);
	var args = [ident, labIdent]; 
	return esprima.delegate.createCallExpression(getVarLevIdent, args); 
}; 

comp.level.processLiteral = function () {
	return this.latBotExp();  
};

/*
 * Original Code: this
 * Compiled Code: _GetVarLev('this', _lab)
 */
comp.level.processThis = function () {
	var str; 
	str = '_GetVarLev(\'this\', _lab)'; 
	return window.util.parseExpr(str);  
}; 

/*
 * Original Code: x[ê]
 * Compiled Code: _lat.lub(_GetVarLev('x', _lab), C_l[ê], _GetPropLev(x, ê))
 */
comp.level.processPropLookUp = function (prop_lookup_expr) {
	var obj_ident, 
	    prop_expr, 
	    prop_expr_str, 
	    prop_level_expr, 
	    prop_level_expr_str,
	    str; 
	
	obj_ident = prop_lookup_expr.object.name; 
	prop_expr = $.extend(true, {}, prop_lookup_expr.property); 
	prop_expr_str = window.util.printExprST(prop_expr);
	prop_level_expr = this.process(prop_expr); 
	prop_level_expr_str = window.util.printExprST(prop_level_expr);
	str = '_lat.lub(_GetVarLev(\'{0}\', _lab), {1}, _GetPropLev({0}, {2}))'; 
	str = $.validator.format(str, obj_ident, prop_level_expr_str, prop_expr_str);
	return window.util.parseExpr(str);  
}; 

/*
 * Original Code: ê_1 op ê_2
 * Compiled Code: _lat.lub(C_l[e_1], C_l[e_2])
 */
comp.level.processBinOp = function (binop_expr) {
	var left_level_expr, 
	    left_level_expr_str, 
	    right_level_expr, 
	    right_level_expr_str, 
	    str;
	     
	left_level_expr = this.process(binop_expr.left); 
	left_level_expr_str = window.util.printExprST(left_level_expr);
	right_level_expr = this.process(binop_expr.right); 
	right_level_expr_str = window.util.printExprST(right_level_expr);
	str = '_lat.lub({0}, {1})'; 
	str = $.validator.format(str, left_level_expr_str, right_level_expr_str); 
	return window.util.parseExpr(str);
}; 

/*
 * Original code op ê
 * compiled code: C_l[ê]
 */
comp.level.processUnOp = function (unop_expr) {
   return this.process(unop_expr.argument); 
};

comp.level.computeArgumentLevels = function(args){
	var arg, argLevels;
	argLevels = [];  
	for(var i=0, len=args.length; i<len; i++){
		arg = args[i]; 
		switch(arg.type){
			case "Identifier":
			    argLevels.push(this.processIdentifier(arg.name));
			    break;  
			case "Literal": 
			    argLevels.push(this.processLiteral()); 
			    break; 
		    default: throw new Error('error in arguments')
		}
	}
	return esprima.delegate.createArrayExpression(argLevels); 
}; 

// new_vars_to_string
comp.newVarsToString = function (new_vars) {
	var current_var, 
	    i, 
	    len = new_vars.length, 
	    new_vars_str = ''; 
	    
	i = len; 
	while(i--) {
		if(new_vars_str !== '') new_vars_str += ', '; 
		current_var = new_vars[i]; 
		if (current_var.hasOwnProperty('val_var')) {
			new_vars_str += current_var.val_var + ', '; 
			new_vars_str += current_var.lev_var; 
		} else {
			new_vars_str += current_var.pc_holder;  
		}
	}
	
	return new_vars_str; 
}; 

comp.getOriginalDeclarations = function (funlit_exp) {
	var body; 
	body = funlit_exp.body.body 
   if ((body.length > 0) && (body[0].type === 'VariableDeclaration')) { 
      return body[0];
   }  	
   return null; 
};

comp.getProgDeclarations = function(prog_exp) {
   var body = prog_exp.body; 
   if ((body.length > 0) && (body[0].type === 'VariableDeclaration')) {
   	return body[0];
   }
   return null; 
};

comp.buildArgsArrayExpr = function (params) {
   var i, 
       len, 
       literals_arr = []; 
       
   for (i = 0, len = params.length; i < len; i++) {
      literals_arr.push(window.esprima.delegate.createLiteral2(params[i].name));   	 
   }
   
   return esprima.delegate.createArrayExpression(literals_arr);   
};

comp.buildDeclVarsArrayExpr = function (decl_stmt) {
   var declarations, 
       i, 
       len,
       literals_arr = []; 
   
   declarations = decl_stmt ? decl_stmt.declarations : []; 
   for (i = 0, len = declarations.length; i < len; i++) {
      literals_arr.push(window.esprima.delegate.createLiteral2(declarations[i].id.name));  
   }
   
   return esprima.delegate.createArrayExpression(literals_arr); 
};
