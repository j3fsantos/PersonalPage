if (!sec_types) {
   throw new Error('sec_types object is supposed to be defined when running type_checker.js'); 
}

sec_types.typeCheck = function (st, type_env, pc_level_set) {	
   if (!pc_level_set) {
      pc_level_set = this.conds.makeCondSet(lat.bot, 'true'); 
   }
   if(!st) return st; 
	switch(st.type)	{
		case 'Program': 
		   return this.typeCheckProgram(st, type_env, pc_level_set); 
		case 'ExpressionStatement': 
		   return this.typeCheckExprStmt(st, type_env, pc_level_set); 
		case 'Literal': 
		   return this.typeCheckLiteral(st, type_env, pc_level_set); 
		case 'Identifier': 
		   return this.typeCheckIdentifier(st, type_env, pc_level_set);   
		case 'AssignmentExpression': 
		   return this.typeCheckAssignmentExpr(st, type_env, pc_level_set); 
		case 'BinaryExpression': 
		   if (st.operator === 'in')
		      return this.typeCheckInExpr(st, type_env, pc_level_set);
		   else return this.typeCheckBinOpExpr(st, type_env, pc_level_set); 
		case 'MemberExpression': 
		   return this.typeCheckPropertyLookUp(st, type_env, pc_level_set);
		case 'UnaryExpression':
		   if (st.operator === 'delete') 
		      return this.typeCheckDeleteExpr(st, type_env, pc_level_set); 
		   else return this.typeCheckUnOpExpr(st, type_env, pc_level_set);
		case 'IfStatement':
	       return this.typeCheckIfStmt(st, type_env, pc_level_set);  
	    case 'BlockStatement':
	       return this.typeCheckBlockStmt(st, type_env, pc_level_set);
	    case 'ObjectExpression': 
		   return this.typeCheckObjectExpr(st, type_env, pc_level_set); 
		case 'LogicalExpression': 
		   return this.typeCheckBinOpExpr(st, type_env, pc_level_set);
	    case 'WhileStatement': 
	       return this.typeCheckWhileStmt(st, type_env, pc_level_set);
	    case 'CallExpression':
		   return this.typeCheckCallExpr(st, type_env, pc_level_set);
		case 'FunctionExpression': 
	      return this.typeCheckFunctionLiteralExpr(st, type_env, pc_level_set); 
	    case 'ReturnStatement': 
	      return this.typeCheckReturnStmt(st, type_env, pc_level_set);  
	    case 'ThisExpression': 
		   return this.typeCheckThisExpr(st, type_env, pc_level_set); 
        case 'VariableDeclaration': 
	      return this.typeCheckVarDeclaration(st, type_env, pc_level_set);  
	    case 'ConditionalExpression': 
	      return this.typeCheckConditionalExpr(st, type_env, pc_level_set); 
	    case 'SequenceExpression': 
	      return this.typeCheckSequenceExpr(st, type_env, pc_level_set); 
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
   	 	
   level_set = this.conds.makeCondSet(lat.bot, 'true'); 
   type_set = this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true');
  	
   for (i = 0, len = stmts.length; i < len; i++) {
      ret = this.typeCheck(stmts[i], type_env, level_set);
      
      current_compiled_stmts = ret.stmts; 
      if (!current_compiled_stmts) continue; 
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

sec_types.typeCheckBlockStmt = function (block_stmt, type_env, pc_level_set) {
   var i, len, new_vars, ret, stmts, type_set; 
    
   new_vars = []; 
   stmts = [];  
   type_set = this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true');
   
   for (i = 0, len = block_stmt.body.length; i < len; i++) {
      ret = this.typeCheck(block_stmt.body[i], type_env, pc_level_set); 
      stmts = stmts.concat(ret.stmts);
      new_vars = new_vars.concat(ret.new_vars);
      type_set = ret.type_set; 
   }
   
   return {
      new_vars: new_vars,
      stmts: stmts,
      expr: window.esprima.delegate.createIdentifier('undefined'), 
      type_set: this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true')
   };
}; 

sec_types.typeCheckExprStmt = function (expr_stmt, type_env, pc_level_set) { 
   var ret, stmts;
   
   ret = this.typeCheck(expr_stmt.expression, type_env, pc_level_set);
   stmts = ret.stmts; 
   stmts.push(window.esprima.delegate.createExpressionStatement(ret.expr));
   
   return {
      new_vars: ret.new_vars,
      expr: $.extend(true, {}, ret.expr),
      stmts: stmts, 
      type_set: ret.type_set
   };
}; 

sec_types.typeCheckLiteral = function (st, type_env, pc_level_set) { 
   var type_set; 
   
   type_set = this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true'); 
   type_set = this.conds.levExp(type_set, pc_level_set); 
   
   return {
      new_vars: [],
      stmts: [],
      expr: $.extend(true, {}, st),
      type_set: type_set
   };
};

sec_types.typeCheckIdentifier = function (st, type_env, pc_level_set) { 
   var compiled_assignment_stmt, err, new_var_name, type_set, var_type;
    
   if (!type_env.hasOwnProperty(st.name)) {
   	 err = new Error('Typing Error: Incomplete Typing Environment');
   	 err.typing_error = true;
     throw err; 
   }
   
   new_var_name = this.generateNewVarName(); 
   
   compiled_assignment_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(new_var_name), 
   	  window.esprima.delegate.createIdentifier(st.name));
   compiled_assignment_stmt = window.esprima.delegate.createExpressionStatement(compiled_assignment_stmt);
   
   var_type = $.extend(true, {}, type_env[st.name]);
   type_set = this.conds.makeCondSet(var_type, 'true'); 
   type_set = this.conds.levExp(type_set, pc_level_set);
   
   return {
      new_vars: [ new_var_name ],
      stmts: [ compiled_assignment_stmt ],
      expr: window.esprima.delegate.createIdentifier(new_var_name),
      type_set: type_set
   };
};

sec_types.typeCheckAssignmentExpr = function (assign_expr, type_env, pc_level_set) {
   if (assign_expr.left.type == 'MemberExpression') {
      return this.typeCheckPropertyAssignmentExpr(assign_expr, type_env, pc_level_set);  
   } else {
   	  return this.typeCheckVarAssignmentExpr(assign_expr, type_env, pc_level_set); 
   }
};

sec_types.typeCheckVarAssignmentExpr = function (assign_expr, type_env, pc_level_set) {
   var compiled_assignment_stmt, compiled_right_side, cond, err, level_set, 
      new_type_var, ret_right_side, stmts, var_name, var_type_set;

   var_name = assign_expr.left.name; 
   ret_right_side = this.typeCheck(assign_expr.right, type_env, pc_level_set);
   compiled_assignment_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(var_name), 
   	  $.extend(true, {}, ret_right_side.expr));
   compiled_assignment_stmt = window.esprima.delegate.createExpressionStatement(compiled_assignment_stmt);
  
   if (!type_env.hasOwnProperty(var_name)) {
      // We have to extend the typing environment... 
      new_type_var = this.conds.unwrapType(ret_right_side.type_set);
      type_env[var_name] = new_type_var;     	  
   } else {
      var_type_set = [{element: type_env[var_name], cond: 'true'}];  
      cond = this.conds.when(ret_right_side.type_set, var_type_set, this.isSubType);
      if (!cond) {
         // alert('Typing Error: Illegal Assignment'); 
         err = new Error('Typing Error: Illegal Assignment');
         err.typing_error = true; 
         throw err; 
      }	
      compiled_assignment_stmt = this.buildIfWrapper([compiled_assignment_stmt], cond);	
   }
        
   stmts = ret_right_side.stmts; 
   stmts.push(compiled_assignment_stmt); 
   
   return {
      new_vars: ret_right_side.new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createIdentifier(var_name), 
      type_set: ret_right_side.type_set
   };  
};

sec_types.typeCheckBinOpExpr = function (binop_expr, type_env, pc_level_set) {
   var binop, compiled_stmt, level_set, new_var_name, new_vars, ret_left_side, ret_right_side, stmts, type_set; 
   
   ret_left_side = this.typeCheck(binop_expr.left, type_env, pc_level_set);
   ret_right_side = this.typeCheck(binop_expr.right, type_env, pc_level_set);
   
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
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createIdentifier(new_var_name), 
      type_set: type_set
   }; 
};  

