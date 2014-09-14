if (!sec_types) {
   throw new Error('sec_types object is supposed to be defined when running type_checker.js'); 
}

sec_types.typeCheck = function (st, type_env) {	
   if(!st) return st; 
	switch(st.type)	{
		case 'Program': 
		   return this.typeCheckProgram(st, type_env); 
		case 'ExpressionStatement': 
		   return this.typeCheckExprStmt(st, type_env); 
		case 'Literal': 
		   return this.typeCheckLiteral(st, type_env); 
		case 'Identifier': 
		   return this.typeCheckIdentifier(st, type_env);   
		case 'AssignmentExpression': 
		   return this.typeCheckAssignmentExpr(st, type_env); 
		case 'BinaryExpression': 
		   if (st.operator === 'in')
		      return this.typeCheckInExpr(st, type_env);
		   else return this.typeCheckBinOpExpr(st, type_env); 
		case 'MemberExpression': 
		   return this.typeCheckPropertyLookUp(st, type_env);
		case 'UnaryExpression':
		   if (st.operator === 'delete') 
		      return this.typeCheckDeleteExpr(st, type_env); 
		   else return this.typeCheckUnOpExpr(st, type_env);
		case 'IfStatement':
	       return this.typeCheckIfStmt(st, type_env);  
	    case 'BlockStatement':
	       return this.typeCheckBlockStmt(st, type_env);
	    case 'ObjectExpression': 
		   return this.typeCheckObjectExpr(st, type_env); 
		case 'LogicalExpression': 
		   return this.typeCheckBinOpExpr(st, type_env);
	    case 'WhileStatement': 
	       return this.typeCheckWhileStmt(st, type_env);
	    case 'CallExpression':
		   return this.typeCheckCallExpr(st, type_env);
/* 		case 'ThisExpression': 
		   return this.typeCheckThisExpr(st); 
		case 'NewExpression': 
		   return this.compileConstructorCallExpr(st);  
	   case 'ReturnStatement': 
	      return this.compileReturnStmt(st);  
	   case 'FunctionExpression': 
	      return this.compileFunctionLiteralExpr(st); 
	   case 'VariableDeclaration': 
	      return null;  */  
		default:  
		   if (!st.type) {
		   	throw new Error('Syntax Error - Illegal Program');
		   } else {
		   	throw new Error('Construct ' + st.type + ' is not supported yet');
		   }   
	}
};

sec_types.typeCheckProgram = function (st, type_env) {
   var compiled_prog, compiled_stmts = [], current_compiled_stmts, i, len, level_set, new_vars = [], 
      new_vars_decl, original_vars_decl, ret, stmts = st.body, type_set; 
   
   if (st.type !== esprima.Syntax.Program) {
      throw new Error('Trying to type program statement with something that is not a program statement');
   }
   	 	
   level_set = this.conds.makeCondSet(lat.top, 'true'); 
   type_set = this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true');
  	
   for (i = 0, len = stmts.length; i < len; i++) {
      ret = this.typeCheck(stmts[i], type_env);
      
      current_compiled_stmts = ret.stmts; 
      if (!current_compiled_stmts) continue; 
      
      level_set = this.conds.genFun(level_set, ret.level_set, lat.glb);
      type_set = ret.type_set; 
      
      compiled_stmts = compiled_stmts.concat(current_compiled_stmts);
	  new_vars = new_vars.concat(ret.new_vars);	
   }
   
   original_vars_decl = utils.getProgDeclarations(st);
   new_vars_decl = this.buildNewVarsDeclaration(new_vars);
   if (original_vars_decl) compiled_stmts.unshift(original_vars_decl); 
   if (new_vars_decl) compiled_stmts.unshift(new_vars_decl); 
   
   compiled_prog = esprima.delegate.createProgram(compiled_stmts);
   
   return {
      writing_effect: level_set, 
      reading_effect: type_set, 
      instrumentation: compiled_prog
   };   
}; 

sec_types.buildNewVarsDeclaration = function (new_vars) {
	var i, len = new_vars.length, new_vars_str = ''; 
	    
	i = len; 
	while(i--) {
		if(new_vars_str !== '') new_vars_str += ', '; 
		new_vars_str += new_vars[i]; 
	}
	
	if (new_vars_str !== '') {
	   new_vars_str = 'var ' + new_vars_str + ';';
	   return window.utils.parseStmt(new_vars_str);
	} else {
	   return null;
	} 
}; 

