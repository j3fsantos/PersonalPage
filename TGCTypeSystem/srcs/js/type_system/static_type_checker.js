if (!sec_types) {
   throw new Error('sec_types object is supposed to be defined when running type_checker.js'); 
}

sec_types.staticTC = function (st, type_env, pc_level, cur_fun_type) {	
   if (!pc_level) {
      pc_level = lat.bot; 
   }
   if(!st) return st; 
	switch(st.type)	{
		case 'Program': 
		   return this.staticTCProgram(st, type_env, pc_level, cur_fun_type); 
		case 'ExpressionStatement': 
		   return this.staticTCExprStmt(st, type_env, pc_level, cur_fun_type); 
		case 'Literal': 
		   return this.staticTCLiteral(st, type_env, pc_level, cur_fun_type); 
		case 'Identifier': 
		   return this.staticTCIdentifier(st, type_env, pc_level, cur_fun_type);   
		case 'AssignmentExpression': 
		   return this.staticTCAssignmentExpr(st, type_env, pc_level, cur_fun_type); 
		case 'BinaryExpression': 
		   if (st.operator === 'in')
		      return this.staticTCInExpr(st, type_env, pc_level, cur_fun_type);
		   else return this.staticTCBinOpExpr(st, type_env, pc_level, cur_fun_type); 
		case 'MemberExpression': 
		   return this.staticTCPropertyLookUp(st, type_env, pc_level, cur_fun_type);
		case 'UnaryExpression':
		   if (st.operator === 'delete') 
		      return this.staticTCDeleteExpr(st, type_env, pc_level, cur_fun_type); 
		   else return this.staticTCUnOpExpr(st, type_env, pc_level, cur_fun_type);
		case 'IfStatement':
	       return this.staticTCIfStmt(st, type_env, pc_level, cur_fun_type);  
	    case 'BlockStatement':
	       return this.staticTCBlockStmt(st, type_env, pc_level, cur_fun_type);
	    case 'ObjectExpression': 
		   return this.staticTCObjectExpr(st, type_env, pc_level, cur_fun_type); 
		case 'LogicalExpression': 
		   return this.staticTCBinOpExpr(st, type_env, pc_level, cur_fun_type);
	    case 'WhileStatement': 
	       return this.staticTCWhileStmt(st, type_env, pc_level, cur_fun_type);
	    case 'CallExpression':
		   return this.staticTCCallExpr(st, type_env, pc_level, cur_fun_type);
		case 'FunctionExpression': 
	      return this.staticTCFunctionLiteralExpr(st, type_env, pc_level, cur_fun_type); 
	    case 'ReturnStatement': 
	      return this.staticTCReturnStmt(st, type_env, pc_level, cur_fun_type);  
	    case 'ThisExpression': 
		   return this.staticTCThisExpr(st, type_env, pc_level, cur_fun_type); 
        case 'VariableDeclaration': 
	      return this.staticTCVarDeclaration(st, type_env, pc_level, cur_fun_type);  
		default:  
		   if (!st.type) {
		   	throw new Error('Syntax Error - Illegal Program');
		   } else {
		   	throw new Error('Construct ' + st.type + ' is not supported yet');
		   }   
	}
};


sec_types.dynamicTC = function (st, env_id, pc_id, cur_fun_type) {	
   if(!st) return st; 
	switch(st.type)	{
		case 'ExpressionStatement': 
		   return this.dynamicTCExprStmt(st, env_id, pc_id); 
		case 'Literal': 
		   return this.dynamicTCLiteral(st, env_id, pc_id); 
		case 'Identifier': 
		   return this.dynamicTCIdentifier(st, env_id, pc_id);   
		case 'AssignmentExpression': 
		   return this.dynamicTCAssignmentExpr(st, env_id, pc_id); 
		case 'BinaryExpression': 
		   if (st.operator === 'in')
		      return this.dynamicTCInExpr(st, env_id, pc_id);
		   else return this.dynamicTCBinOpExpr(st, env_id, pc_id); 
		case 'MemberExpression': 
		   return this.dynamicTCPropertyLookUp(st, env_id, pc_id);
		case 'UnaryExpression':
		   if (st.operator === 'delete') 
		      return this.dynamicTCDeleteExpr(st, env_id, pc_id); 
		   else return this.dynamicTCUnOpExpr(st, env_id, pc_id);
		case 'IfStatement':
	       return this.dynamicTCIfStmt(st, env_id, pc_id, cur_fun_type);  
	    case 'BlockStatement':
	       return this.dynamicTCBlockStmt(st, env_id, pc_id, cur_fun_type);
	    case 'ObjectExpression': 
		   return this.dynamicTCObjectExpr(st, env_id, pc_id); 
		case 'LogicalExpression': 
		   return this.dynamicTCBinOpExpr(st, env_id, pc_id);
	    case 'WhileStatement': 
	       return this.dynamicTCWhileStmt(st, env_id, pc_id, cur_fun_type);
	    case 'CallExpression':
		   return this.dynamicTCCallExpr(st, env_id, pc_id);
		case 'FunctionExpression': 
	      return this.dynamicTCFunctionLiteralExpr(st, env_id, pc_id); 
	    case 'ReturnStatement': 
	      return this.dynamicTCReturnStmt(st, env_id, pc_id, cur_fun_type);  
	    case 'ThisExpression': 
		   return this.dynamicTCThisExpr(st, env_id, pc_id); 
        case 'VariableDeclaration': 
	      return this.dynamicTCVarDeclaration(st, env_id, pc_id);  
		default:  
		   if (!st.type) {
		   	throw new Error('Syntax Error - Illegal Program');
		   } else {
		   	throw new Error('Construct ' + st.type + ' is not supported yet');
		   }   
	}
};

sec_types.staticTCProgram = function (st, type_env, pc_level, cur_fun_type) {
   var type, ret, new_stmts, new_vars; 
   var str, stmt; 
   var new_vars_decl; 
   
   if (st.type !== esprima.Syntax.Program) {
      throw new Error('Trying to type program statement with something that is not a program statement');
   }
   
   if (!pc_level) pc_level = lat.bot; 
   
   sec_types.pc_vars = []; 
   sec_types.pc_vars.push(sec_types.generateNewPCName());
   
   sec_types.env_vars = []; 
   sec_types.env_vars.push(sec_types.generateNewEnvName()); 
  
   sec_types.fun_type_vars = [];
   sec_types.fun_type_vars.push(sec_types.generateNewFunTypeName());
   
   new_stmts = [];
   new_vars = []; 
   
   // pc = lat.bot; 
   str = "{0} = lat.bot;";
   str = $.validator.format(str, sec_types.pc_vars[sec_types.pc_vars.length - 1]);
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);
   
   // env = JSON.parse([[env]])
   str = "{0} = {1};";
   str = $.validator.format(str, 
   	  sec_types.env_vars[sec_types.env_vars.length - 1], 
   	  JSON.stringify(type_env));
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);  
   
   // fun_type_var = undefined
   str = '{0} = undefined;'; 
   str = $.validator.format(str, sec_types.fun_type_vars[sec_types.fun_type_vars.length - 1]);
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);
     	
   for (var stmts = st.body, i = 0, len = stmts.length; i < len; i++) {
   	  try {
   	     ret = this.staticTC(stmts[i], type_env, pc_level, cur_fun_type);	
   	     if (ret && ret.new_stmts) {
   	     	new_stmts = new_stmts.concat(ret.new_stmts); 
   	     	new_vars = new_vars.concat(ret.new_vars);
   	     } else {
   	        new_stmts.push(stmts[i]);	
   	     }
   	  } catch (e) {
   	  	 if (e.dynamic_type) {
   	  	 	ret = this.dynamicTC(stmts[i], 
   	  	 		sec_types.env_vars[sec_types.env_vars.length - 1], 
   	  	 		sec_types.pc_vars[sec_types.pc_vars.length - 1], 
   	  	 		 sec_types.fun_type_vars[sec_types.pc_vars.length - 1]);
   	  	 	new_stmts = new_stmts.concat(ret.new_stmts);
   	  	 	new_vars = new_vars.concat(ret.new_vars);
   	  	 } else {
   	  	 	throw e; 
   	  	 }
   	  }
   }
   
   new_vars.push(sec_types.pc_vars[sec_types.pc_vars.length - 1]);
   new_vars.push(sec_types.env_vars[sec_types.env_vars.length - 1]);
   new_vars.push(sec_types.fun_type_vars[sec_types.fun_type_vars.length - 1]);
   new_vars_decl = sec_types.buildNewVarsDeclaration(new_vars); 
   if (new_vars_decl) new_stmts.unshift(new_vars_decl);
   
   return esprima.delegate.createProgram(new_stmts);
}; 