sec_types.typeCheckUnOpExpr = function (unop_expr, type_env, pc_level_set) {
   var compiled_stmt, level_set, new_var_name, new_vars, ret_argument, stmts, type_set; 
   
   ret_argument = this.typeCheck(unop_expr.argument, type_env, pc_level_set);
   
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
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createIdentifier(new_var_name), 
      type_set: type_set
   }; 
};  
	
sec_types.typeCheckPropertyLookUp = function (member_expr, type_env, pc_level_set) {
   var compiled_stmt, level_set, lev_exp_set, lev_set_obj, lev_set_prop, look_up_set, look_up_type_set, new_vars, 
      new_var_name, property_annotation, prop_expr, ret_obj, ret_obj_type_set, ret_prop, ret_prop_type_set, stmts; 
   
   property_annotation = member_expr.property.property_set; 
   
   if (!member_expr.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(member_expr.property.name);	
   } else {
   	  prop_expr = member_expr.property;
   }
   
   ret_obj = this.typeCheck(member_expr.object, type_env, pc_level_set); 
   ret_prop = this.typeCheck(prop_expr, type_env, pc_level_set); 
   
   ret_obj_type_set = this.conds.floor(ret_obj.type_set, 'OBJ'); 
   ret_prop_type_set = this.conds.floor(ret_prop.type_set, 'PRIM'); 
   
   look_up_set = this.conds.objSetLookup(ret_obj_type_set, ret_prop.expr, property_annotation);
   look_up_type_set = this.conds.projection(look_up_set, 'type'); 
   
   lev_set_obj = this.conds.levLog(ret_obj_type_set); 
   lev_set_prop = this.conds.levLog(ret_prop_type_set); 
   lev_exp_set = this.conds.genFun(lev_set_obj, lev_set_prop, lat.lub);
   look_up_type_set = this.conds.levExp(look_up_type_set, lev_exp_set); 
   
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
      type_set: look_up_type_set 
   };  
};