sec_types.typeCheckBlockStmt = function (block_stmt, type_env) {
   var i, len, level_set, new_vars, stmts, type_set; 
    
   new_vars = []; 
   stmts = []; 
   level_set = this.conds.makeCondSet(lat.top, 'true'); 
   type_set = this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true');
   
   for (i = 0, len = block_stmt.body.length; i < len; i++) {
      ret = this.typeCheck(block_stmt.body[i], type_env); 
      stmts = stmts.concat(ret.stmts);
      new_vars = new_vars.concat(ret.new_vars);
      level_set = this.conds.genFun(level_set, ret.level_set, lat.glb);
      type_set = ret.type_set; 
   }
   
   return {
      new_vars: new_vars,
      stmts: stmts,
      level_set: level_set, 
      expr: window.esprima.delegate.createIdentifier('undefined'), 
      type_set: this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true'), 
   };
}; 

sec_types.typeCheckExprStmt = function (expr_stmt, type_env) { 
   var ret, stmts;
   
   ret = this.typeCheck(expr_stmt.expression, type_env);
   stmts = ret.stmts; 
   stmts.push(window.esprima.delegate.createExpressionStatement(ret.expr));
   
   return {
      new_vars: ret.new_vars,
      expr: $.extend(true, {}, ret.expr),
      stmts: stmts, 
      type_set: ret.type_set, 
      level_set: ret.level_set
   };
}; 

sec_types.typeCheckLiteral = function (st, type_env) { 
   return {
      new_vars: [],
      stmts: [],
      expr: $.extend(true, {}, st),
      type_set: this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true'),
      level_set: this.conds.makeCondSet(lat.top, 'true')  
   };
};

sec_types.typeCheckIdentifier = function (st, type_env) { 
   var compiled_assignment_stmt, new_var_name;
   
   if (!type_env.hasOwnProperty(st.name)) {
     throw new Error('Typing Error: Incomplete Typing Environment');
   }
   
   new_var_name = this.generateNewVarName(); 
   
   compiled_assignment_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(new_var_name), 
   	  window.esprima.delegate.createIdentifier(st.name));
   compiled_assignment_stmt = window.esprima.delegate.createExpressionStatement(compiled_assignment_stmt);
   
   return {
      new_vars: [ new_var_name ],
      stmts: [ compiled_assignment_stmt ],
      expr: window.esprima.delegate.createIdentifier(new_var_name),
      type_set: this.conds.makeCondSet(type_env[st.name], 'true'), 
      level_set: this.conds.makeCondSet(lat.top, 'true')
   };
};

sec_types.typeCheckAssignmentExpr = function (assign_expr, type_env) {
   if (assign_expr.left.type == 'MemberExpression') {
      return this.typeCheckPropertyAssignmentExpr(assign_expr, type_env);  
   } else {
   	  return this.typeCheckVarAssignmentExpr(assign_expr, type_env); 
   }
};

sec_types.typeCheckVarAssignmentExpr = function (assign_expr, type_env) {
   var compiled_assignment_stmt, compiled_right_side, cond, err, level_set, ret_right_side, stmts, var_name, var_type_set;

   var_name = assign_expr.left.name; 
   if (!type_env.hasOwnProperty(var_name)) {
   	  err = new Error('Typing Error: Incomplete Typing Environment');
   	  err.typing_error = true; 
      throw err;
   }
    
   ret_right_side = this.typeCheck(assign_expr.right, type_env);
   var_type_set = [{element: type_env[var_name], cond: 'true'}];  
   cond = this.conds.when(ret_right_side.type_set, var_type_set, this.isSubType);
   if (!cond) {
      // alert('Typing Error: Illegal Assignment'); 
      err = new Error('Typing Error: Illegal Assignment');
      err.typing_error = true; 
      throw err; 
   }
   
   compiled_assignment_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(var_name), 
   	  $.extend(true, {}, ret_right_side.expr));
   compiled_assignment_stmt = window.esprima.delegate.createExpressionStatement(compiled_assignment_stmt);
   
   compiled_assignment_stmt = this.buildIfWrapper([compiled_assignment_stmt], cond); 
   stmts = ret_right_side.stmts; 
   stmts.push(compiled_assignment_stmt); 
   
   var_level_set = [{element: type_env[var_name].level, cond: 'true'}];
   level_set = this.conds.genFun(ret_right_side.level_set, var_level_set, lat.glb);
   return {
      new_vars: ret_right_side.new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createIdentifier(var_name), 
      type_set: ret_right_side.type_set, 
      level_set: level_set 
   };  
};