sec_types.staticTCBlockStmt = function (block_stmt, type_env, pc_level, cur_fun_type) {
   var type, ret; 
   var new_vars, new_stmts; 
   
   new_vars = []; 
   new_stmts = [];   
   for (var stmts = block_stmt.body, i = 0, len = stmts.length; i < len; i++) {
   	  try {
   	     ret = this.staticTC(stmts[i], type_env, pc_level, cur_fun_type);	
   	     if (ret && ret.new_stmts) {
   	     	new_stmts = new_stmts.concat(ret.new_stmts);
   	  	 	new_vars = new_vars.concat(ret.new_vars);
   	     } else {
   	     	new_stmts.push(stmts[i]);
   	     }
   	  } catch(e) {
   	  	 if (e.dynamic_type) {
   	  	    ret = this.dynamicTC(stmts[i], 
   	  	       sec_types.env_vars[sec_types.env_vars.length - 1], 
   	  	       sec_types.pc_vars[sec_types.pc_vars.length - 1], 
   	  	       sec_types.fun_type_vars[sec_types.pc_vars.length - 1]);
   	  	 	new_stmts = new_stmts.concat(ret.new_stmts);
   	  	 	new_vars = new_vars.concat(ret.new_vars);
   	  	 } else {
   	  	 	throw e; 
   	  	 }
   	  }  
   }
   
   return {
      new_stmts: new_stmts, 
      new_vars: new_vars
   };
}; 


sec_types.dynamicTCBlockStmt = function (block_stmt, env_id, pc_id, cur_fun_type) {
   var type, new_stmts, new_vars, ret; 
   
   new_stmts = []; 
   new_vars = []; 
   for (var stmts = block_stmt.body, i = 0, len = stmts.length; i < len; i++) {
   	  ret = this.dynamicTC(stmts[i], env_id, pc_id, cur_fun_type);
   	  new_stmts = new_stmts.concat(ret.new_stmts); 
   	  new_vars = new_vars.concat(ret.new_vars);
   }
   
   return {
   	  new_stmts: new_stmts, 
   	  new_vars: new_vars
   };
}; 


sec_types.staticTCExprStmt = function (expr_stmt, type_env, pc_level, cur_fun_type) { 
   var type; 
   
   type = this.staticTC(expr_stmt.expression, type_env, pc_level, cur_fun_type);
  
   return type;
}; 


sec_types.dynamicTCExprStmt = function (expr_stmt, env_id, pc_id) { 
   var ret; 
   
   ret = this.dynamicTC(expr_stmt.expression, env_id, pc_id);
  
   return ret;
}; 

sec_types.staticTCLiteral = function (st, type_env, pc_level) { 
   var type; 
   type = this.buildPrimType(lat.bot);
   return type;
};

sec_types.dynamicTCLiteral = function (st, env_id, pc_id) { 
   var new_expr, new_stmts, type_expr, str;
   
   // type expression
   str = 'sec_types.buildPrimType(lat.bot)';
   type_expr = utils.parseExpr(str);
   
   new_expr = $.extend(true, {}, st); 
   
   return {
      new_expr: new_expr, 
      new_stmts: [], 
      new_vars: [], 
      type_expr: type_expr
   };
};


sec_types.staticTCIdentifier = function (st, type_env, pc_level) { 
   var type;     
   type = $.extend(true, {}, type_env[st.name]);
   return type; 
};

sec_types.dynamicTCIdentifier = function (st, env_id, pc_id) { 
   var new_expr, new_stmts, type_expr, str;     
   
   // type expression
   str = '{0}.{1}';
   str = $.validator.format(str, env_id, st.name);
   type_expr = utils.parseExpr(str);
   
   new_expr = $.extend(true, {}, st);
   
   return {
      new_expr: new_expr, 
      new_stmts: [], 
      new_vars: [], 
      type_expr: type_expr
   }; 
};


sec_types.staticTCAssignmentExpr = function (assign_expr, type_env, pc_level) {
   if (assign_expr.left.type == 'MemberExpression') {
      return this.staticTCPropertyAssignmentExpr(assign_expr, type_env, pc_level);  
   } else {
   	  return this.staticTCVarAssignmentExpr(assign_expr, type_env, pc_level); 
   }
};

sec_types.dynamicTCAssignmentExpr = function (assign_expr, env_id, pc_id) {
   if (assign_expr.left.type == 'MemberExpression') {
      return this.dynamicTCPropertyAssignmentExpr(assign_expr, env_id, pc_id);  
   } else {
   	  return this.dynamicTCVarAssignmentExpr(assign_expr, env_id, pc_id); 
   }
};

sec_types.staticTCVarAssignmentExpr = function (assign_expr, type_env, pc_level) {
   var var_name, type_right_side, copy_type_right_side; 
   
   var_name = assign_expr.left.name; 
   type_right_side = this.staticTC(assign_expr.right, type_env, pc_level);
   type_right_side.level = lat.lub(type_right_side.level, pc_level);
   
   if (!type_env.hasOwnProperty(var_name)) {
      // We have to extend the typing environment...
      type_env[var_name] = type_right_side;     	  
   } else {
   	  if (!this.isSubType(type_right_side, type_env[var_name])) {
   	     err = new Error('Typing Error: Illegal Assignment');
         err.typing_error = true; 
         throw err;	
   	  }
   }
   
   return type_right_side; 
};

sec_types.dynamicTCVarAssignmentExpr = function (assign_expr, env_id, pc_id) {
   var var_name, ret_right, right_type_str; 
   var test, if_stmt, assign_stmt; 
   var new_stmts, stmt; 
   
   var_name = assign_expr.left.name; 
   ret_right = this.dynamicTC(assign_expr.right, env_id, pc_id);
   right_type_str = utils.printExprST(ret_right.type_expr);
   right_expr_str = utils.printExprST(ret_right.new_expr);
   new_stmts = ret_right.new_stmts; 
   
   // sec_types.isSubType(right_side_type, env[var_name]) && lat.leq(pc_id, env[var_name].level)
   str = 'sec_types.isSubType({0}, {1}.{2}) && lat.leq({3}, {1}.{2}.level)'; 
   str = $.validator.format(str, 
   	  right_type_str, 
   	  env_id, 
   	  var_name, 
   	  pc_id);
   test = utils.parseExpr(str);
   
   // var_name = right_side_expr
   str = '{0} = {1};';
   str = $.validator.format(str, 
      var_name, 
      right_expr_str);
   assign_stmt = utils.parseStmt(str); 
   
   // if (cond) { } else { }
   if_stmt = sec_types.buildIfWrapper([assign_stmt], test);
   new_stmts.push(if_stmt);
   
   return {
      new_expr: ret_right.new_expr, 
      new_stmts: new_stmts,  
      new_vars: ret_right.new_vars, 
      type_expr: ret_right.type_expr
   };   
};