sec_types.typeCheckPropertyAssignmentExpr = function (prop_assign_expr, type_env, pc_level_set) {
   var compiled_assignment_stmt, cond, cond_type, cond_level, err, 
      level_set, lev_set_obj, lev_set_prop, lev_set_obj_prop,  
      look_up_set, look_up_level_set, look_up_type_set, new_vars, 
      property_annotation, prop_expr, ret_obj, ret_obj_type_set, ret_expr, ret_prop, ret_right, stmts; 
   
   property_annotation = prop_assign_expr.left.property.property_set;
   
   if (!prop_assign_expr.left.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(prop_assign_expr.left.property.name);	
   } else {
   	  prop_expr = prop_assign_expr.left.property;
   }
    
   ret_obj = this.typeCheck(prop_assign_expr.left.object, type_env, pc_level_set); 
   ret_prop = this.typeCheck(prop_expr, type_env, pc_level_set); 
   ret_right = this.typeCheck(prop_assign_expr.right, type_env, pc_level_set); 
   
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
      err = new Error('Typing Error: Illegal Property Assignment');
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
   
   ret_expr = window.esprima.delegate.createMemberExpression('[', ret_obj.expr, ret_prop.expr);
 
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: ret_expr, 
      type_set: ret_right.type_set 
   };
}; 


sec_types.typeCheckInExpr = function (in_expr, type_env, pc_level_set) {
   var compiled_stmt, level_set, lev_set_obj, lev_set_prop, lev_set_obj_prop, look_up_set, 
      look_up_level_set, new_vars, new_var_name, property_annotation, 
      type_set, stmts; 
      
   property_annotation = in_expr.property_set;
   
   ret_prop = this.typeCheck(in_expr.left, type_env, pc_level_set);
   ret_obj = this.typeCheck(in_expr.right, type_env, pc_level_set);
   
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
   };
};