sec_types.typeCheckBinOpExpr = function (binop_expr, type_env) {
   var binop, compiled_stmt, level_set, new_var_name, new_vars, ret_left_side, ret_right_side, stmts, type_set; 
   
   ret_left_side = this.typeCheck(binop_expr.left, type_env);
   ret_right_side = this.typeCheck(binop_expr.right, type_env);
   
   new_var_name = this.generateNewVarName(); 
   new_vars = ret_left_side.new_vars.concat(ret_right_side.new_vars);
   new_vars.push(new_var_name); 
   
   if ((typeof binop_expr.operator) === 'object') {
      binop = binop_expr.operator.value;
   } else {
   	  binop = binop_expr.operator;
   }
   
   compiled_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(new_var_name), 
   	  window.esprima.delegate.createBinaryExpression(binop,
   	     ret_left_side.expr, 
   	     ret_right_side.expr));
   compiled_stmt = window.esprima.delegate.createExpressionStatement(compiled_stmt);  
   stmts = ret_left_side.stmts.concat(ret_right_side.stmts);
   stmts.push(compiled_stmt); 
  
   type_set = this.conds.genFun(ret_left_side.type_set, ret_right_side.type_set, this.lubType);
   level_set = this.conds.genFun(ret_left_side.level_set, ret_right_side.level_set, lat.glb);
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createIdentifier(new_var_name), 
      type_set: type_set, 
      level_set: level_set 
   }; 
};  

sec_types.typeCheckUnOpExpr = function (unop_expr, type_env) {
   var compiled_stmt, level_set, new_var_name, new_vars, ret_argument, stmts, type_set; 
   
   ret_argument = this.typeCheck(unop_expr.argument, type_env);
   
   new_var_name = this.generateNewVarName(); 
   new_vars = ret_argument.new_vars;
   new_vars.push(new_var_name); 
   
   compiled_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(new_var_name), 
   	  window.esprima.delegate.createUnaryExpression(unop_expr.operator, ret_argument.expr));
   compiled_stmt = window.esprima.delegate.createExpressionStatement(compiled_stmt);  
   stmts = ret_argument.stmts;
   stmts.push(compiled_stmt); 
  
   type_set = ret_argument.type_set;
   level_set = ret_argument.level_set;
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createIdentifier(new_var_name), 
      type_set: type_set, 
      level_set: level_set 
   }; 
};  
	
sec_types.typeCheckPropertyLookUp = function (member_expr, type_env) {
   var compiled_stmt, level_set, lev_exp_set, lev_set_obj, lev_set_prop, look_up_set, look_up_type_set, new_vars, 
      new_var_name, property_annotation, ret_obj, ret_obj_type_set, ret_prop, ret_prop_type_set, stmts; 
   
   property_annotation = member_expr.property.property_set; 
   
   ret_obj = this.typeCheck(member_expr.object, type_env); 
   ret_prop = this.typeCheck(member_expr.property, type_env); 
   
   ret_obj_type_set = this.conds.floor(ret_obj.type_set, 'OBJ'); 
   ret_prop_type_set = this.conds.floor(ret_prop.type_set, 'PRIM'); 
   
   look_up_set = this.conds.objSetLookup(ret_obj_type_set, ret_prop.expr, property_annotation);
   look_up_type_set = this.conds.projection(look_up_set, 'type'); 
   
   lev_set_obj = this.conds.levLog(ret_obj_type_set); 
   lev_set_prop = this.conds.levLog(ret_prop_type_set); 
   lev_exp_set = this.conds.genFun(lev_set_obj, lev_set_prop, lat.lub);
   look_up_type_set = this.conds.levExp(look_up_type_set, lev_exp_set); 
   
   level_set = this.conds.genFun(ret_obj.level_set, ret_prop.level_set, lat.glb);
   
   new_var_name = this.generateNewVarName(); 
   new_vars = ret_obj.new_vars.concat(ret_prop.new_vars);
   new_vars.push(new_var_name); 
    
   compiled_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(new_var_name), 
   	  window.esprima.delegate.createMemberExpression('[', 
   	     ret_obj.expr, 
   	     ret_prop.expr));
   compiled_stmt = window.esprima.delegate.createExpressionStatement(compiled_stmt);  
   stmts = ret_obj.stmts.concat(ret_prop.stmts);
   stmts.push(compiled_stmt);  
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createIdentifier(new_var_name), 
      type_set: look_up_type_set, 
      level_set: level_set 
   };  
};