sec_types.staticTCBinOpExpr = function (binop_expr, type_env, pc_level) {
   var type, type_left_side, type_right_side; 
   
   type_left_side = this.staticTC(binop_expr.left, type_env, pc_level);
   type_right_side = this.staticTC(binop_expr.right, type_env, pc_level);
   type = this.lubType(type_left_side, type_right_side); 
   
   return type; 
};  

sec_types.dynamicTCBinOpExpr = function (binop_expr, env_id, pc_id) {
   var ret_left, ret_right;  
   var new_stmts, new_vars; 
   var var_expr, var_type; 
   var new_expr, type_expr; 
   var stmt, str; 
   var left_new_expr_str, left_type_expr_str, right_new_expr_str, right_type_expr_str; 
   
   ret_left = this.dynamicTC(binop_expr.left, env_id, pc_id);
   ret_right = this.dynamicTC(binop_expr.right, env_id, pc_id);
   
   left_new_expr_str = utils.printExprST(ret_left.new_expr);
   left_type_expr_str = utils.printExprST(ret_left.type_expr);
   right_new_expr_str = utils.printExprST(ret_right.new_expr);
   right_type_expr_str = utils.printExprST(ret_right.type_expr);
   
   new_stmts = ret_left.new_stmts.concat(ret_right.new_stmts);
   new_vars = ret_left.new_vars.concat(ret_right.new_vars);
   
   var_expr = sec_types.generateNewVarExprName();  
   var_type = sec_types.generateNewVarTypeName();
   new_vars.push(var_expr);
   new_vars.push(var_type);
   
   str = '{0} = {1} {2} {3};';
   str = $.validator.format(str, 
      var_expr, 
      left_new_expr_str, 
      binop_expr.operator,
      right_new_expr_str);
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt); 
   
   str = '{0} = sec_types.lubType({1}, {2});'; 
   str = $.validator.format(str, 
      var_type, 
      left_type_expr_str, 
      right_type_expr_str);
   stmt = utils.parseStmt(str); 
   new_stmts.push(stmt);
   
   return {
   	  new_stmts: new_stmts, 
   	  new_vars: new_vars, 
   	  new_expr: window.esprima.delegate.createIdentifier(var_expr), 
   	  type_expr: window.esprima.delegate.createIdentifier(var_type) 
   }; 
};  



sec_types.staticTCUnOpExpr = function (unop_expr, type_env, pc_level) {
   var type; 
   
   type = this.staticTC(unop_expr.argument, type_env, pc_level);
   
   return type;
};  


sec_types.dynamicTCUnOpExpr = function (unop_expr, env_id, pc_id) {
   var ret; 
  
   ret = this.dynamicTC(unop_expr.argument, env_id, pc_id);
   
   return {
   	  new_stmts: ret.new_stmts, 
   	  new_vars: ret.new_vars, 
   	  new_expr: window.esprima.delegate.createUnaryExpression(unop_expr.operator, $.extend(true, {}, ret.new_expr)), 
   	  type_expr: ret.type_expr 
   }; 
};  
	
sec_types.staticTCPropertyLookUp = function (member_expr, type_env, pc_level) {
   var type_obj, type, prop;
   var lev_type_look_up;  
   var err; 
   
   if (member_expr.computed) {
   	  err = new Error("dynamic type"); 
   	  err.dynamic_type = true;
      throw err;
   }    	  
   
   type_obj = this.staticTC(member_expr.object, type_env, pc_level); 
   prop = member_expr.property.name;
   type = sec_types.getTypeProtoChainProp(type_obj, prop);
   
   type.level = lat.lub(type.level, type_obj.level);
   
   return type; 
};

sec_types.dynamicTCPropertyLookUp = function (member_expr, env_id, pc_id) {
   var prop_expr, ret_obj, ret_prop;
   var new_stmts, new_vars;
   var var_expr, var_type; 
   var ret_obj_expr_str, ret_obj_type_str, ret_prop_expr_str, ret_prop_type_str; 
   var str, stmt; 
   var err; 
   
   if (!member_expr.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(member_expr.property.name);	
   } else {
   	  prop_expr = member_expr.property;
   }
   
   ret_obj = this.dynamicTC(member_expr.object, env_id, pc_id); 
   ret_prop = this.dynamicTC(prop_expr, env_id, pc_id);
   
   new_stmts = ret_obj.new_stmts.concat(ret_prop.new_stmts); 
   new_vars = ret_obj.new_vars.concat(ret_prop.new_vars); 
   
   var_expr = sec_types.generateNewVarExprName();  
   var_type = sec_types.generateNewVarTypeName();
   new_vars.push(var_expr);
   new_vars.push(var_type);
   
   ret_obj_expr_str = utils.printExprST(ret_obj.new_expr);
   ret_obj_type_str = utils.printExprST(ret_obj.type_expr);
   ret_prop_expr_str = utils.printExprST(ret_prop.new_expr);
   ret_prop_type_str = utils.printExprST(ret_prop.type_expr);
   
   //  $x = $x_1[$x_2]
   str = '{0} = {1}[{2}];';
   str = $.validator.format(str, 
   	  var_expr, 
   	  ret_obj_expr_str, 
   	  ret_prop_expr_str);
   stmt = utils.parseStmt(str); 
   new_stmts.push(stmt); 
  
   // $l = sec_types.getTypeProtoChainProp(type_obj, prop);
   str = '{0} = sec_types.getTypeProtoChainProp({1}, {2});';
   str = $.validator.format(str, 
   	  var_type, 
   	  ret_obj_type_str, 
   	  ret_prop_expr_str);
   stmt = utils.parseStmt(str); 
   new_stmts.push(stmt); 
   
   // $l.level = lat.lub($l.level, $l_o.level, $l_p.level);
   str = '{0}.level = lat.lub({0}.level, {1}.level, {2}.level);';
   str = $.validator.format(str, 
   	  var_type, 
   	  ret_obj_type_str, 
   	  ret_prop_type_str);
   stmt = utils.parseStmt(str); 
   new_stmts.push(stmt); 
   
   return {
      new_expr: window.esprima.delegate.createIdentifier(var_expr), 
      new_stmts: new_stmts, 
      new_vars: new_vars, 
      type_expr: window.esprima.delegate.createIdentifier(var_type)
   }; 
};



sec_types.staticTCPropertyAssignmentExpr = function (prop_assign_expr, type_env, pc_level) { 
   var type_obj, type_right, prop; 
   var type_lu, level_lu; 
   var err;
   
   if (prop_assign_expr.left.computed) {
      err = new Error("dynamic type"); 
   	  err.dynamic_type = true;
      throw err;
   }
   
   type_obj = this.staticTC(prop_assign_expr.left.object, type_env, pc_level); 
   prop = prop_assign_expr.left.property.name; 
   type_right = this.staticTC(prop_assign_expr.right, type_env, pc_level);
   
   type_lu = this.getTypeObjProp(type_obj, prop);
   level_lu = this.getLevelObjProp(type_obj, prop);
   
   if ((!this.isSubType(type_right, type_lu)) || (!lat.leq(lat.lub(pc_level, type_obj.level), level_lu))) {
      err = new Error('Typing Error: Illegal Property Assignment');
      err.typing_error = true; 
      throw err;	
   }
 
   return type_lu;
}; 