sec_types.typeCheckDeleteExpr = function (delete_expr, type_env, pc_level_set) {
   var compiled_delete_stmt, cond, err, level_set, lev_set_obj, lev_set_obj_prop, lev_set_prop, look_up_set, 
          look_up_level_set, new_vars, property_annotation, prop_expr, ret_obj, ret_obj_type_set, ret_prop, stmts, type_set; 
   
   property_annotation = delete_expr.argument.property.property_set;
   
   if (!delete_expr.argument.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(delete_expr.argument.property.name);	
   } else {
   	  prop_expr = delete_expr.argument.property;
   }
   
   ret_obj = this.typeCheck(delete_expr.argument.object, type_env, pc_level_set);
   ret_prop = this.typeCheck(prop_expr, type_env, pc_level_set);
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
      err =  new Error('Typing Error: Illegal Property Deletion'); 
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
   
   type_set = this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true');
   type_set = this.conds.levExp(type_set, pc_level_set);
   
   return {
      new_vars: new_vars,
      expr: window.esprima.delegate.createIdentifier('undefined'),
      stmts: stmts, 
      type_set: type_set
   };
   
};

sec_types.typeCheckIfStmt = function (if_stmt, type_env, pc_level_set) {
   var assignment, compiled_alternate, compiled_consequent, compiled_if_stmt, cond, cond_false, 
      cond_true, err, level_set, level_set_alternate, level_set_consequent, level_set_consequent_alternate, 
      lev_set_test, new_var_name, new_vars, ret_alternate, ret_consequent, ret_test,   
      type_set, type_set_alternate, type_set_consequent;  
   
   ret_test = this.typeCheck(if_stmt.test, type_env, pc_level_set);
   lev_set_test = this.conds.levLog(ret_test.type_set);
   
   ret_consequent = this.typeCheck(if_stmt.consequent, type_env, lev_set_test);
   ret_alternate = this.typeCheck(if_stmt.alternate, type_env, lev_set_test);
   
   new_var_name = this.generateNewVarName(); 
   new_vars = ret_test.new_vars.concat(ret_consequent.new_vars);
   new_vars = ret_alternate ? new_vars.concat(ret_alternate.new_vars) : new_vars;
   new_vars.push(new_var_name); 
      
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
   stmts = ret_test.stmts;  
   stmts.push(compiled_if_stmt); 
   
   cond_false = this.conds.buildElementaryCond(ret_test.expr.name, [false, undefined, 0, null]);
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
      
   return {
      new_vars: new_vars,
      expr: window.esprima.delegate.createIdentifier('undefined'),
      stmts: stmts, 
      type_set: type_set
   };
}; 

sec_types.typeCheckWhileStmt = function (while_stmt, type_env, pc_level_set) {
   var compiled_body, compiled_while_stmt, cond, err, level_set, level_set_body, lev_set_test, 
      new_vars, ret_body, ret_test, stmts, type_set; 
      
   ret_test = this.typeCheck(while_stmt.test, type_env, pc_level_set);
   lev_set_test = this.conds.levLog(ret_test.type_set);   
   ret_body = this.typeCheck(while_stmt.body, type_env, lev_set_test);
  
   compiled_body = window.esprima.delegate.createBlockStatement(ret_body.stmts); 
   compiled_while_stmt = window.esprima.delegate.createWhileStatement(ret_test.expr, compiled_body);
   stmts = ret_test.stmts;  
   stmts.push(compiled_while_stmt); 
   
   new_vars = ret_test.new_vars.concat(ret_body.new_vars);
    
   type_set = this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true');
   type_set = this.conds.levExp(type_set, pc_level_set);
   
   return {
      new_vars: new_vars,
      expr: window.esprima.delegate.createIdentifier('undefined'),
      stmts: stmts, 
      type_set: type_set
   };
}; 