sec_types.typeCheckPropertyAssignmentExpr = function (prop_assign_expr, type_env) {
   var compiled_assignment_stmt, cond, cond_type, cond_level, err, 
      level_set, lev_set_obj, lev_set_prop, lev_set_obj_prop,  
      look_up_set, look_up_level_set, look_up_type_set, new_vars, 
      property_annotation, ret_obj, ret_obj_type_set, ret_prop, ret_right, stmts; 
   
   property_annotation = prop_assign_expr.left.property.property_set;
    
   ret_obj = this.typeCheck(prop_assign_expr.left.object, type_env); 
   ret_prop = this.typeCheck(prop_assign_expr.left.property, type_env); 
   ret_right = this.typeCheck(prop_assign_expr.right, type_env); 
   
   ret_obj_type_set = this.conds.floor(ret_obj.type_set, 'OBJ'); 
   //ret_prop_type_set = sec_types.conds.floor(ret_prop.type_set, 'PRIM'); 
   
   look_up_set = this.conds.objSetLookup(ret_obj_type_set, ret_prop.expr, property_annotation);
   look_up_type_set = this.conds.projection(look_up_set, 'type'); 
   look_up_level_set = this.conds.projection(look_up_set, 'level'); 
   
   lev_set_obj = this.conds.levLog(ret_obj_type_set); 
   lev_set_prop = this.conds.levLog(ret_prop.type_set); 
   lev_set_obj_prop = this.conds.genFun(lev_set_obj, lev_set_prop, lat.lub); 
   
   cond_type = this.conds.when(ret_right.type_set, look_up_type_set, this.isSubType);
   cond_level = this.conds.when(lev_set_obj_prop, look_up_level_set, lat.leq);
   if (!cond_type || !cond_level) {
      //alert('Typing Error: Illegal Assignment'); 
      err = new Error('Typing Error: Illegal Assignment');
      err.typing_error = true; 
      throw err; 
   }

   compiled_assignment_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createMemberExpression('[', 
   	     $.extend(true, {}, ret_obj.expr), 
   	     $.extend(true, {}, ret_prop.expr)), 
   	  $.extend(true, {}, ret_right.expr));
   compiled_assignment_stmt = window.esprima.delegate.createExpressionStatement(compiled_assignment_stmt);
   cond = this.conds.buildBinaryCond('&&', cond_type, cond_level); 
   cond = this.conds.simplifyCond(cond); 
   
   compiled_assignment_stmt = this.buildIfWrapper([compiled_assignment_stmt], cond); 
   stmts = ret_obj.stmts.concat(ret_prop.stmts);
   stmts = stmts.concat(ret_right.stmts);  
   stmts.push(compiled_assignment_stmt); 
   
   new_vars = ret_obj.new_vars.concat(ret_prop.new_vars);
   new_vars = new_vars.concat(ret_right.new_vars); 
 
   level_set = this.conds.genFun(ret_obj.level_set, ret_prop.level_set, lat.glb);
   level_set = this.conds.genFun(level_set, ret_right.level_set, lat.glb); 
   level_set = this.conds.genFun(level_set, look_up_level_set, lat.glb); 
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: ret_right.expr, 
      type_set: ret_right.type_set, 
      level_set: level_set 
   };
}; 