sec_types.dynamicTCPropertyAssignmentExpr = function (prop_assign_expr, env_id, pc_id) { 
   var prop_expr, ret_obj, ret_prop, ret_right;
   var new_stmts, new_vars, stmt, str, test;   
   var var_expr, var_type; 
   var ret_obj_expr_str, ret_obj_type_str, ret_prop_expr_str, ret_prop_type_str, ret_right_expr_str, ret_right_expr_type; 
   
   if (!prop_assign_expr.left.computed) {
      prop_expr = window.esprima.delegate.createLiteral2(prop_assign_expr.left.property.name);	
   } else {
   	  prop_expr = prop_assign_expr.left.property;
   }
 
   ret_obj = this.dynamicTC(prop_assign_expr.left.object, env_id, pc_id); 
   ret_prop = this.dynamicTC(prop_expr, env_id, pc_id); 
   ret_right = this.dynamicTC(prop_assign_expr.right, env_id, pc_id);
    
   new_stmts = ret_obj.new_stmts.concat(ret_prop.new_stmts);
   new_stmts = new_stmts.concat(ret_right.new_stmts); 
   new_vars = ret_obj.new_vars.concat(ret_prop.new_vars); 
   new_vars = new_vars.concat(ret_right.new_vars);
 
   var_expr = sec_types.generateNewVarExprName();  
   var_type = sec_types.generateNewVarTypeName();
   new_vars.push(var_expr);
   new_vars.push(var_type);
   
   ret_obj_expr_str = utils.printExprST(ret_obj.new_expr);
   ret_obj_type_str = utils.printExprST(ret_obj.type_expr);
   ret_prop_expr_str = utils.printExprST(ret_prop.new_expr);
   ret_prop_type_str = utils.printExprST(ret_prop.type_expr);
   ret_right_expr_str = utils.printExprST(ret_right.new_expr);
   ret_right_type_str = utils.printExprST(ret_right.type_expr);
  
   // (!this.isSubType(type_right, this.getTypeObjProp(type_obj, prop))) || (!lat.leq(lat.lub(pc_level, type_obj.level, type_prop.level), this.getLevelObjProp(type_obj, prop)))
   str = 'sec_types.isSubType({0}, sec_types.getTypeObjProp({1}, {2})) && lat.leq(lat.lub({3}, {1}.level, {4}.level), sec_types.getLevelObjProp({1}, {2}));';
   str = $.validator.format(str, 
   	  ret_right_type_str, 
   	  ret_obj_type_str, 
   	  ret_prop_expr_str, 
   	  pc_id, 
   	  ret_prop_type_str);
   test = utils.parseExpr(str); 
    
   // $x_o[$x_p] = $x_e
   str = '{0}[{1}] = {2};';
   str = $.validator.format(str, 
      ret_obj_expr_str, 
      ret_prop_expr_str, 
      ret_right_expr_str);
   stmt = utils.parseStmt(str); 
   
   // if (cond) { } else { }
   stmt = sec_types.buildIfWrapper([stmt], test);
   new_stmts.push(stmt);
   
   return {
      new_expr: ret_right.new_expr, 
      new_stmts: new_stmts,  
      new_vars: ret_right.new_vars, 
      type_expr: ret_right.type_expr
   };   
}; 

sec_types.staticTCInExpr = function (in_expr, type_env, pc_level) {
   var type_obj, prop;
   var level, type;
   var err;  
   
   if (in_expr.left.type !== 'Literal') {
      err = new Error("dynamic type"); 
   	  err.dynamic_type = true;
      throw err;
   }
   
   prop = in_expr.left.value; 
   type_obj = this.staticTC(in_expr.right, type_env, pc_level);
   
   level = this.getLevelProtoChainProp(type_obj, prop);  
   type = this.buildPrimType(lat.lub(pc_level, type_obj.level, level));
   
   return type;
};

sec_types.dynamicTCInExpr = function (in_expr, env_id, pc_id) {
   var prop_expr, ret_obj, ret_prop; 
   var new_stmts, new_vars, var_expr, var_type, stmt, str; 
   var ret_obj_expr_str, ret_obj_type_str, ret_prop_expr_str, ret_prop_type_str;
   
   ret_obj = this.dynamicTC(in_expr.right, env_id, pc_id); 
   ret_prop = this.dynamicTC(in_expr.left, env_id, pc_id); 
  
   new_stmts = ret_prop.new_stmts.concat(ret_obj.new_stmts); 
   new_vars = ret_prop.new_vars.concat(ret_obj.new_vars); 
   
   var_expr = sec_types.generateNewVarExprName();  
   var_type = sec_types.generateNewVarTypeName();
   new_vars.push(var_expr);
   new_vars.push(var_type);
  
   ret_obj_expr_str = utils.printExprST(ret_obj.new_expr);
   ret_obj_type_str = utils.printExprST(ret_obj.type_expr);
   ret_prop_expr_str = utils.printExprST(ret_prop.new_expr);
   ret_prop_type_str = utils.printExprST(ret_prop.type_expr);
    
   //  $x = $x_p in $x_o
   str = '{0} = {1} in {2};';
   str = $.validator.format(str, 
   	  var_expr, 
   	  ret_prop_expr_str, 
   	  ret_obj_expr_str);
   stmt = utils.parseStmt(str); 
   new_stmts.push(stmt); 
  
   // $l = sec_types.buildPrimType(lat.lub(pc_level, $l_o.level, $l_p.level, sec_types.getLevelProtoChainProp($l_o, $x_p));
   str = '{0} = sec_types.buildPrimType(lat.lub({1}, {2}.level, {3}.level, sec_types.getLevelProtoChainProp({2}, {4})));';
   str = $.validator.format(str, 
   	  var_type, 
   	  pc_id, 
   	  ret_obj_type_str, 
   	  ret_prop_type_str,
   	  ret_prop_expr_str);
   stmt = utils.parseStmt(str); 
   new_stmts.push(stmt); 
   
   return {
      new_expr: window.esprima.delegate.createIdentifier(var_expr), 
      new_stmts: new_stmts, 
      new_vars: new_vars, 
      type_expr: window.esprima.delegate.createIdentifier(var_type)
   }; 
};


sec_types.staticTCDeleteExpr = function (delete_expr, type_env, pc_level) {
   var type_obj, prop; 
   var level, type;  
     
   if (delete_expr.argument.computed) {
      err = new Error("dynamic type"); 
   	  err.dynamic_type = true;
      throw err;
   }
   
   type_obj = this.staticTC(delete_expr.argument.object, type_env, pc_level);
   prop = delete_expr.argument.property.name; 
   
   level = this.getLevelObjProp(type_obj, prop);  
   type = this.buildPrimType(level);
   
   if (!lat.leq(lat.lub(pc_level, type_obj.level), level)) {
      err = new Error('Typing Error: Illegal Property Deletion');
      err.typing_error = true; 
      throw err;	
   }
   
   return type;
};