sec_types.typeCheckObjectExpr = function (obj_expr, type_env, pc_level_set) {
   var compiled_stmt, err, new_vars, new_var_name, object_type, pc_level, stmts; 
   
   if (obj_expr.properties.length > 0) {
      err = new Error('Typing Error: Object literals with predefined properties are not supported yet!');
      err.typing_error = true; 
      throw err;   	
   }
   
   new_var_name = this.generateNewVarName(); 
   new_vars = [ new_var_name ]; 
    
   compiled_stmt = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(new_var_name),
   	  window.esprima.delegate.createObjectExpression([]));
   compiled_stmt = window.esprima.delegate.createExpressionStatement(compiled_stmt);  
   stmts = [ compiled_stmt ];    
    
   pc_level = sec_types.conds.unwrapLevel(pc_level_set);
   object_type = sec_types.buildDelayedObjType(pc_level);
  
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createIdentifier(new_var_name), 
      type_set: this.conds.makeCondSet(object_type, 'true')
   }; 
}; 

sec_types.typeCheckCallExpr = function (call_expr, type_env, pc_level_set) {
   switch (call_expr.callee.type) {
      case 'MemberExpression': return this.typeCheckMethodCallExpr(call_expr, type_env, pc_level_set); 
      default: return this.typeCheckFunCallExpr(call_expr, type_env, pc_level_set); 
   }
}; 

sec_types.typeCheckFunCallExpr = function (fun_call_expr, type_env, pc_level_set) {
   var arg_types, err, fun_type, i, len, level_set, new_vars, processed_args, ret_args, ret_callee, ret_type, stmts;
  
   ret_callee = this.typeCheck(fun_call_expr.callee, type_env, pc_level_set);
   ret_args = []; 
   
   new_vars = ret_callee.new_vars; 
   stmts = ret_callee.stmts;  
   for (i = 0, len = fun_call_expr.arguments.length; i < len; i++) {
      ret_args.push(this.typeCheck(fun_call_expr.arguments[i], type_env, pc_level_set));
   }
   
   fun_type = this.conds.unwrapType(ret_callee.type_set);
   if (fun_type.this_type.type_name !== 'GLOBAL') {
      err = new Error('Typing Error: Type of the this must be the global type for functions called as functions!');
      err.typing_error = true; 
      throw err;
   }
      
   arg_types = [];
   processed_args = [];  
   for (i = 0, len = ret_args.length; i < len; i++) {
      arg_types.push(this.conds.unwrapType(ret_args[i].type_set)); 
      new_vars = new_vars.concat(ret_args[i].new_vars); 
      stmts = stmts.concat(ret_args[i].stmts); 
      processed_args.push(ret_args[i].expr); 
   }
   
   if (fun_type.parameter_types.length != arg_types.length) {
      //alert('Typing Error: Illegal Function Call'); 
      err = new Error('Typing Error: Function call with incorrect number of arguments');
      err.typing_error = true; 
      throw err; 
   }
   
   for (i = 0, len = arg_types.length; i < len; i++) {
      if(!this.isSubType(arg_types[i], fun_type.parameter_types[i])) {
          //alert('Typing Error: Illegal Function Call'); 
          err = new Error('Typing Error: Illegal Function Call - Type of the argument does not match type of the formal parameter');
          err.typing_error = true;
          throw err; 
      }
   }
   
   if (!lat.leq(fun_type.level, fun_type.context_level)) {
      //alert('Typing Error: Illegal Function Call'); 
      err = new Error('Typing Error: Illegal Function Call - Calling function with low effect in a high context');
      err.typing_error = true;
      throw err; 
   }
   
   ret_type = fun_type.ret_type; 
   ret_type.level = lat.lub(ret_type.level, fun_type.context_level); 
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createCallExpression(ret_callee.expr, processed_args), 
      type_set: this.conds.makeCondSet(ret_type, 'true')  
   };
}; 

