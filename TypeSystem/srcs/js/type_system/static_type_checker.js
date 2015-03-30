if (!sec_types) {
   throw new Error('sec_types object is supposed to be defined when running type_checker.js'); 
}

sec_types.staticTC = function (st, type_env, pc_level) {	
   if (!pc_level) {
      pc_level = lat.bot; 
   }
   if(!st) return st; 
	switch(st.type)	{
		case 'Program': 
		   return this.staticTCProgram(st, type_env, pc_level); 
		case 'ExpressionStatement': 
		   return this.staticTCExprStmt(st, type_env, pc_level); 
		case 'Literal': 
		   return this.staticTCLiteral(st, type_env, pc_level); 
		case 'Identifier': 
		   return this.staticTCIdentifier(st, type_env, pc_level);   
		case 'AssignmentExpression': 
		   return this.staticTCAssignmentExpr(st, type_env, pc_level); 
		case 'BinaryExpression': 
		   if (st.operator === 'in')
		      return this.staticTCInExpr(st, type_env, pc_level);
		   else return this.staticTCBinOpExpr(st, type_env, pc_level); 
		case 'MemberExpression': 
		   return this.staticTCPropertyLookUp(st, type_env, pc_level);
		case 'UnaryExpression':
		   if (st.operator === 'delete') 
		      return this.staticTCDeleteExpr(st, type_env, pc_level); 
		   else return this.staticTCUnOpExpr(st, type_env, pc_level);
		case 'IfStatement':
	       return this.staticTCIfStmt(st, type_env, pc_level);  
	    case 'BlockStatement':
	       return this.staticTCBlockStmt(st, type_env, pc_level);
	    case 'ObjectExpression': 
		   return this.staticTCObjectExpr(st, type_env, pc_level); 
		case 'LogicalExpression': 
		   return this.staticTCBinOpExpr(st, type_env, pc_level);
	    case 'WhileStatement': 
	       return this.staticTCWhileStmt(st, type_env, pc_level);
	    case 'CallExpression':
		   return this.staticTCCallExpr(st, type_env, pc_level);
		case 'FunctionExpression': 
	      return this.staticTCFunctionLiteralExpr(st, type_env, pc_level); 
	    case 'ReturnStatement': 
	      return this.staticTCReturnStmt(st, type_env, pc_level);  
	    case 'ThisExpression': 
		   return this.staticTCThisExpr(st, type_env, pc_level); 
        case 'VariableDeclaration': 
	      return this.staticTCVarDeclaration(st, type_env, pc_level);  
	    case 'ConditionalExpression': 
	      return this.staticTCConditionalExpr(st, type_env, pc_level); 
	    case 'SequenceExpression': 
	      return this.staticTCSequenceExpr(st, type_env, pc_level); 
		default:  
		   if (!st.type) {
		   	throw new Error('Syntax Error - Illegal Program');
		   } else {
		   	throw new Error('Construct ' + st.type + ' is not supported yet');
		   }   
	}
};

sec_types.staticTCProgram = function (st, type_env, pc_level) {
   var type; 
   
   if (st.type !== esprima.Syntax.Program) {
      throw new Error('Trying to type program statement with something that is not a program statement');
   }
   
   
   if (!pc_level) pc_level = lat.bot; 
    	
   for (var stmts = st.body, i = 0, len = stmts.length; i < len; i++) {
      type = this.staticTC(stmts[i], type_env, pc_level);
   }
   
   return type;   
}; 

sec_types.staticTCBlockStmt = function (block_stmt, type_env, pc_level) {
   var type; 
     
   for (var stmts = block_stmt.body, i = 0, len = stmts.length; i < len; i++) {
      type = this.staticTC(stmts[i], type_env, pc_level);
   }
   
   return type;
}; 

sec_types.staticTCExprStmt = function (expr_stmt, type_env, pc_level) { 
   var type; 
   
   type = this.staticTC(expr_stmt.expression, type_env, pc_level);
  
   return type;
}; 

sec_types.staticTCLiteral = function (st, type_env, pc_level) { 
   var type; 
   type = this.buildPrimType(lat.bot);
   return type;
};

sec_types.staticTCIdentifier = function (st, type_env, pc_level) { 
   var type;     
   type = $.extend(true, {}, type_env[st.name]);
   return type; 
};

sec_types.staticTCAssignmentExpr = function (assign_expr, type_env, pc_level) {
   if (assign_expr.left.type == 'MemberExpression') {
      return this.staticTCPropertyAssignmentExpr(assign_expr, type_env, pc_level);  
   } else {
   	  return this.staticTCVarAssignmentExpr(assign_expr, type_env, pc_level); 
   }
};