sec_types.dynamicTCDeleteExpr = function (delete_expr, env_id, pc_id) {
   var prop_expr, ret_obj, ret_prop; 
   var new_stmts, new_vars, var_expr, var_type; 
   var ret_obj_expr_str, ret_obj_type_str, ret_prop_expr_str, ret_prop_type_str;
   var test, stmt1, stmt2, stmt;
   
   if (!delete_expr.argument.computed) {
       prop_expr = window.esprima.delegate.createLiteral2(delete_expr.argument.property.name);	
   } else {
   	   prop_expr = delete_expr.argument.property;
   }
   
   ret_obj = this.dynamicTC(delete_expr.argument.object, env_id, pc_id); 
   ret_prop = this.dynamicTC(prop_expr, env_id, pc_id); 
   
   new_stmts = ret_obj.new_stmts.concat(ret_prop.new_stmts); 
   new_vars = ret_obj.new_vars.concat(ret_prop.new_vars); 
   
   var_expr = sec_types.generateNewVarExprName();  
   var_type = sec_types.generateNewVarTypeName();
   new_vars.push(var_expr);
   new_vars.push(var_type);
  
   ret_obj_expr_str = utils.printExprST(ret_obj.new_expr);
   ret_obj_type_str = utils.printExprST(ret_obj.type_expr);
   ret_prop_expr_str = utils.printExprST(ret_prop.new_expr);
   ret_prop_type_str = utils.printExprST(ret_prop.type_expr);
   
   //  $x = delete $x_o[$x_p]
   str = '{0} = delete {1}[{2}];';
   str = $.validator.format(str, 
   	  var_expr, 
   	  ret_obj_expr_str, 
   	  ret_prop_expr_str);
   stmt1 = utils.parseStmt(str); 
   
   //  $l =  sec_types.buildPrimType(this.getLevelObjProp(type_obj, prop));
   str = '{0} = sec_types.buildPrimType(sec_types.getLevelObjProp({1}, {2}));;';
   str = $.validator.format(str, 
   	  var_type, 
   	  ret_obj_type_str, 
   	  ret_prop_expr_str);
   stmt2 = utils.parseStmt(str); 
   
   // lat.leq(lat.lub(pc_level, $l_o.level, $l_p.level), sec_types.getLevelObjProp($l_o, prop))
   str = 'lat.leq(lat.lub({0}, {1}.level, {3}.level), sec_types.getLevelObjProp({1}, {2}))'; 
   str = $.validator.format(str, 
   	  pc_id, 
   	  ret_obj_type_str, 
   	  ret_prop_expr_str, 
   	  ret_prop_type_str);
   test = utils.parseExpr(str); 
   
   // if (cond) { } else { }
   stmt = sec_types.buildIfWrapper([stmt1, stmt2], test);
   new_stmts.push(stmt);
   
   return {
      new_expr: window.esprima.delegate.createIdentifier(var_expr),  
      new_stmts: new_stmts,  
      new_vars: new_vars, 
      type_expr: window.esprima.delegate.createIdentifier(var_type)
   };   
};

sec_types.staticTCIfStmt = function (if_stmt, type_env, pc_level, fun_type) {
   var type_test, ret_consequent, ret_alternate, type;
   var compiled_consequent, compiled_alternate, compiled_if;  
   var new_vars; 
   
   type_test = this.staticTC(if_stmt.test, type_env, pc_level);
   ret_consequent = this.staticTC(if_stmt.consequent, type_env, lat.lub(pc_level, type_test.level), fun_type);
   ret_alternate = this.staticTC(if_stmt.alternate, type_env, lat.lub(pc_level, type_test.level), fun_type);
   new_vars = [];
   
   if (ret_consequent.new_stmts) {
      compiled_consequent = esprima.delegate.createBlockStatement(ret_consequent.new_stmts);
      new_vars = new_vars.concat(compiled_consequent.new_vars);
   } else {
   	  compiled_consequent = $.extend(true, {}, if_stmt.consequent); 
   }
   
   if (ret_alternate && ret_alternate.new_stmts) {
      compiled_alternate = esprima.delegate.createBlockStatement(ret_alternate.new_stmts);
      new_vars = new_vars.concat(compiled_alternate.new_vars);
   } else if (ret_alternate) {
   	  compiled_alternate = $.extend(true, {}, if_stmt.alternate); 
   } else {
   	  compiled_alternate = null;
   }    
    
     
   compiled_if = esprima.delegate.createIfStatement(
         $.extend(true, {}, if_stmt.test), 
         compiled_consequent, 
         compiled_alternate); 
            
   return {
   	   new_stmts: [compiled_if],
   	   new_vars: new_vars
   }; 
}; 

sec_types.dynamicTCIfStmt = function (if_stmt, env_id, pc_id, cur_fun_type) {
   var ret_test, ret_consequent, ret_alternate; 
   var new_stmts, new_vars; 
   var str, stmt; 
   var new_pc_id; 
   var ret_test_expr_str, ret_test_type_str; 
   var compiled_if; 
   
   ret_test = this.dynamicTC(if_stmt.test, env_id, pc_id);
   new_stmts = ret_test.new_stmts; 
   new_vars = ret_test.new_vars; 
   new_pc_id = sec_types.generateNewPCName();
   new_vars.push(new_pc_id);
   
   ret_test_expr_str = utils.printExprST(ret_test.new_expr);
   ret_test_type_str = utils.printExprST(ret_test.type_expr);
   
   // $l_pc_new = lat.lub($l_e, $l_pc_old); 
   str = '{0} = lat.lub({1}.level, {2});';
   str = $.validator.format(str, 
   	  new_pc_id, 
   	  ret_test_type_str, 
   	  pc_id);
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);
   
   // if ($val_0) {} else {}
   str = 'if ({0}) {} else {}';
   str = $.validator.format(str, ret_test_expr_str); 
   compiled_if = utils.parseStmt(str);
   new_stmts.push(compiled_if);
   
   // consequent
   ret_consequent = this.dynamicTC(if_stmt.consequent, env_id, new_pc_id, cur_fun_type);
   compiled_if.consequent.body = ret_consequent.new_stmts; 
   new_vars = new_vars.concat(ret_consequent.new_vars); 
   
   // alternate
   if (if_stmt.alternate) {
      ret_alternate = this.dynamicTC(if_stmt.alternate, env_id, new_pc_id, cur_fun_type);
      compiled_if.alternate.body = ret_alternate.new_stmts; 
      new_vars = new_vars.concat(ret_alternate.new_vars); 
   }
    
   return {  
      new_stmts: new_stmts,  
      new_vars: new_vars
   };  
}; 


sec_types.staticTCWhileStmt = function (while_stmt, type_env, pc_level, fun_type) {
   var type_test, ret_body; 
   var compiled_while;
      
   type_test = this.staticTC(while_stmt.test, type_env, pc_level);
   ret_body = this.staticTC(while_stmt.body, type_env, lat.lub(pc_level, type_test.level), fun_type);
   
   if (ret_body.new_stmts) {
      
      compiled_while = esprima.delegate.createWhileStatement(
         $.extend(true, {}, while_stmt.test), 
         esprima.delegate.createBlockStatement(ret_body.new_stmts));
      
      return {
      	new_stmts: [compiled_while], 
      	new_vars: ret_body.new_vars
      };
      
   } else {
   	  return ret_body;
   }
}; 

sec_types.dynamicTCWhileStmt = function (while_stmt, env_id, pc_id, cur_fun_type) {
   var ret_test, ret_body; 
   var new_stmts, new_vars; 
   var str, stmt; 
   var new_pc_id; 
   var ret_test_expr_str, ret_test_type_str; 
   var compiled_while;  
      
   ret_test = this.dynamicTC(while_stmt.test, env_id, pc_id);
   new_stmts = ret_test.new_stmts; 
   new_vars = ret_test.new_vars; 
   new_pc_id = sec_types.generateNewPCName();
   new_vars.push(new_pc_id);
   
   ret_test_expr_str = utils.printExprST(ret_test.new_expr);
   ret_test_type_str = utils.printExprST(ret_test.type_expr);
   
   // $l_pc_new = lat.lub($l_e, $l_pc_old); 
   str = '{0} = lat.lub({1}.level, {2});';
   str = $.validator.format(str, 
   	  new_pc_id, 
   	  ret_test_type_str, 
   	  pc_id);
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);
   
   ret_body = this.dynamicTC(while_stmt.body, env_id, new_pc_id, cur_fun_type);
   compiled_while = esprima.delegate.createWhileStatement(
      $.extend(true, {}, ret_test.new_expr), 
      esprima.delegate.createBlockStatement(
      	ret_body.new_stmts.concat(ret_test.new_stmts)));
   new_vars = new_vars.concat(ret_body.new_vars);     
   new_stmts.push(compiled_while); 
   
   return {  
      new_stmts: new_stmts,  
      new_vars: new_vars
   };  
}; 