sec_types.typeCheckInExpr = function (in_expr, type_env) {
   var compiled_stmt, level_set, lev_set_obj, lev_set_prop, lev_set_obj_prop, look_up_set, 
      look_up_level_set, new_vars, new_var_name, property_annotation, 
      type_set, stmts; 
      
   property_annotation = in_expr.property_set;
   
   ret_prop = this.typeCheck(in_expr.left, type_env);
   ret_obj = this.typeCheck(in_expr.right, type_env);
   
   new_var_name = this.generateNewVarName(); 
   new_vars = ret_prop.new_vars.concat(ret_obj.new_vars);
   new_vars.push(new_var_name); 
   
   ret_obj_type_set = this.conds.floor(ret_obj.type_set, 'OBJ'); 
   look_up_set = this.conds.objSetLookup(ret_obj_type_set, ret_prop.expr, property_annotation);
   look_up_level_set = this.conds.projection(look_up_set, 'level'); 
   
   lev_set_obj = this.conds.levLog(ret_obj_type_set); 
   lev_set_prop = this.conds.levLog(ret_prop.type_set); 
   lev_set_obj_prop = this.conds.genFun(lev_set_obj, lev_set_prop, lat.lub);
   lev_set_obj_prop = this.conds.genFun(lev_set_obj_prop, look_up_level_set, lat.lub);
    
   type_set = this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true');
   type_set = this.conds.levExp(type_set, lev_set_obj_prop); 
   level_set = this.conds.genFun(ret_obj.level_set, ret_prop.level_set, lat.glb);
   
   compiled_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(new_var_name), 
   	  window.esprima.delegate.createBinaryExpression('in', ret_prop.expr, ret_obj.expr));
   compiled_stmt = window.esprima.delegate.createExpressionStatement(compiled_stmt);  
   stmts = ret_prop.stmts.concat(ret_obj.stmts);
   stmts.push(compiled_stmt); 
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createIdentifier(new_var_name), 
      type_set: type_set, 
      level_set: level_set 
   };
};

sec_types.typeCheckDeleteExpr = function (delete_expr, type_env) {
   var compiled_delete_stmt, cond, err, level_set, lev_set_obj, lev_set_obj_prop, lev_set_prop, look_up_set, 
          look_up_level_set, new_vars, property_annotation, ret_obj, ret_obj_type_set, ret_prop, stmts; 
   
   property_annotation = delete_expr.argument.property.property_set;
   
   ret_obj = this.typeCheck(delete_expr.argument.object, type_env);
   ret_prop = this.typeCheck(delete_expr.argument.property, type_env);
   ret_obj_type_set = this.conds.floor(ret_obj.type_set, 'OBJ'); 
   
   new_vars = ret_prop.new_vars.concat(ret_obj.new_vars);
   
   look_up_set = this.conds.objSetLookup(ret_obj_type_set, ret_prop.expr, property_annotation);
   look_up_level_set = this.conds.projection(look_up_set, 'level'); 
   
   lev_set_obj = this.conds.levLog(ret_obj_type_set); 
   lev_set_prop = this.conds.levLog(ret_prop.type_set); 
   lev_set_obj_prop = this.conds.genFun(lev_set_obj, lev_set_prop, lat.lub); 
   
   cond = this.conds.when(lev_set_obj_prop, look_up_level_set, lat.leq);
   if (!cond) {
      //alert('Typing Error: Illegal Assignment'); 
      err =  new Error('Typing Error: Illegal Assignment'); 
      err.typing_error = true;  
      throw err; 
   }
   
   compiled_delete_stmt = window.esprima.delegate.createMemberExpression('[', 
      $.extend(true, {}, ret_obj.expr), 
   	  $.extend(true, {}, ret_prop.expr));
   compiled_delete_stmt = window.esprima.delegate.createUnaryExpression('delete', compiled_delete_stmt); 
   compiled_delete_stmt = window.esprima.delegate.createExpressionStatement(compiled_delete_stmt); 
   compiled_delete_stmt = this.buildIfWrapper([compiled_delete_stmt], cond); 
   stmts = ret_obj.stmts.concat(ret_prop.stmts);  
   stmts.push(compiled_delete_stmt); 
   
   level_set = this.conds.genFun(ret_obj.level_set, ret_prop.level_set, lat.glb);
   level_set = this.conds.genFun(level_set, look_up_level_set, lat.glb); 
   
   return {
      new_vars: new_vars,
      expr: window.esprima.delegate.createIdentifier('undefined'),
      stmts: stmts, 
      type_set: this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true'), 
      level_set: level_set
   };
   
};