sec_types.staticTCVarAssignmentExpr = function (assign_expr, type_env, pc_level) {
   var var_name, type_right_side, copy_type_right_side; 
   
   var_name = assign_expr.left.name; 
   type_right_side = this.typeCheck(assign_expr.right, type_env, pc_level);
   copy_type_right_side = $.extend(true, {}, type_right_side);
   copy_type_right_side.level = lat.lub(copy_type_right_side.level, pc_level);
   
   if (!type_env.hasOwnProperty(var_name)) {
      // We have to extend the typing environment...
      type_env[var_name] = type_right_side;     	  
   } else {
   	  if (!this.isSubType(type_env[var_name], copy_type_right_side)) {
   	     err = new Error('Typing Error: Illegal Assignment');
         err.typing_error = true; 
         throw err;	
   	  }
   }
   
   return type_right_side; 
};

sec_types.staticTCBinOpExpr = function (binop_expr, type_env, pc_level) {
   var type, type_left_side, type_right_side; 
   
   type_left_side = this.staticTC(binop_expr.left, type_env, pc_level);
   type_right_side = this.staticTC(binop_expr.right, type_env, pc_level);
   type = this.lubType(type_left_side, type_right_side); 
   
   return type; 
};  

sec_types.staticTCUnOpExpr = function (unop_expr, type_env, pc_level) {
   var type; 
   
   type = this.staticTC(unop_expr.argument, type_env, pc_level);
   
   return type;
};  
	
sec_types.staticTCPropertyLookUp = function (member_expr, type_env, pc_level) {
   var prop_expr, property_annotation; 
   var type_obj, type_prop, type;
   var lev_type_look_up;  
   
   property_annotation = member_expr.property.property_set; 
   if (!member_expr.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(member_expr.property.name);	
   } else {
   	  prop_expr = member_expr.property;
   }
   
   type_obj = this.staticTC(member_expr.object, type_env, pc_level); 
   type_prop = this.staticTC(prop_expr, type_env, pc_level); 
   
   lev_type_look_up = this.objCovariantStaticLookup(type_obj, prop_expr, property_annotation);
   type = lev_type_look_up.type; 
   type.level = lat.lub(type.level, type_obj.level, type_prop.level);
   
   return type; 
};

sec_types.staticTCPropertyAssignmentExpr = function (prop_assign_expr, type_env, pc_level) {
   var property_annotation, prop_expr; 
   var type_obj, type_prop, type_right; 
   var lev_type_look_up, type_lu, level_lu; 
   
   property_annotation = prop_assign_expr.left.property.property_set;
   if (!prop_assign_expr.left.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(prop_assign_expr.left.property.name);	
   } else {
   	  prop_expr = prop_assign_expr.left.property;
   }
    
   type_obj = this.staticTC(prop_assign_expr.left.object, type_env, pc_level); 
   type_prop = this.staticTC(prop_expr, type_env, pc_level); 
   type_right = this.staticTC(prop_assign_expr.right, type_env, pc_level); 
   
   lev_type_look_up = this.objContravariantStaticLookup(type_obj, prop_expr, property_annotation);
   type_lu = lev_type_look_up.type; 
   level_lu = lev_type_look_up.level; 
   
   if ((!this.isSubType(type_right, type_lu)) ||
      (!lat.leq(lat.lub(pc_level, type_obj.level, type_prop.level), level_lu))) {
      err = new Error('Typing Error: Illegal Property Assignment');
      err.typing_error = true; 
      throw err;	
   }
 
   return type_lu;
}; 


sec_types.staticTCInExpr = function (in_expr, type_env, pc_level) {
   var property_annotation;
   var type_obj, type_prop; 
   var lev_type_look_up, level;
   var type;  
   
   property_annotation = in_expr.property_set;
   
   type_prop = this.staticTC(in_expr.left, type_env, pc_level);
   type_obj = this.staticTC(in_expr.right, type_env, pc_level);
   
   lev_type_look_up = this.objCovariantStaticLookup(type_obj, prop_expr, property_annotation);
   level = lev_type_look_up.level; 
   type = this.buildPrimType(lat.lub(pc_level, type_prop.level, type_obj.level));
   
   return type;
};