sec_types.staticTCObjectExpr = function (obj_expr, type_env, pc_level) {
   var err, object_type; 
   
   if (obj_expr.properties.length > 0) {
      err = new Error('Typing Error: Object literals with predefined properties are not supported yet!');
      err.typing_error = true; 
      throw err;   	
   }
   
   object_type = sec_types.buildDelayedObjType(pc_level);
   
   return object_type;  
}; 


sec_types.dynamicTCObjectExpr = function (obj_expr, env_id, pc_id) {
   var var_expr, var_type, new_vars, new_stmts, stmt, str; 
   
   var_expr = sec_types.generateNewVarExprName();  
   var_type = sec_types.generateNewVarTypeName();
   new_vars = [];
   new_stmts = [];
   new_vars.push(var_expr);
   new_vars.push(var_type);
   
   str = '{0} = {};';
   str = $.validator.format(str, var_expr);
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);
   
   str = '{0} = sec_types.buildDelayedObjType({1});';
   str = $.validator.format(str, var_type, pc_id);
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);
   
   return {
      new_expr: window.esprima.delegate.createIdentifier(var_expr),  
      new_stmts: new_stmts,  
      new_vars: new_vars, 
      type_expr: window.esprima.delegate.createIdentifier(var_type)
   };     
}; 

sec_types.staticTCCallExpr = function (call_expr, type_env, pc_level) {
   switch (call_expr.callee.type) {
      case 'MemberExpression': return this.staticTCMethodCallExpr(call_expr, type_env, pc_level); 
      default: return this.staticTCFunCallExpr(call_expr, type_env, pc_level); 
   }
}; 