sec_types.typeCheckIfStmt = function (if_stmt, type_env) {
   var assignment, compiled_alternate, compiled_consequent, compiled_if_stmt, cond, cond_false, 
      cond_true, err, level_set, level_set_alternate, level_set_consequent, level_set_consequent_alternate, 
      lev_set_test, new_var_name, new_vars, ret_alternate, ret_consequent, ret_test,   
      type_set, type_set_alternate, type_set_consequent;  
   
   ret_test = this.typeCheck(if_stmt.test, type_env);
   ret_consequent = this.typeCheck(if_stmt.consequent, type_env);
   ret_alternate = this.typeCheck(if_stmt.alternate, type_env);
   
   new_var_name = this.generateNewVarName(); 
   new_vars = ret_test.new_vars.concat(ret_consequent.new_vars);
   new_vars = ret_alternate ? new_vars.concat(ret_alternate.new_vars) : new_vars;
   new_vars.push(new_var_name); 
   
   lev_set_test = this.conds.levLog(ret_test.type_set); 
   level_set_consequent = ret_consequent.level_set;
   if (ret_alternate) {
      level_set_alternate = ret_alternate.level_set;
      level_set_consequent_alternate = this.conds.genFun(level_set_consequent, level_set_alternate, lat.glb);   	
   } else {
   	  level_set_consequent_alternate = level_set_consequent; 
   }
   cond = this.conds.when(lev_set_test, level_set_consequent_alternate, lat.leq);
   
   if (!cond) {
      //alert('Typing Error: Illegal Memory Update Inside High Conditional'); 
      err = new Error('Typing Error: Illegal Memory Update Inside High Conditional');
      err.typing_error; 
      throw err; 
   }
   
   assignment = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(new_var_name), 
   	  ret_consequent.expr);
   assignment = window.esprima.delegate.createExpressionStatement(assignment);  
   ret_consequent.stmts.push(assignment); 
   compiled_consequent = window.esprima.delegate.createBlockStatement(ret_consequent.stmts);
   
   if (ret_alternate) {
      assignment = window.esprima.delegate.createAssignmentExpression('=', 
   	     window.esprima.delegate.createIdentifier(new_var_name), 
   	     ret_alternate.expr);
      assignment = window.esprima.delegate.createExpressionStatement(assignment);  
      ret_alternate.stmts.push(assignment); 
      compiled_alternate = window.esprima.delegate.createBlockStatement(ret_alternate.stmts); 
   }
   
   compiled_alternate = compiled_alternate ? compiled_alternate : null; 
   compiled_if_stmt = window.esprima.delegate.createIfStatement(ret_test.expr, compiled_consequent, compiled_alternate);
   compiled_if_stmt = this.buildIfWrapper([compiled_if_stmt], cond); 
   stmts = ret_test.stmts;  
   stmts.push(compiled_if_stmt); 
   
   cond_false = this.conds.buildElementaryCond(ret_test.expr, [false, undefined, 0, null]);
   cond_true = this.conds.buildUnaryCond('!', $.extend(true, {}, cond_false));
   
   type_set_consequent = ret_consequent.type_set;
   sec_types.conds.condExp(type_set_consequent, cond_true);
   if (ret_alternate) { 
      type_set_alternate = ret_alternate.type_set;
      sec_types.conds.condExp(type_set_alternate, cond_false); 
      type_set = type_set_consequent.concat(type_set_alternate);
   } else {
   	  type_set = type_set_consequent; 
   }
   
   sec_types.conds.condExp(level_set_consequent, cond_true);
   if (ret_alternate) {
      sec_types.conds.condExp(level_set_alternate, cond_false);  
      level_set = level_set_consequent.concat(level_set_alternate); 	
   } else {
   	  level_set = level_set_consequent; 
   }
   level_set = this.conds.genFun(ret_test.level_set, level_set, lat.glb);
   
   return {
      new_vars: new_vars,
      expr: window.esprima.delegate.createIdentifier(new_var_name),
      stmts: stmts, 
      type_set: type_set, 
      level_set: level_set
   };
}; 