sec_types.staticTCDeleteExpr = function (delete_expr, type_env, pc_level) {
   var type_obj, type_prop; 
   var property_annotation, prop_expr; 
   var lev_type_look_up, level;
   var type;  
   
   property_annotation = delete_expr.argument.property.property_set;
   
   if (!delete_expr.argument.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(delete_expr.argument.property.name);	
   } else {
   	  prop_expr = delete_expr.argument.property;
   }
   
   type_obj = this.staticTC(delete_expr.argument.object, type_env, pc_level);
   type_prop = this.staticTC(prop_expr, type_env, pc_level);
   
   lev_type_look_up = this.objContravariantStaticLookup(type_obj, prop_expr, property_annotation);
   level = lev_type_look_up.level;  
   type = this.buildPrimType(lat.bot);
   
   if (!lat.leq(lat.lub(pc_level, type_obj.level, type_prop.level), level)) {
      err = new Error('Typing Error: Illegal Property Deletion');
      err.typing_error = true; 
      throw err;	
   }
   
   return type;
   
};

sec_types.staticTCIfStmt = function (if_stmt, type_env, pc_level) {
   var type_test, type_consequent, type_alternate, type; 
   
   type_test = this.staticTC(if_stmt.test, type_env, pc_level);
   type_consequent = this.staticTC(if_stmt.consequent, type_env, lat.lub(pc_level, type_test.level));
   type_alternate = this.staticTC(if_stmt.alternate, type_env, lat.lub(pc_level, type_test.level));
     
   type = this.buildPrimType(pc_level);   
   return type; 
}; 

sec_types.staticTCWhileStmt = function (while_stmt, type_env, pc_level) {
   var type_test, type_body; 
      
   type_test = this.staticTC(while_stmt.test, type_env, pc_level);
   type_body = this.staticTC(while_stmt.body, type_env, lat.lub(pc_level, type_test.level));
   
   return type_body;
}; 

sec_types.staticTCObjectExpr = function (obj_expr, type_env, pc_level) {
   var err; 
   
   if (obj_expr.properties.length > 0) {
      err = new Error('Typing Error: Object literals with predefined properties are not supported yet!');
      err.typing_error = true; 
      throw err;   	
   }
   
   object_type = sec_types.buildDelayedObjType(pc_level);
  
   return object_type;  
}; 

sec_types.staticTCCallExpr = function (call_expr, type_env, pc_level) {
   switch (call_expr.callee.type) {
      case 'MemberExpression': return this.staticTCMethodCallExpr(call_expr, type_env, pc_level); 
      default: return this.staticTCFunCallExpr(call_expr, type_env, pc_level); 
   }
}; 

sec_types.staticTCFunCallExpr = function (fun_call_expr, type_env, pc_level) {
   var type_callee, type_args;
   var err;  
   var ret_type;
   
   type_callee = this.staticTC(fun_call_expr.callee, type_env, pc_level);
   type_args = []; 
   
   for (var i = 0, len = fun_call_expr.arguments.length; i < len; i++) {
      type_args.push(this.staticTC(fun_call_expr.arguments[i], type_env, pc_level));
   }
   
   if (type_callee.this_type.type_name !== 'GLOBAL') {
      err = new Error('Typing Error: Type of the this must be the global type for functions called as functions!');
      err.typing_error = true; 
      throw err;
   }
       
   if (type_callee.parameter_types.length != arg_types.length) {
      //alert('Typing Error: Illegal Function Call'); 
      err = new Error('Typing Error: Function call with incorrect number of arguments');
      err.typing_error = true; 
      throw err; 
   }
   
   for (i = 0, len = type_args.length; i < len; i++) {
      if(!this.isSubType(type_args[i], type_callee.parameter_types[i])) {
          //alert('Typing Error: Illegal Function Call'); 
          err = new Error('Typing Error: Illegal Function Call - Type of the argument does not match type of the formal parameter');
          err.typing_error = true;
          throw err; 
      }
   }
   
   if (!lat.leq(type_callee.level, type_callee.context_level)) {
      //alert('Typing Error: Illegal Function Call'); 
      err = new Error('Typing Error: Illegal Function Call - Calling function with low effect in a high context');
      err.typing_error = true;
      throw err; 
   }
   
   ret_type = type_callee.ret_type; 
   ret_type.level = lat.lub(ret_type.level, fun_type.context_level); 
   
   return {
      new_vars: new_vars,
      stmts: stmts,  
      expr: window.esprima.delegate.createCallExpression(ret_callee.expr, processed_args), 
      type_set: this.conds.makeCondSet(ret_type, 'true')  
   };
}; 


/*
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

*/