sec_types.typeCheckMethodCallExpr = function (method_call_expr, type_env, pc_level_set) {
   var arg_types, err, method_type, i, len, level_set, look_up_level, method_type, method_level, 
      new_vars, processed_args, property_annotation, prop_expr, ret_look_up, ret_args, compiled_expr, ret_type, stmts, 
      type_object, type_prop;
  
   property_annotation = method_call_expr.callee.property.property_set; 
   
   if (!method_call_expr.callee.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(method_call_expr.callee.property.name);	
   } else {
   	  prop_expr = method_call_expr.callee.property;
   }
   
   ret_object = this.typeCheck(method_call_expr.callee.object, type_env, pc_level_set);
   ret_property = this.typeCheck(prop_expr, type_env, pc_level_set);
   
   type_object = this.conds.unwrapType(ret_object.type_set);
   type_property = this.conds.unwrapType(ret_property.type_set);
   ret_look_up = this.objCovariantStaticLookup(type_object, prop_expr, property_annotation);
   method_type = ret_look_up.type; 
   method_level = ret_look_up.level; 
   
   ret_args = []; 
   new_vars = ret_object.new_vars.concat(ret_property.new_vars); 
   stmts = ret_object.stmts.concat(ret_property.stmts); 
   for (i = 0, len = method_call_expr.arguments.length; i < len; i++) {
      ret_args.push(this.typeCheck(method_call_expr.arguments[i], type_env, pc_level_set));
   }
      
   arg_types = [];
   processed_args = [];  
   for (i = 0, len = ret_args.length; i < len; i++) {
      arg_types.push(this.conds.unwrapType(ret_args[i].type_set)); 
      new_vars = new_vars.concat(ret_args[i].new_vars); 
      stmts = stmts.concat(ret_args[i].stmts); 
      processed_args.push(ret_args[i].expr); 
   }
   
   if (method_type.parameter_types.length != arg_types.length) {
      //alert('Typing Error: Illegal Function Call'); 
      err = new Error('Typing Error: Illegal Method Call - The number of arguments does not match the number of parameters');
      err.typing_error = true; 
      throw err; 
   }
   
   for (i = 0, len = arg_types.length; i < len; i++) {
      if(!this.isSubType(arg_types[i], method_type.parameter_types[i])) {
         err = new Error('Typing Error: Illegal Method Call - Argument type does not match type of the formal parameter');
         err.typing_error = true;  
         throw err; 
      }
   }
   
   if(!this.isSubType(type_object, method_type.this_type)) {
      err = new Error('Typing Error: Illegal Method Call - Type of the receiver object does not match type of the this');
      err.typing_error = true;  
      throw err; 
   }
   
   look_up_level = lat.lub(type_object.level, type_property.level, method_type.level); 
   if (!lat.leq(look_up_level, method_type.context_level)) {
      err = new Error('Typing Error: Illegal Method Call - Calling method with low effect in a high context');
      err.typing_error = true;  
      throw err; 
   }   
   
   compiled_expr = window.esprima.delegate.createMemberExpression('[', ret_object.expr, ret_property.expr); 
   compiled_expr = window.esprima.delegate.createCallExpression(compiled_expr, processed_args);
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: compiled_expr, 
      type_set: this.conds.makeCondSet(method_type.ret_type, 'true') 
   };
}; 

sec_types.typeCheckReturnStmt = function (ret_stmt, type_env, pc_level_set) {
   var compiled_ret_stmt, cond, cond_pc, cond_ret, err, ret, stmts, type_set; 
   
   if (!type_env.hasOwnProperty(sec_types.original_pc_level)) {
      err = new Error('Typing Error: Return outside a function literal');
      err.typing_error = true;  
      throw err;     
   }
   
   cond_pc = this.conds.when(this.conds.makeCondSet(type_env[sec_types.original_pc_level], 'true'), pc_level_set, lat.leq);
   if (!cond_pc) {
      //alert('Typing Error: Illegal Assignment'); 
      err =  new Error('Typing Error: Functions with low writing effects cannot return in high contexts'); 
      err.typing_error = true;  
      throw err; 
   }
   
   ret = this.typeCheck(ret_stmt.argument, type_env, pc_level_set);
   
   cond_ret = this.conds.when(ret.type_set, this.conds.makeCondSet(type_env[sec_types.ret_prop], 'true'), this.isSubType);
   if (!cond_ret) {
      //alert('Typing Error: Illegal Assignment'); 
      err =  new Error('Typing Error: Type of the returned expression does not match the declared return type.'); 
      err.typing_error = true;  
      throw err; 
   }
   
   cond = this.conds.buildBinaryCond('&&', cond_pc, cond_ret); 
   cond = this.conds.simplifyCond(cond);  
    
   stmts = ret.stmts; 
   compiled_ret_stmt = window.esprima.delegate.createReturnStatement(ret.expr);
   compiled_ret_stmt = this.buildIfWrapper([compiled_ret_stmt], cond); 
   stmts.push(compiled_ret_stmt);
   type_set = this.conds.makeCondSet(type_env[sec_types.original_pc_level], cond);
   
   return {
      new_vars: ret.new_vars, 
      expr: window.esprima.delegate.createIdentifier('undefined'),
      stmts: stmts, 
      type_set: type_set	
   };
};