sec_types.typeCheckWhileStmt = function (while_stmt, type_env) {
   var compiled_body, compiled_while_stmt, cond, err, level_set, level_set_body, lev_set_test, 
      new_vars, ret_body, ret_test, stmts; 
      
   ret_test = this.typeCheck(while_stmt.test, type_env);
   ret_body = this.typeCheck(while_stmt.body, type_env);
  
   lev_set_test = this.conds.levLog(ret_test.type_set); 
   level_set_body = ret_body.level_set;  
   cond = this.conds.when(lev_set_test, level_set_body, lat.leq);
   if (!cond) {
      //alert('Typing Error: Illegal While Statement'); 
      err = new Error('Typing Error: Illegal While Statement');
      err.typing_error = true; 
      throw err; 
   }
   
   compiled_body = window.esprima.delegate.createBlockStatement(ret_body.stmts); 
   compiled_while_stmt = window.esprima.delegate.createWhileStatement(ret_test.expr, compiled_body);
   compiled_while_stmt = this.buildIfWrapper([compiled_while_stmt], cond); 
   stmts = ret_test.stmts;  
   stmts.push(compiled_while_stmt); 
   
   level_set = this.conds.genFun(ret_test.level_set, ret_body.level_set, lat.glb);
   new_vars = ret_test.new_vars.concat(ret_body.new_vars);
    
   return {
      new_vars: new_vars,
      expr: window.esprima.delegate.createIdentifier('undefined'),
      stmts: stmts, 
      type_set: type_set, 
      level_set: level_set
   };
}; 

sec_types.typeCheckObjectExpr = function (obj_expr, type_env) {
   var compiled_stmt, new_vars, new_var_name, object_type, stmts; 
   
   object_type = this.lit_annotations[this.lit_index];
   this.lit_index++;  
   
   new_var_name = this.generateNewVarName(); 
   new_vars = [ new_var_name ]; 
    
   compiled_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(new_var_name), 
   	  $.extend(true, {}, obj_expr));
   compiled_stmt = window.esprima.delegate.createExpressionStatement(compiled_stmt);  
   stmts = [ compiled_stmt ];    
    
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createIdentifier(new_var_name), 
      type_set: this.conds.makeCondSet(object_type, 'true'), 
      level_set: this.conds.makeCondSet(object_type.level, 'true')
   }; 
}; 

sec_types.typeCheckCallExpr = function (call_expr, type_env) {
   switch (call_expr.callee.type) {
      case 'MemberExpression': return this.typeCheckMethodCallExpr(call_expr); 
      default: return this.typeCheckFunCallExpr(call_expr, type_env); 
   }
}; 

sec_types.typeCheckFunCallExpr = function (fun_call_expr, type_env) {
   var arg_types, err, fun_type, i, len, level_set, new_vars, processed_args, ret_args, ret_callee, ret_type, stmts;
  
   ret_callee = this.typeCheck(fun_call_expr.callee, type_env);
   ret_args = []; 
   
   new_vars = ret_callee.new_vars; 
   stmts = ret_callee.stmts; 
   level_set = ret_callee.level_set; 
   for (i = 0, len = fun_call_expr.arguments.length; i < len; i++) {
      ret_args.push(this.typeCheck(fun_call_expr.arguments[i], type_env));
   }
      
   fun_type = this.conds.unwrapType(ret_callee.type_set);
   arg_types = [];
   processed_args = [];  
   for (i = 0, len = ret_args.length; i < len; i++) {
      arg_types.push(this.conds.unwrapType(ret_args[i].type_set)); 
      new_vars = new_vars.concat(ret_args[i].new_vars); 
      stmts = stmts.concat(ret_args[i].stmts); 
      level_set = this.conds.genFun(level_set, ret_args[i].level_set, lat.glb);
      processed_args.push(ret_args[i].expr); 
   }
   
   if (fun_type.parameter_types.length != arg_types.length) {
      //alert('Typing Error: Illegal Function Call'); 
      err = new Error('Typing Error: Illegal Function Call');
      err.typing_error = true; 
      throw err; 
   }
   
   for (i = 0, len = arg_types.length; i < len; i++) {
      if(!this.isSubType(arg_types[i], fun_type.parameter_types[i])) {
          //alert('Typing Error: Illegal Function Call'); 
          err = new Error('Typing Error: Illegal Function Call');
          err.typing_error = true;
          throw err; 
      }
   }
   
   if (!lat.leq(fun_type.level, fun_type.context_level)) {
      //alert('Typing Error: Illegal Function Call'); 
      err = new Error('Typing Error: Illegal Function Call');
      err.typing_error = true;
      throw err; 
   }
   
   ret_type = fun_type.ret_type; 
   ret_type.level = lat.lub(ret_type.level, fun_type.context_level); 
   level_set = this.conds.genFun(level_set, this.conds.makeCondSet(fun_type.context_level, 'true'), lat.glb);
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createCallExpression(ret_callee.expr, processed_args), 
      type_set: this.conds.makeCondSet(ret_type, 'true'), 
      level_set: level_set  
   };
}; 