sec_types.dynamicTCCallExpr = function (call_expr, env_id, pc_id) {
   switch (call_expr.callee.type) {
      case 'MemberExpression': return this.dynamicTCMethodCallExpr(call_expr, env_id, pc_id); 
      default: return this.dynamicTCFunCallExpr(call_expr, env_id, pc_id); 
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
       
   if (type_callee.parameter_types.length != type_args.length) {
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
   ret_type.level = lat.lub(ret_type.level, type_callee.context_level, type_callee.level); 
   
   return ret_type; 
}; 


sec_types.dynamicTCFunCallExpr = function (fun_call_expr, env_id, pc_id) {
   var ret_callee, ret_arg;
   var arg_val_exprs, arg_type_exprs;
   var new_stmts, new_vars;
   var test;  
   var str, stmt; 
   var ret_callee_expr_str, ret_calee_type_str, ret_arg_type_str;
   var compiled_call, ret_type_stmt; 
   var var_expr, var_type;
   var type_stmt1, type_stmt2, type_arg_expr, type_args_expr; 
   
   ret_callee = this.dynamicTC(fun_call_expr.callee, env_id, pc_id);
   new_stmts = ret_callee.new_stmts; 
   new_vars = ret_callee.new_vars;  
   arg_val_exprs = [];
   arg_type_exprs = []; 
   
   var_expr = sec_types.generateNewVarExprName();  
   var_type = sec_types.generateNewVarTypeName();
   new_vars.push(var_expr);
   new_vars.push(var_type);
   
   ret_callee_expr_str = utils.printExprST(ret_callee.new_expr);
   ret_calee_type_str = utils.printExprST(ret_callee.type_expr);
   
   for (var i = 0, len = fun_call_expr.arguments.length; i < len; i++) {
      ret_arg = this.dynamicTC(fun_call_expr.arguments[i], env_id, pc_id);
      new_stmts = new_stmts.concat(ret_arg.new_stmts); 
      arg_val_exprs.push(ret_arg.new_expr);
      arg_type_exprs.push(ret_arg.type_expr);
   }
   
   // ($t_f.this_type.type_name === 'GLOBAL') && $(t_f.parameter_types.length != [[number of arguments]]) && lat.leq($l_f.level, $l_f.context_level)
   str = '(({0}.this_type.type_name === \'GLOBAL\') && ({0}.parameter_types.length === {1})) && lat.leq({0}.level, {0}.context_level)';
   str = $.validator.format(str, ret_calee_type_str, fun_call_expr.arguments.length);
   test = utils.parseExpr(str);
   
   compiled_call = window.esprima.delegate.createCallExpression(
      $.extend(true, {}, ret_callee.new_expr),
      arg_val_exprs);
   compiled_call = window.esprima.delegate.createAssignmentExpression('=', 
      window.esprima.delegate.createIdentifier(var_expr), 
      compiled_call);
   compiled_call = window.esprima.delegate.createExpressionStatement(compiled_call);
   
   // type_var = $l_callee.ret_type
   str = '{0} = {1}.ret_type;';
   str = $.validator.format(str, var_type, ret_calee_type_str);
   type_stmt1 = utils.parseStmt(str);
    
   // type_var.level = lat.lub(type_var.level, $l_callee.context_level, $l_callee.level);
   str = '{0}.level = lat.lub({0}.level, {1}.context_level, {1}.level);';
   str = $.validator.format(str, var_type, ret_calee_type_str);    
   type_stmt2 = utils.parseStmt(str);
   
   for (var i = 0, len = arg_val_exprs.length; i < len; i++) {
   	   // sec_types.isSubType($l_arg_i, type_callee.parameter_types[i])
   	  ret_arg_type_str = utils.printExprST(arg_type_exprs[i]);
      str = 'sec_types.isSubType({0}, {1}.parameter_types[{2}]);';
      str = $.validator.format(str, ret_arg_type_str, ret_calee_type_str, i);  
      type_arg_expr = utils.parseExpr(str);
      
      if (i === 0) {
         type_args_expr = type_arg_expr; 
      } else {
      	 type_args_expr = window.esprima.delegate.createBinaryExpression('&&', type_args_expr, type_arg_expr); 
      }
      
   }
   
   if (i) {
      test = window.esprima.delegate.createBinaryExpression('&&', test, type_args_expr);	
   }
   
   // if (cond) { } else { }
   stmt = sec_types.buildIfWrapper([compiled_call, type_stmt1, type_stmt2], test);
   new_stmts.push(stmt);
   
   return {
      new_expr: window.esprima.delegate.createIdentifier(var_expr),  
      new_stmts: new_stmts,  
      new_vars: new_vars, 
      type_expr: window.esprima.delegate.createIdentifier(var_type)
   };   
}; 


sec_types.staticTCMethodCallExpr = function (method_call_expr, type_env, pc_level) {
   var prop, obj_type, arg_type, arg_types, method_type, level, ret_type, err; 
   
   if (method_call_expr.callee.computed) {
      err = new Error("dynamic type"); 
   	  err.dynamic_type = true;
      throw err;
   }
   
   prop = method_call_expr.callee.property.name; 
   obj_type = this.staticTC(method_call_expr.callee.object, type_env, pc_level);
   method_type = this.getTypeProtoChainProp(obj_type, prop);
   
   level = lat.lub(pc_level, obj_type.level, method_type.level);
   
   arg_types = []; 
   for (var i = 0, len = method_call_expr.arguments.length; i < len; i++) {
   	  arg_type = this.staticTC(method_call_expr.arguments[i], type_env, pc_level);
   	  // arg_type.level = lat.lub(arg_type.level, level);
      arg_types.push(arg_type);
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
   
   // obj_type.level = lat.lub(obj_type.level, level);
   if(!this.isSubType(obj_type, method_type.this_type)) {
      err = new Error('Typing Error: Illegal Method Call - Type of the receiver object does not match type of the this');
      err.typing_error = true;  
      throw err; 
   }
    
   if (!lat.leq(level, method_type.context_level)) {
      err = new Error('Typing Error: Illegal Method Call - Calling method with low effect in a high context');
      err.typing_error = true;  
      throw err; 
   }   
 
   ret_type = method_type.ret_type; 
   ret_type.level = lat.lub(ret_type.level, level);
   return ret_type; 
}; 


sec_types.dynamicTCMethodCallExpr = function (method_call_expr, env_id, pc_id) {
   var prop_expr, ret_obj, ret_prop, ret_arg, new_stmts, new_vars; 
   var ret_obj_expr_str, ret_obj_type_str, ret_prop_expr_str, ret_prop_type_str; 
   var ret_arg_type_str, str, stmt, test, type_arg_expr, type_args_expr; 
   var arg_val_exprs, arg_type_exprs;
   var var_expr, var_type; 
   var var_method_type, var_level_aux; 
   var type_stmt1, type_stmt2; 
   
   if (!method_call_expr.callee.computed) {
       prop_expr = window.esprima.delegate.createLiteral2(method_call_expr.callee.property.name);	
   } else {
   	   prop_expr = method_call_expr.callee.property;
   }
   
   ret_obj = this.dynamicTC(method_call_expr.callee.object, env_id, pc_id);
   ret_prop = this.dynamicTC(prop_expr, env_id, pc_id);
   new_stmts = ret_obj.new_stmts.concat(ret_prop.new_stmts); 
   new_vars = ret_obj.new_vars.concat(ret_prop.new_vars);  
   
   ret_obj_expr_str = utils.printExprST(ret_obj.new_expr);
   ret_obj_type_str = utils.printExprST(ret_obj.type_expr);
   ret_prop_expr_str = utils.printExprST(ret_prop.new_expr);
   ret_prop_type_str = utils.printExprST(ret_prop.type_expr);
   
   var_expr = sec_types.generateNewVarExprName();  
   var_type = sec_types.generateNewVarTypeName();
   new_vars.push(var_expr);
   new_vars.push(var_type);
   
   var_method_type = sec_types.generateNewVarTypeName();
   var_level_aux = sec_types.generateNewVarLevelName();
   
   arg_val_exprs = [];
   arg_type_exprs = []; 
   
   for (var i = 0, len = method_call_expr.arguments.length; i < len; i++) {
   	  ret_arg = this.dynamicTC(method_call_expr.arguments[i], env_id, pc_id);
      new_stmts = new_stmts.concat(ret_arg.new_stmts); 
      arg_val_exprs.push(ret_arg.new_expr);
      arg_type_exprs.push(ret_arg.type_expr);
   }
 
   // $type_method = sec_types.getTypeProtoChainProp($type_obj, prop);
   str = '{0} = sec_types.getTypeProtoChainProp({1}, {2});';
   str = $.validator.format(str, var_method_type, ret_obj_type_str, ret_prop_expr_str);
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);
   
   // level = lat.lub(pc_level, $type_obj.level, $type_prop.level, $type_method.level);
   str = '{0} = lat.lub({1}, {2}.level, {3}.level, {4}.level);';
   str = $.validator.format(str, var_level_aux, pc_id, ret_obj_type_str, ret_prop_type_str, var_method_type);
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);
   
   // $type_method.parameter_types.length != [[number of arguments]]
   // sec_types.isSubType($type_obj, $type_method.this_type)
   // lat.leq(level_aux, $method_type.context_level)
   str = '(({0}.parameter_types.length === {1}) && (sec_types.isSubType({2}, {0}.this_type))) && lat.leq({3}, {0}.context_level)';
   str = $.validator.format(str, 
  	 var_method_type, 
  	 method_call_expr.arguments.length, 
  	 ret_obj_type_str, 
  	 var_level_aux);
   test = utils.parseExpr(str);
   
   for (var i = 0, len = arg_val_exprs.length; i < len; i++) {
   	   // sec_types.isSubType($l_arg_i, type_callee.parameter_types[i])
   	  ret_arg_type_str = utils.printExprST(arg_type_exprs[i]);
      str = 'sec_types.isSubType({0}, {1}.parameter_types[{2}]);';
      str = $.validator.format(str, ret_arg_type_str, var_method_type, i);  
      type_arg_expr = utils.parseExpr(str);
      
      if (i === 0) {
         type_args_expr = type_arg_expr; 
      } else {
      	 type_args_expr = window.esprima.delegate.createBinaryExpression('&&', type_args_expr, type_arg_expr); 
      }
      
   }
   
   if (i) {
      test = window.esprima.delegate.createBinaryExpression('&&', test, type_args_expr);	
   }
   
   // type_var = $type_method.ret_type
   str = '{0} = {1}.ret_type;';
   str = $.validator.format(str, var_type, var_method_type);
   type_stmt1 = utils.parseStmt(str);
    
   // type_var.level = lat.lub(type_var.level, level_aux);
   str = '{0}.level = lat.lub({0}.level, {1});';
   str = $.validator.format(str, var_type, var_level_aux);    
   type_stmt2 = utils.parseStmt(str);
   
   compiled_call = window.esprima.delegate.createCallExpression(
      window.esprima.delegate.createMemberExpression(
         '[', 
         $.extend(true, {}, ret_obj.new_expr),
         $.extend(true, {}, ret_prop.new_expr)), 
      arg_val_exprs);
   compiled_call = window.esprima.delegate.createAssignmentExpression(
   	   '=', 
   	   window.esprima.delegate.createIdentifier(var_expr), 
   	   compiled_call);
   compiled_call = window.esprima.delegate.createExpressionStatement(compiled_call);
   
   // if (cond) { } else { }
   stmt = sec_types.buildIfWrapper([compiled_call, type_stmt1, type_stmt2], test);
   new_stmts.push(stmt);
   
   return {
      new_expr: window.esprima.delegate.createIdentifier(var_expr),  
      new_stmts: new_stmts,  
      new_vars: new_vars, 
      type_expr: window.esprima.delegate.createIdentifier(var_type)
   };  
}; 



sec_types.staticTCReturnStmt = function (ret_stmt, type_env, pc_level, cur_fun_type) {
   var err, ret_type; 
      
   if (!cur_fun_type) {
      err = new Error('Typing Error: Return outside a function literal');
      err.typing_error = true;  
      throw err;     
   }
   
   if (!lat.leq(pc_level, cur_fun_type.context_level)) {
   	  err =  new Error('Typing Error: No Return in High Context'); 
      err.typing_error = true;  
      throw err;
   }
   
   ret_type = this.staticTC(ret_stmt.argument, type_env, pc_level);
   ret_type.level = lat.lub(ret_type.level, pc_level); 
   if(!this.isSubType(ret_type, cur_fun_type.ret_type)) {
      err = new Error('Typing Error: Illegal Return - Type of the returned expression does not match the return type');
      err.typing_error = true;  
      throw err; 
   }
   
   return ret_type; 
};


sec_types.dynamicTCReturnStmt = function (ret_stmt, env_id, pc_id, cur_fun_type) {
   var ret_arg, ret_arg_expr_str, ret_arg_type_str; 
   var new_stmts, new_vars; 
   var str, stmt, test; 
   
   ret_arg = this.dynamicTC(ret_stmt.argument, env_id, pc_id);
   new_stmts = ret_arg.new_stmts; 
   new_vars = ret_arg.new_vars; 
   
   ret_arg_expr_str = utils.printExprST(ret_arg.new_expr);
   ret_arg_type_str = utils.printExprST(ret_arg.type_expr);
   
   // cur_fun_type && sec_types.isSubType($l_r, cur_fun_type.ret_type) && lat.leq(pc_level, cur_fun_type.ret_type.level) && lat.leq(pc_level, cur_fun_type.context_level)
   str = '{0} \&\& ((sec_types.isSubType({1}, {0}.ret_type)) \&\& ((lat.leq({2}, {0}.ret_type.level)) \&\& (lat.leq({2}, {0}.context_level))))';
   str = $.validator.format(str, 
   	  cur_fun_type, 
   	  ret_arg_type_str, 
   	  pc_id);
   test = utils.parseExpr(str);
   
   // return $x_ret
   stmt = window.esprima.delegate.createReturnStatement(ret_arg.new_expr);
   
   // if (cond) { } else { }
   stmt = sec_types.buildIfWrapper([stmt], test);
   new_stmts.push(stmt);
   
   return {
      new_stmts: new_stmts,  
      new_vars: new_vars
   }; 
};


sec_types.staticTCFunctionLiteralExpr = function (fun_lit_expr, type_env, pc_level) {
   var type; 
   
   type = sec_types.buildDelayedFunType(fun_lit_expr, type_env, pc_level);
   return type;
};	      

sec_types.staticTCThisExpr = function (this_expr, type_env, pc_level) {
   var this_type, err; 
   
   if (type_env.hasOwnProperty(sec_types.this_prop)) {
      this_type = type_env[sec_types.this_prop]; 
   } else {
   	  err = new Error('Typing Error: Using this in a function call is not supported');
      err.typing_error = true; 
      throw err;
   }
   
   return this_type; 
};

sec_types.dynamicTCThisExpr = function (this_expr, env_id, pc_id) {
   var expr_level, str; 
   
   // env.this
   str = '{0}.'+sec_types.this_prop;
   str = $.validator.format(str, env_id);
   expr_level = utils.parseExpr(str);
   
   return {
      new_expr: window.esprima.delegate.createThisExpression(),  
      new_stmts: [],  
      new_vars: [], 
      type_expr: expr_level
   };    
};

sec_types.staticTCVarDeclaration = function (var_decl, type_env, pc_level) {
   return; 
}; 

sec_types.typeDelayedFunType = function (fun_lit_expr, type_env, fun_type) {
   var params, new_type_env, pc_level;
   var processed_fun_lit; 
   var ret, new_stmts, new_vars;
   var str;  
   
   params = fun_lit_expr.params; 
   new_type_env = sec_types.extendTypingEnvironment(type_env, fun_type, params);
   pc_level = fun_type.context_level;
   new_stmts = [];
   
   sec_types.pc_vars.push(sec_types.generateNewPCName());
   sec_types.env_vars.push(sec_types.generateNewEnvName()); 
   sec_types.fun_type_vars.push(sec_types.generateNewFunTypeName());
   
   // pc = fun_type.context_level; 
   str = "{0} = {1};";
   str = $.validator.format(str, sec_types.pc_vars[sec_types.pc_vars.length - 1], fun_type.context_level);
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);
   
   // env = [[env]]
   str = "{0} = {1};";
   str = $.validator.format(str, 
   	  sec_types.env_vars[sec_types.env_vars.length - 1], 
   	  JSON.stringify(new_type_env));
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);  
   
   // fun_type_var = JSON.parse([[fun_type]]);
   str = '{0} = {1};'; 
   str = $.validator.format(str, 
   	  sec_types.fun_type_vars[sec_types.fun_type_vars.length - 1], 
   	  JSON.stringify(fun_type));
   stmt = utils.parseStmt(str);
   new_stmts.push(stmt);
    
   if (!new_type_env) {
   	  err = new Error('Typing Error: The number of parameters of the funtion literal does not match the number of parameter of the function type.');
      err.typing_error = true;  
      throw err;
   }
   
   ret = this.staticTC(fun_lit_expr.body, new_type_env, pc_level, fun_type);
   new_stmts = new_stmts.concat(ret.new_stmts);
   
   new_vars = ret.new_vars; 
   new_vars.push(sec_types.pc_vars[sec_types.pc_vars.length - 1]);
   new_vars.push(sec_types.env_vars[sec_types.env_vars.length - 1]);
   new_vars.push(sec_types.fun_type_vars[sec_types.fun_type_vars.length - 1]);
   new_vars_decl = sec_types.buildNewVarsDeclaration(new_vars); 
   if (new_vars_decl) new_stmts.unshift(new_vars_decl);
   
   fun_lit_expr.body = window.esprima.delegate.createBlockStatement(new_stmts); 
    	
   sec_types.pc_vars.pop();
   sec_types.env_vars.pop(); 
   sec_types.fun_type_vars.pop();  
   return; 
};