sec_types.typeCheckFunctionLiteralExpr = function (fun_lit_expr, type_env, pc_level_set) {
   var pc_level, type; 
   
   pc_level = sec_types.conds.unwrapLevel(pc_level_set);
   type = sec_types.buildDelayedFunType(fun_lit_expr, type_env, pc_level);
   return {
      new_vars: [], 
      stmts: [], 
      expr: fun_lit_expr, 
      type_set: this.conds.makeCondSet(type, 'true')   	
   };   
};	   

sec_types.typeCheckThisExpr = function (this_expr, type_env, pc_level_set) {
   var this_type, type_set; 
   
   if (type_env.hasOwnProperty(sec_types.this_prop)) {
      this_type = type_env[sec_types.this_prop]; 
   } else {
   	  this_type = sec_types.globalType2ObjectType(type_env);
   }
   type_set = this.conds.makeCondSet(this_type, 'true'); 
   type_set = this.conds.levExp(type_set, pc_level_set); 
   
   return {
      new_vars: [],
      stmts: [],
      expr: $.extend(true, {}, this_expr),
      type_set: type_set
   };
};

sec_types.typeCheckVarDeclaration = function (var_decl, type_env, pc_level_set) {
   var type_set; 
   
   type_set = this.conds.makeCondSet(this.buildPrimType(lat.bot), 'true'); 
   type_set = this.conds.levExp(type_set, pc_level_set); 
   
   return {
      new_vars: [],
      stmts: [],
      expr: window.esprima.delegate.createIdentifier('undefined'),
      type_set: type_set
   };
}; 

sec_types.typeCheckConditionalExpr = function (cond_expr, type_env, pc_level_set) {
   var assignment, compiled_alternate, compiled_consequent, compiled_if_stmt, 
       cond, cond_false, cond_true, lev_set_test, 
       new_var_name, new_vars, ret_alternate, ret_consequent, ret_test, stmts, 
       type_set, type_set_alternate, type_set_consequent;
   
   ret_test = this.typeCheck(cond_expr.test, type_env, pc_level_set);
   lev_set_test = this.conds.levLog(ret_test.type_set);
   
   ret_consequent = this.typeCheck(cond_expr.consequent, type_env, lev_set_test);
   ret_alternate = this.typeCheck(cond_expr.alternate, type_env, lev_set_test);
   
   new_var_name = this.generateNewVarName(); 
   new_vars = ret_test.new_vars.concat(ret_consequent.new_vars);
   new_vars = new_vars.concat(ret_alternate.new_vars);
   new_vars.push(new_var_name); 
      
   assignment = window.esprima.delegate.createAssignmentExpression('=', 
   	  window.esprima.delegate.createIdentifier(new_var_name), 
   	  ret_consequent.expr);
   assignment = window.esprima.delegate.createExpressionStatement(assignment);  
   ret_consequent.stmts.push(assignment); 
   compiled_consequent = window.esprima.delegate.createBlockStatement(ret_consequent.stmts);
   
   assignment = window.esprima.delegate.createAssignmentExpression('=', 
      window.esprima.delegate.createIdentifier(new_var_name), 
   	  ret_alternate.expr);
   assignment = window.esprima.delegate.createExpressionStatement(assignment);  
   ret_alternate.stmts.push(assignment); 
   compiled_alternate = window.esprima.delegate.createBlockStatement(ret_alternate.stmts); 
   
   compiled_if_stmt = window.esprima.delegate.createIfStatement(ret_test.expr, compiled_consequent, compiled_alternate);
   stmts = ret_test.stmts;  
   stmts.push(compiled_if_stmt); 
   
   cond_false = this.conds.buildElementaryCond(ret_test.expr.name, [false, undefined, 0, null]);
   cond_true = this.conds.buildUnaryCond('!', $.extend(true, {}, cond_false));
   
   type_set_consequent = ret_consequent.type_set;
   sec_types.conds.condExp(type_set_consequent, cond_true);
   type_set_alternate = ret_alternate.type_set;
   sec_types.conds.condExp(type_set_alternate, cond_false); 
   type_set = type_set_consequent.concat(type_set_alternate);
      
   return {
      new_vars: new_vars,
      expr: window.esprima.delegate.createIdentifier(new_var_name),
      stmts: stmts, 
      type_set: type_set
   };
}; 