sec_types.typeCheckMethodCallExpr = function (method_call_expr, type_env) {
   var arg_types, err, method_type, i, len, level_set, new_vars, processed_args, ret_args, ret_callee, ret_type, stmts;
  
   property_annotation = this.property_annotations[this.annotation_index];
   this.annotation_index++;  
   
   ret_object = this.typeCheck(method_call_expr.callee.object, type_env);
   ret_property = this.typeCheck(method_call_expr.callee.property, type_env);
   
   ret_obj_type_set = this.conds.floor(ret_obj.type_set, 'OBJ'); 
   look_up_set = this.conds.objSetLookup(ret_obj_type_set, ret_prop.expr, property_annotation);
   look_up_type_set = this.conds.projection(look_up_set, 'type'); 
   method_type = this.conds.unwrapType(look_up_type_set);
  
   ret_args = []; 
   new_vars = ret_object.new_vars.concat(ret_property.new_vars); 
   stmts = ret_obj.stmts.concat(ret_property.stmts); 
   level_set = this.conds.genFun(ret_object.level_set, ret_property.level_set, lat.glb); 
   for (i = 0, len = method_call_expr.arguments.length; i < len; i++) {
      ret_args.push(this.typeCheck(method_call_expr.arguments[i], type_env));
   }
      
   arg_types = [];
   processed_args = [];  
   for (i = 0, len = ret_args.length; i < len; i++) {
      arg_types.push(this.conds.unwrapType(ret_args[i].type_set)); 
      new_vars = new_vars.concat(ret_args[i].new_vars); 
      stmts = stmts.concat(ret_args[i].stmts); 
      level_set = this.conds.genFun(level_set, ret_args[i].level_set, lat.glb);
      processed_args.push(ret_args[i].expr); 
   }
   
   if (method_type.parameter_types.length != arg_types.length) {
      //alert('Typing Error: Illegal Function Call'); 
      err = new Error('Typing Error: Illegal Method Call');
      err.typing_error = true; 
      throw err; 
   }
   
   for (i = 0, len = arg_types.length; i < len; i++) {
      if(!this.isSubType(arg_types[i], method_type.parameter_types[i])) {
          //alert('Typing Error: Illegal Function Call');
          err = new Error('Typing Error: Illegal Method Call');
          err.typing_error = true;  
          throw err; 
      }
   }
   
   if (!lat.leq(method_type.level, method_type.context_level)) {
      //alert('Typing Error: Illegal Function Call');
      err = new Error('Typing Error: Illegal Method Call');
      err.typing_error = true;
      throw err;
   }
   
   ret_type = method_type.ret_type; 
   ret_type.level = lat.lub(ret_type.level, method_type.context_level); 
   level_set = this.conds.genFun(level_set, this.conds.makeCondSet(method_type.context_level, 'true'), lat.glb);
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createCallExpression(ret_callee.expr, processed_args), 
      type_set: this.conds.makeCondSet(ret_type, 'true'), 
      level_set: level_set  
   };
}; 


sec_types.buildIfWrapper = function (stmts, cond) {
   var cond_st, if_st, str; 
   
   if (cond === 'true') {
      return window.esprima.delegate.createBlockStatement(stmts); 
   }
   
   str = 'if(true) {} else { throw new Error(\'Illegal Runtime Operation\')}'; 
   if_st = utils.parseStmt(str); 
   cond_st = this.buildCondST(cond); 
   if_st.test = cond_st; 
   if_st.consequent.body = stmts; 
   return if_st; 
};

sec_types.generateNewVarName = (function() {
    var index = 0; 
    return function () {
       index++; 
       return '$x_'+index; 
    };
})(); 