sec_types.extendTypingEnvironment = function (type_env, fun_type, params) {
   var new_type_env, prop, type, var_name; 
   
   if (fun_type.parameter_types.length !== params.length) {
      return false;	
   } 
   
   new_type_env = {}; 
   for (prop in type_env) {
      if (type_env.hasOwnProperty(prop)) { 
         new_type_env[prop] = $.extend(true, {}, type_env[prop]);	
      }
   }
   
   for (var i = 0, len = params.length; i < len; i++) {
      var_name = params[i].name; 
      type = fun_type.parameter_types[i];
      new_type_env[var_name] = $.extend(true, {}, type);
   }
   
   if (fun_type.var_types) {
      for (prop in fun_type.var_types) {
         if (fun_type.var_types.hasOwnProperty(prop)) {
            var_name = prop; 
            type = fun_type.var_types[prop]; 
            new_type_env[var_name] = $.extend(true, {}, type); 	
         }	
      }	
   }
   
   new_type_env[sec_types.this_prop] = fun_type.this_type;
   new_type_env[sec_types.ret_prop] = fun_type.ret_type; 
   new_type_env[sec_types.original_pc_level] = fun_type.context_level; 
   
   return new_type_env; 
};


sec_types.buildIfWrapper = function (stmts, cond) {
   var if_st, str; 
   
   str = 'if(true) {} else { throw new Error(\'Illegal Runtime Operation\')}'; 
   if_st = utils.parseStmt(str); 
   if_st.test = cond; 
   if_st.consequent.body = stmts; 
   return if_st; 
};


sec_types.generateNewVarExprName = (function() {
    var index = 0; 
    return function () {
       index++; 
       return '$x_'+index; 
    };
})(); 

sec_types.generateNewVarTypeName = (function() {
    var index = 0; 
    return function () {
       index++; 
       return '$type_'+index; 
    };
})(); 

sec_types.generateNewVarLevelName = (function() {
    var index = 0; 
    return function () {
       index++; 
       return '$level_'+index; 
    };
})(); 

sec_types.generateNewPCName = (function() {
    var index = 0; 
    return function () {
       index++; 
       return '$pc_'+index; 
    };
})(); 

sec_types.generateNewEnvName = (function() {
    var index = 0; 
    return function () {
       index++; 
       return '$env_'+index; 
    };
})();

sec_types.generateNewFunTypeName = (function() {
    var index = 0; 
    return function () {
       index++; 
       return '$fun_type_'+index; 
    };
})(); 


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