sec_types.typeCheckSequenceExpr = function (seq_expr, type_env, pc_level_set) {
   var expr, i, len, new_vars, stmts, type_set; 
    
   new_vars = []; 
   stmts = [];  
   
   for (i = 0, len = seq_expr.expressions.length; i < len; i++) {
      ret = this.typeCheck(seq_expr.expressions[i], type_env, pc_level_set); 
      stmts = stmts.concat(ret.stmts);
      new_vars = new_vars.concat(ret.new_vars);
      type_set = ret.type_set;
      expr = ret.expr;
   }
   
   return {
      new_vars: new_vars,
      stmts: stmts,
      expr: expr, 
      type_set: type_set
   };	
};

sec_types.typeDelayedFunType = function (fun_lit_expr, type_env, fun_type) {
   var compiled_stmts, new_type_env, new_vars_decl, original_vars_decl, params, pc_level_set, ret, stmts;
   
   params = fun_lit_expr.params; 
   new_type_env = sec_types.extendTypingEnvironment(type_env, fun_type, params);
   pc_level_set = this.conds.makeCondSet(fun_type.context_level, 'true');
   
   if (!new_type_env) {
   	  err = new Error('Typing Error: The number of parameters of the funtion literal does not match the number of parameter of the function type.');
      err.typing_error = true;  
      throw err;
   }
   
   ret = this.typeCheck(fun_lit_expr.body, new_type_env, pc_level_set);
   
   if (ret.stmts.length === 0) return true; 
   
   stmts = ret.stmts;
   original_vars_decl = utils.getProgDeclarations(fun_lit_expr.body);
   new_vars_decl = this.buildNewVarsDeclaration(ret.new_vars);
   if (original_vars_decl) stmts.unshift(original_vars_decl); 
   if (new_vars_decl) stmts.unshift(new_vars_decl);
   compiled_body = window.esprima.delegate.createBlockStatement(stmts); 
   fun_lit_expr.body = compiled_body; 
   
   return true; 
};

sec_types.extendTypingEnvironment = function (type_env, fun_type, params) {
   var i, len, new_type_env, prop, type, var_name; 
   
   if (fun_type.parameter_types.length !== params.length) {
      return false;	
   } 
   
   new_type_env = {}; 
   for (prop in type_env) {
      if (type_env.hasOwnProperty(prop)) {
         new_type_env[prop] = type_env[prop];	
      }
   }
   
   for (i = 0, len = params.length; i < len; i++) {
      var_name = params[i].name; 
      type = fun_type.parameter_types[i];
      new_type_env[var_name] = type;
   }
   
   if (fun_type.var_types) {
      for (prop in fun_type.var_types) {
         if (fun_type.var_types.hasOwnProperty(prop)) {
            var_name = prop; 
            type = fun_type.var_types[prop]; 
            new_type_env[var_name] = type; 	
         }	
      }	
   }
   
   new_type_env[sec_types.this_prop] = fun_type.this_type;
   new_type_env[sec_types.ret_prop] = fun_type.ret_type; 
   new_type_env[sec_types.original_pc_level] = fun_type.context_level; 
   
   return new_type_env; 
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

