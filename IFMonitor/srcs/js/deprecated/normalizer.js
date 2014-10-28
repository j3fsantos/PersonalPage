if (!comp) {
	throw new Error('The comp object is not available!');
}

comp.normalize = function (st, must_be_simple) {
	if(!st) return st; 
	switch(st.type)	{
		case 'Program': 
		   return this.normalizeProgram(st); 
		case 'ExpressionStatement': 
		   return this.normalizeExprStmt(st);
		case 'Literal': 
		   return this.normalizeLiteralExpr(st); 
		case 'Identifier': 
		   return this.normalizeIdentifierExpr(st);
		case 'ThisExpression': 
		   return this.normalizeThisExpr(st);
		case 'VariableDeclaration': 
	      return this.normalizeVarDeclarationStmt(st);  
	   case 'MemberExpression': 
		   return this.normalizePropLookUpExpr(st, must_be_simple);
	   case 'LogicalExpression': 
		   return this.normalizeBinOpExpr(st, must_be_simple); 
		case 'BinaryExpression': 
		   return this.normalizeBinOpExpr(st, must_be_simple); 
		case 'UnaryExpression': 
		   return this.normalizeUnOpExpr(st, must_be_simple);
		case 'CallExpression':
		   return this.normalizeCallExpr(st, must_be_simple); 
		case 'NewExpression': 
		   return this.normalizeConstructorCallExpr(st, must_be_simple);  
		case 'AssignmentExpression': 
		   return  this.normalizeAssignmentExpr(st, must_be_simple);
		case 'ObjectExpression': 
		   return this.normalizeObjectExpr(st, must_be_simple); 
		case 'ArrayExpression': 
	      return this.normalizeArrayExpr(st, must_be_simple); 
	   case 'BlockStatement':
	      return this.normalizeBlockStmt(st);
	   case 'WhileStatement': 
	      return this.normalizeWhileStmt(st); 
	   case 'IfStatement':
	      return this.normalizeIfStmt(st);  
	   case 'ReturnStatement': 
	      return this.normalizeReturnStmt(st);  
	   case 'FunctionExpression': 
	      return this.normalizeFunctionLiteralExpr(st); 
	   case 'ConditionalExpression': 
	      return this.normalizeConditionalExpr(st);  
	   case 'SequenceExpression': 
	      return this.normalizeSequenceExpr(st);  
	   case 'DoWhileStatement':
	      return this.normalizeDoWhileStmt(st);
	   case 'ForStatement': 
	      return this.normalizeForStmt(st); 
	   case 'UpdateExpression':
	      return this.normalizeUpdateExpr(st); 
	   case 'ForInStatement': 
	      return this.normalizeForInStmt(st); 
	   default:  
		   if (!st.type) {
		   	throw new Error('Syntax Error - Illegal Program');
		   } else {
		   	throw new Error('Construct ' + st.type + ' is not supported yet');
		   }   
	}
};

comp.normalizeProgram = function (prog_stmt) {
	var body,
	    i,
	    len,
	    new_vars, 
	    normalized_stmts,
	    normalized_prog, 
	    temp,
	    unrestrain_upgds_call,
	    vars_declaration_stmt, 
	    vars; 
	    
	body = prog_stmt.body; 
	normalized_stmts = []; 
	vars = []; 
	new_vars = [];
	for (i = 0, len = body.length; i < len; i++) {
	  	stmt = body[i]; 
	  	tmp = this.normalize(stmt);  
	  	normalized_stmts = normalized_stmts.concat(tmp.stmts);
	  	vars = vars.concat(tmp.vars); 
	  	new_vars = new_vars.concat(tmp.new_vars); 
	}
	
	comp.normalization_variables = comp.normalization_variables.concat(new_vars); 
	
	vars = vars.concat(new_vars);
	vars_declaration_stmt = this.buildVarsDeclStmt(vars);
	if (vars_declaration_stmt) {
	   normalized_stmts.unshift(vars_declaration_stmt);
	}
	
	normalized_prog = window.esprima.delegate.createProgram(normalized_stmts);
	return normalized_prog; 
};

comp.normalizeExprStmt = function (expr_stmt) {
	var normalized_expr, 
	    stmts, 
	    tmp; 
	    
	tmp = this.normalize(expr_stmt.expression);
	normalized_expr = window.esprima.delegate.createExpressionStatement(tmp.expr);
	stmts = tmp.stmts; 
	stmts.push(normalized_expr); 
	
	return {
		stmts: stmts, 
		vars: tmp.vars, 
		new_vars: tmp.new_vars, 
	};
};

comp.normalizeThisExpr = function (this_expr) {
   return {
      expr: window.esprima.delegate.createThisExpression(), 
	  stmts: [],
	  vars: [], 
	  new_vars: []
   };
};

comp.normalizeIdentifierExpr = function (ident_expr) {
	return {
		expr: $.extend(true, {}, ident_expr), 
		stmts: [],
		vars: [], 
		new_vars: []
	};
};

comp.normalizeLiteralExpr = function (literal_expr) {
	return {
		expr: $.extend(true, {}, literal_expr), 
		stmts: [],
		vars: [], 
		new_vars: []
	};	
};

comp.normalizeVarDeclarationStmt = function (var_decl_stmt) {
	var declarations,
	    declarator,  
	    i, 
	    len, 
	    new_vars, 
	    stmt,
	    stmts,
	    tmp,  
	    vars;  
	    
	declarations = var_decl_stmt.declarations; 
	vars = [];
	new_vars = []; 
	stmts = []; 
	
	for (i = 0, len = declarations.length; i < len; i++) {
		declarator = declarations[i]; 
		vars.push(declarator.id.name);
		stmt = declarator.init; 
		if (stmt) {
			stmt = window.esprima.delegate.createAssignmentExpression(
				'=', 
				window.esprima.delegate.createIdentifier(declarator.id.name), 
				$.extend(true, {}, stmt)
			); 
			stmt = window.esprima.delegate.createExpressionStatement(stmt);
		   tmp = this.normalize(stmt); 
		   stmts = stmts.concat(tmp.stmts); 
		   vars = vars.concat(tmp.vars);
		   new_vars = new_vars.concat(tmp.new_vars); 
		}
	}
	
	return {
		new_vars: new_vars, 
		vars: vars, 
		stmts: stmts
	};
};

comp.normalizePropLookUpExpr = function (member_expr, must_be_simple) {
	var expr,
	    new_vars, 
	    new_var_name,
	    new_var_assignment, 
	    normalized_object, 
	    normalized_property, 
	    object,
	    property,
	    prop_expr,  
	    stmts, 
	    vars;
	
	object = member_expr.object; 
	property = member_expr.property; 
	normalized_object = this.normalize(object, true); 
	normalized_property = this.normalize(property, true);
	
	stmts = normalized_object.stmts.concat(normalized_property.stmts); 
	vars = normalized_object.vars.concat(normalized_property.vars); 
	new_vars = normalized_object.new_vars.concat(normalized_property.new_vars);
	
	if (member_expr.computed) {
		prop_expr = normalized_property.expr; 
	} else { 
		prop_expr = window.esprima.delegate.createLiteral2(normalized_property.expr.name);
	}
	
	if (must_be_simple) {
	   new_var_name = this.createFreeVarName();
	   new_var_assignment = window.esprima.delegate.createAssignmentExpression(
		   '=', 
		   window.esprima.delegate.createIdentifier(new_var_name), 
		   window.esprima.delegate.createMemberExpression(
		   	'[',
		   	normalized_object.expr,
		   	prop_expr)
	   ); 
	   new_var_assignment = window.esprima.delegate.createExpressionStatement(new_var_assignment);
	   stmts.push(new_var_assignment); 
	   new_vars.push(new_var_name);
	   expr = window.esprima.delegate.createIdentifier(new_var_name); 
	} else {
		expr = window.esprima.delegate.createMemberExpression(
		  '[',
		  normalized_object.expr, 
		  prop_expr);
	}
	
	return {
		stmts: stmts,
		new_vars: new_vars,  
		vars: vars, 
		expr: expr
	};
};


comp.normalizeBinOpExpr = function (binop_expr, must_be_simple) {
   var expr, new_vars, normalized_left, normalized_right, stmts, vars;
	
   normalized_left = this.normalize(binop_expr.left, true); 
   normalized_right = this.normalize(binop_expr.right, true);
   stmts = normalized_left.stmts.concat(normalized_right.stmts); 
   vars = normalized_left.vars.concat(normalized_right.vars); 
   new_vars = normalized_left.new_vars.concat(normalized_right.new_vars); 
   expr = window.esprima.delegate.createBinaryExpression(binop_expr.operator, normalized_left.expr, normalized_right.expr);
  
   return { stmts: stmts, new_vars: new_vars, vars: vars, expr: expr };
};


comp.normalizeUnOpExpr = function (unop_expr, must_be_simple) {
   var argument, expr, new_vars, normalized_argument, stmts, vars;
	
   argument = unop_expr.argument;
   normalized_argument = this.normalize(argument, true); 
   stmts = normalized_argument.stmts; 
   vars = normalized_argument.vars;
   new_vars = normalized_argument.new_vars;  
   expr = window.esprima.delegate.createUnaryExpression(unop_expr.operator, normalized_argument.expr);
	
   return { stmts: stmts, new_vars: new_vars, vars: vars, expr: expr };
};


comp.normalizeCallExpr = function (call_expr, must_be_simple) {
	if (call_expr.callee.type === 'MemberExpression') {
		return this.normalizeMethodCallExpr(call_expr, must_be_simple);
	} else {
		return this.normalizeFunCallExpr(call_expr, must_be_simple);
	}
};

comp.normalizeFunCallExpr = function(call_expr, must_be_simple) {
	var args,
	    i, 
	    len, 
	    new_vars, 
	    new_var_assignment, 
	    new_var_name,  
	    normalized_arg, 
	    normalized_args_exprs, 
	    normalized_callee, 
	    stmts, 
	    vars;
	
	normalized_callee = this.normalize(call_expr.callee, true); 
	stmts = normalized_callee.stmts; 
	new_vars = normalized_callee.new_vars; 
	vars = normalized_callee.vars; 
	args = call_expr.arguments; 
	normalized_args_exprs = []; 
	
	for (i = 0, len = args.length; i < len; i++) {
		normalized_arg = this.normalize(args[i], true); 
		stmts = stmts.concat(normalized_arg.stmts); 
		vars = vars.concat(normalized_arg.vars);
		new_vars = new_vars.concat(normalized_arg.new_vars);
		normalized_args_exprs.push(normalized_arg.expr);
	}
	
   if (must_be_simple) {
	   new_var_name = this.createFreeVarName();
	   new_var_assignment = window.esprima.delegate.createAssignmentExpression(
		   '=', 
		   window.esprima.delegate.createIdentifier(new_var_name), 
		   window.esprima.delegate.createCallExpression(
		   	normalized_callee.expr,
		   	normalized_args_exprs
		   )
	   ); 
	   new_var_assignment = window.esprima.delegate.createExpressionStatement(new_var_assignment);
	   stmts.push(new_var_assignment); 
	   new_vars.push(new_var_name);
	   expr = window.esprima.delegate.createIdentifier(new_var_name); 
	} else {
		expr = window.esprima.delegate.createCallExpression(
		  normalized_callee.expr,
		  normalized_args_exprs
		);
	}
	
	return {
		stmts: stmts, 
		new_vars: new_vars, 
		vars: vars, 
		expr: expr
	};
};


comp.normalizeMethodCallExpr = function(call_expr, must_be_simple) {
	var args,
	    i, 
	    len, 
	    new_vars, 
	    new_var_assignment, 
	    new_var_name,  
	    normalized_arg, 
	    normalized_args_exprs, 
	    normalized_object,
	    normalized_property, 
	    stmts, 
	    vars;
	
	normalized_object = this.normalize(call_expr.callee.object, true);
	if (call_expr.callee.computed) {
	   normalized_property = this.normalize(call_expr.callee.property, true);
	} else {
	   normalized_property = {
	   	  stmts: [], 
		  new_vars: [], 
     	  vars: [], 
		  expr: window.esprima.delegate.createLiteral2(call_expr.callee.property.name) 
	   };
	} 
	stmts = normalized_object.stmts.concat(normalized_property.stmts);
	new_vars = normalized_object.new_vars.concat(normalized_property.new_vars);  
	vars = normalized_object.vars.concat(normalized_property.vars); 
	args = call_expr.arguments; 
	normalized_args_exprs = []; 
	
	for (i = 0, len = args.length; i < len; i++) {
		normalized_arg = this.normalize(args[i], true); 
		stmts = stmts.concat(normalized_arg.stmts); 
		vars = vars.concat(normalized_arg.vars);
		new_vars = new_vars.concat(normalized_arg.new_vars);
		normalized_args_exprs.push(normalized_arg.expr);
	}
	
   if (must_be_simple) {
	   new_var_name = this.createFreeVarName();
	   new_var_assignment = window.esprima.delegate.createAssignmentExpression(
		   '=', 
		   window.esprima.delegate.createIdentifier(new_var_name), 
		   window.esprima.delegate.createCallExpression(
		   	window.esprima.delegate.createMemberExpression(
		   		'[', 
		   		normalized_object.expr, 
		   		normalized_property.expr
		   	),
		   	normalized_args_exprs
		   )
	   ); 
	   new_var_assignment = window.esprima.delegate.createExpressionStatement(new_var_assignment);
	   stmts.push(new_var_assignment); 
	   new_vars.push(new_var_name);
	   expr = window.esprima.delegate.createIdentifier(new_var_name); 
	} else {
		expr = window.esprima.delegate.createCallExpression(
		  window.esprima.delegate.createMemberExpression(
		    '[', 
		  	 normalized_object.expr, 
		  	 normalized_property.expr  
		  ),
		  normalized_args_exprs
		);
	}
	
	return {
		stmts: stmts, 
		new_vars: new_vars, 
		vars: vars, 
		expr: expr
	};
};

comp.normalizeConstructorCallExpr = function (call_expr, must_be_simple) {
	var args,
	    i, 
	    len, 
	    new_vars, 
	    new_var_assignment, 
	    new_var_name,  
	    normalized_arg, 
	    normalized_args_exprs, 
	    normalized_object,
	    normalized_property, 
	    stmts, 
	    vars;
	
	normalized_constructor = this.normalize(call_expr.callee, true);
	stmts = normalized_constructor.stmts; 
	new_vars = normalized_constructor.new_vars; 
	vars = normalized_constructor.vars; 
	args = call_expr.arguments; 
	normalized_args_exprs = []; 
	
	for (i = 0, len = args.length; i < len; i++) {
		normalized_arg = this.normalize(args[i], true); 
		stmts = stmts.concat(normalized_arg.stmts); 
		vars = vars.concat(normalized_arg.vars);
		new_vars = vars.concat(normalized_arg.new_vars);
		normalized_args_exprs.push(normalized_arg.expr);
	}
	
   if (must_be_simple) {
	   new_var_name = this.createFreeVarName();
	   new_var_assignment = window.esprima.delegate.createAssignmentExpression(
		   '=', 
		   window.esprima.delegate.createIdentifier(new_var_name), 
		   window.esprima.delegate.createNewExpression(
		   	normalized_constructor.expr, 
		   	normalized_args_exprs
		   )
	   ); 
	   new_var_assignment = window.esprima.delegate.createExpressionStatement(new_var_assignment);
	   stmts.push(new_var_assignment); 
	   new_vars.push(new_var_name);
	   expr = window.esprima.delegate.createIdentifier(new_var_name); 
	} else {
		expr = window.esprima.delegate.createNewExpression(
		  normalized_constructor.expr, 
		  normalized_args_exprs
		);
	}
	
	return {
		stmts: stmts,
		new_vars: new_vars,  
		vars: vars, 
		expr: expr
	};
};

comp.normalizeAssignmentExpr = function (assignment_expr, must_be_simple) {
	if(assignment_expr.operator !== '=') {
		assignment_expr = window.esprima.delegate.createAssignmentExpression(
			'=', 
			assignment_expr.left, 
			window.esprima.delegate.createBinaryExpression(
				assignment_expr.operator[0], 
				$.extend(true, {}, assignment_expr.left), 
				assignment_expr.right));
	}
	
	if (assignment_expr.left.type === 'MemberExpression') {
		return this.normalizePropAssignmentExpr(assignment_expr, must_be_simple); 
	} else {
		return this.normalizeVarAssignmentExpr(assignment_expr, must_be_simple);
	}
};

comp.normalizeVarAssignmentExpr = function (assignment_expr, must_be_simple) {
	var expr,
	    new_assignment_1,
	    new_assignment_2,
	    new_vars,  
	    new_var_name,
	    normalized_left, 
	    normalized_right,
	    stmts, 
	    vars; 
	
	normalized_left = $.extend(true, {}, assignment_expr.left); 
	normalized_right = this.normalize(assignment_expr.right); 
   stmts = normalized_right.stmts;
   new_vars = normalized_right.new_vars;  
   vars = normalized_right.vars; 
   
   if (normalized_right.expr.type === 'AssignmentExpression') {
   	new_assignment_2 = normalized_right.expr; 
   	new_assignment_2 = window.esprima.delegate.createExpressionStatement(new_assignment_2); 
   	new_assignment_1 = window.esprima.delegate.createAssignmentExpression(
   		'=', 
   		normalized_left, 
   		$.extend(true, {}, normalized_right.expr.left));
   	stmts.push(new_assignment_2);
   } else {
   	new_assignment_1 = window.esprima.delegate.createAssignmentExpression(
		   '=', 
		   normalized_left, 
		   normalized_right.expr
	   );
   }
	
	if (must_be_simple) {
	   new_assignment_1 = window.esprima.delegate.createExpressionStatement(new_assignment_1);
	   stmts.push(new_assignment_1); 
	   expr = $.extend(true, {}, assignment_expr.left);	
	} else {
		expr = new_assignment_1; 
	}
	
	return {
		stmts: stmts, 
		new_vars: new_vars, 
		vars: vars, 
		expr: expr
	};
};

comp.normalizePropAssignmentExpr = function (assignment_expr, must_be_simple) {
	var expr, 
	    new_assignment_1,
	    new_assignment_2, 
	    new_vars, 
	    new_var_name,  
	    normalized_object,
	    normalized_prop,  
	    normalized_right, 
	    stmts,  
	    vars;
	
	normalized_object = this.normalize(assignment_expr.left.object, true); 
	normalized_prop = this.normalize(assignment_expr.left.property, true); 
	normalized_right = this.normalize(assignment_expr.right, true); 
	
	if (assignment_expr.left.computed) {
	   new_assignment_1 = window.esprima.delegate.createAssignmentExpression(
		   '=', 
		   window.esprima.delegate.createMemberExpression(
			   '[',
			   normalized_object.expr, 
			   normalized_prop.expr
		   ), 
		   normalized_right.expr
	   );	
	} else {
		new_assignment_1 = window.esprima.delegate.createAssignmentExpression(
		   '=', 
		   window.esprima.delegate.createMemberExpression(
			   '[',
			   normalized_object.expr, 
			   window.esprima.delegate.createLiteral2(normalized_prop.expr.name)
		   ), 
		   normalized_right.expr
	   );
	}
	
   stmts = normalized_object.stmts.concat(normalized_prop.stmts);
   stmts = stmts.concat(normalized_right.stmts);    
   vars = normalized_object.vars.concat(normalized_prop.vars);
   vars = vars.concat(normalized_right.vars); 
   new_vars = normalized_object.new_vars.concat(normalized_prop.new_vars);
   new_vars = new_vars.concat(normalized_right.new_vars); 
	
	if (must_be_simple) {
	   new_assignment_1 = window.esprima.delegate.createExpressionStatement(new_assignment_1);
	   stmts.push(new_assignment_1); 
	   new_var_name = this.createFreeVarName();
	   new_assignement_2 = window.esprima.delegate.createAssignmentExpression(
	   	'=', 
	   	window.esprima.delegate.createIdentifier(new_var_name), 
	   	window.esprima.delegate.createMemberExpression(
			   '[',
		    	normalized_object.expr, 
			   this.turn2Literal(normalized_prop.expr)
		   )
	   );
	   new_assignment_2 = window.esprima.delegate.createExpressionStatement(new_assignment_2);
	   stmts.push(new_assignment_2);
	   new_vars.push(new_var_name);
	   expr = window.esprima.delegate.createIdentifier(new_var_name);
	} else {
		expr = new_assignment_1; 
	}
	
	return {
		stmts: stmts, 
		new_vars: new_vars, 
		vars: vars, 
		expr: expr
	};
};

comp.normalizeObjectExpr = function (obj_expr, must_be_simple) {
	var assignment_obj, 
	    assignment_prop,
	    i, 
	    len, 
	    new_vars,
	    new_obj_var_name, 
	    normalized_prop_expr, 
	    previous_stmts, 
	    properties,
	    property,
	    prop_identifier, 
	    stmts, 
	    vars;
	    
	properties = obj_expr.properties; 
	previous_stmts = [];
	stmts = []; 
	vars = [];
	new_vars = []; 
	
	new_obj_var_name = this.createFreeVarName(); 
	assignment_obj = window.esprima.delegate.createAssignmentExpression(
		'=',
		window.esprima.delegate.createIdentifier(new_obj_var_name), 
		window.esprima.delegate.createObjectExpression([])
	);
	assignment_obj = window.esprima.delegate.createExpressionStatement(assignment_obj);
	stmts.push(assignment_obj);
	new_vars.push(new_obj_var_name); 
	
	for (i = 0, len = properties.length; i < len; i++) {
	   property = properties[i];
	   prop_identifier = $.extend(true, {}, property.key);
	   normalized_prop_expr = this.normalize(property.value, true); 
	   previous_stmts = previous_stmts.concat(normalized_prop_expr.stmts); 
	   vars = vars.concat(normalized_prop_expr.vars);
	   new_vars = new_vars.concat(normalized_prop_expr.new_vars);
	   
	   assignment_prop = window.esprima.delegate.createAssignmentExpression(
	   	'=', 
	   	window.esprima.delegate.createMemberExpression(
	   		'[',
	   		window.esprima.delegate.createIdentifier(new_obj_var_name), 
	   		this.turn2Literal(prop_identifier)
	   	), 
	   	normalized_prop_expr.expr
	   );
	   assignment_prop = window.esprima.delegate.createExpressionStatement(assignment_prop); 
	   stmts.push(assignment_prop);	
	}
	
	stmts = previous_stmts.concat(stmts); 
	return {
		stmts: stmts, 
		vars: vars,
		new_vars: new_vars,  
		expr: window.esprima.delegate.createIdentifier(new_obj_var_name)
	};
};

comp.normalizeArrayExpr = function (array_expr, must_be_simple) {
	var assignment_arr,
	    assignment_element, 
	    element, 
	    i, 
	    len, 
	    new_vars, 
	    new_arr_var_name,
	    normalized_element_expr, 
	    previous_stmts,
	    stmts, 
	    vars;
	    
	elements = array_expr.elements; 
	previous_stmts = [];
	stmts = []; 
	vars = [];
	new_vars = []; 
	
	new_arr_var_name = this.createFreeVarName(); 
	assignment_arr = window.esprima.delegate.createAssignmentExpression(
		'=',
		window.esprima.delegate.createIdentifier(new_arr_var_name), 
		window.esprima.delegate.createArrayExpression([])
	);
	assignment_arr = window.esprima.delegate.createExpressionStatement(assignment_arr);
	stmts.push(assignment_arr);
	new_vars.push(new_arr_var_name); 
	
	for (i = 0, len = elements.length; i < len; i++) {
	   element = elements[i];
	   normalized_element_expr = this.normalize(element, true); 
	   previous_stmts = previous_stmts.concat(normalized_element_expr.stmts); 
	   vars = vars.concat(normalized_element_expr.vars);
	   new_vars = new_vars.concat(normalized_element_expr.new_vars);
	   
	   assignment_element = window.esprima.delegate.createAssignmentExpression(
	   	'=', 
	   	window.esprima.delegate.createMemberExpression(
	   		'[',
	   		window.esprima.delegate.createIdentifier(new_arr_var_name), 
	   		window.esprima.delegate.createLiteral2(i)
	   	), 
	   	normalized_element_expr.expr
	   );
	   assignment_element = window.esprima.delegate.createExpressionStatement(assignment_element); 
	   stmts.push(assignment_element);	
	}
	
	stmts = previous_stmts.concat(stmts); 
	return {
		stmts: stmts, 
		new_vars: new_vars, 
		vars: vars, 
		expr: window.esprima.delegate.createIdentifier(new_arr_var_name)
	};
};

comp.normalizeBlockStmt = function (block_stmt) {
	var body = block_stmt.body, 
	    i, 
	    len, 
	    new_block, 
	    new_vars = [], 
	    normalized_stmt, 
	    stmts = [], 
	    vars = [];
	
	for (i = 0, len = body.length; i < len; i++) {
		normalized_stmt = this.normalize(body[i]); 
		stmts = stmts.concat(normalized_stmt.stmts); 
		vars = vars.concat(normalized_stmt.vars);
		new_vars = new_vars.concat(normalized_stmt.new_vars);
	}
	
	new_block = window.esprima.delegate.createBlockStatement(stmts); 
	return { stmts: [new_block], vars: vars, new_vars: new_vars };
};


comp.normalizeIfStmt = function(if_stmt) {
   var new_vars, 
       normalized_alternate, 
       normalized_alterante_stmt, 
       normalized_consequent, 
       normalized_consequent_stmt, 
       normalized_if_stmt, 
       normalized_test, 
       normalized_test_expr, 
       stmts, 
       vars;

   // test expr
   normalized_test = this.normalize(if_stmt.test, true);
   normalized_test_expr = normalized_test.expr;
   stmts = normalized_test.stmts;
   vars = normalized_test.vars;
   new_vars = normalized_test.new_vars; 

   // consequent
   normalized_consequent = this.normalize(if_stmt.consequent);
   normalized_consequent_stmt = normalized_consequent.stmts[0];
   vars = vars.concat(normalized_consequent.vars);
	new_vars = new_vars.concat(normalized_consequent.new_vars);

   //alternate
   if (if_stmt.alternate) {
      normalized_alternate = this.normalize(if_stmt.alternate);
      normalized_alternate_stmt = normalized_alternate.stmts[0];
      vars = vars.concat(normalized_alternate.vars);
      new_vars = new_vars.concat(normalized_alternate.new_vars); 
   } else {
      normalized_alternate_stmt = null;
   }

   normalized_if_stmt = window.esprima.delegate.createIfStatement(normalized_test_expr, normalized_consequent_stmt, normalized_alternate_stmt);
   stmts.push(normalized_if_stmt);

   return { stmts: stmts, vars: vars, new_vars: new_vars };
};

comp.normalizeWhileStmt = function(while_stmt) {
   var new_vars, 
       normalized_body, 
       normalized_body_stmt, 
       normalized_while_stmt, 
       normalized_test, 
       normalized_test_expr, 
       prev_stmts, 
       stmts, 
       vars;

   // test expr
   normalized_test = this.normalize(while_stmt.test, true);
   normalized_test_expr = normalized_test.expr;
   stmts = normalized_test.stmts;
   vars = normalized_test.vars;
   new_vars = normalized_test.new_vars; 

   // body
   prev_stmts = $.extend(true, [], normalized_test.stmts);
   normalized_body = this.normalize(while_stmt.body);
   normalized_body_stmt = normalized_body.stmts[0];
   normalized_body_stmt.body = normalized_body_stmt.body.concat(prev_stmts);
   vars = vars.concat(normalized_body.vars);
   new_vars = new_vars.concat(normalized_body.new_vars); 

   normalized_while_stmt = window.esprima.delegate.createWhileStatement(normalized_test_expr, normalized_body_stmt);
   stmts.push(normalized_while_stmt);

   return { stmts: stmts, vars: vars, new_vars: new_vars };
};

comp.normalizeFunctionLiteralExpr = function(funlit_expr, must_be_simple) {
	var expr,
	    new_vars = [],
	    new_assignment,  
	    new_var_name, 
	    normalized_body, 
	    normalized_body_stmt, 
	    normalized_funlit_expr, 
	    params, 
	    stmts = [],
	    unrestrain_upgds_call,  
	    vars = [],
	    vars_aux,
	    vars_decl_stmt; 
	
	params = $.extend(true, [], funlit_expr.params);
	normalized_body = this.normalize(funlit_expr.body);
	normalized_body_stmt = normalized_body.stmts[0]; 
	
	comp.normalization_variables = comp.normalization_variables.concat(normalized_body.new_vars); 
	
	vars_aux = normalized_body.vars.concat(normalized_body.new_vars);
	vars_decl_stmt = this.buildVarsDeclStmt(vars_aux);
	if (vars_decl_stmt) {  
	   normalized_body_stmt.body.unshift(vars_decl_stmt); 
	}
	
	normalized_funlit_expr = window.esprima.delegate.createFunctionExpression(null, params, [], normalized_body_stmt); 
	
	if (must_be_simple) {
		new_var_name = this.createFreeVarName();
		new_assignment = window.esprima.delegate.createAssignmentExpression(
			'=', 
			window.esprima.delegate.createLiteral(new_var_name), 
			normalized_funlit_expr
		);
		new_assignment = window.esprima.delegate.createExpressionStatement(new_assignment);
		stmts.push(new_assignment);
		new_vars.push(new_var_name); 
		expr = window.esprima.delegate.createLiteral(new_var_name);  
	} else {
		expr = normalized_funlit_expr; 
	}
	
	return {
		stmts: stmts, 
		new_vars: new_vars, 
		vars: vars, 
		expr: expr
	};
};

comp.normalizeReturnStmt = function (return_stmt) {
	var new_vars, 
	    normalized_argument, 
	    normalized_argument_expr,
	    return_stmt, 
	    stmts, 
	    vars; 
	
	normalized_argument = this.normalize(return_stmt.argument, true); 
	normalized_argument_expr = normalized_argument.expr;
	stmts = normalized_argument.stmts; 
	vars = normalized_argument.vars;
	new_vars = normalized_argument.new_vars;  
	
	return_stmt = window.esprima.delegate.createReturnStatement(normalized_argument_expr);  
	stmts.push(return_stmt); 
	
	return { stmts: stmts, vars: vars, new_vars: new_vars };
};

comp.normalizeConditionalExpr = function (cond_expr) {
   var alternate_block_statement, 
       assignment_stmt_alternate,
       assignment_stmt_consequent,
       consequent_block_statement,  
       expr_normalized_alternate,
       expr_normalized_consequent, 
       expr_normalized_test,
       new_vars,
       new_var_name,  
       vars;  
       
   expr_normalized_test = this.normalize(cond_expr.test, true);
   expr_normalized_consequent = this.normalize(cond_expr.consequent); 
   expr_normalized_alternate = this.normalize(cond_expr.alternate);
   
   vars = expr_normalized_test.vars;
   new_vars = expr_normalized_test.new_vars; 
	vars = vars.concat(expr_normalized_consequent.vars);
	vars = vars.concat(expr_normalized_alternate.vars);
	new_vars = new_vars.concat(expr_normalized_consequent.new_vars);
	new_vars = new_vars.concat(expr_normalized_alternate.new_vars);
   new_var_name= this.createFreeVarName();  
   new_vars.push(new_var_name); 
   
   assignment_stmt_consequent = window.esprima.delegate.createAssignmentExpression(
   	'=', 
   	window.esprima.delegate.createIdentifier(new_var_name), 
   	expr_normalized_consequent.expr 
   );
   assignment_stmt_consequent = window.esprima.delegate.createExpressionStatement(assignment_stmt_consequent);
   expr_normalized_consequent.stmts.push(assignment_stmt_consequent); 
  
   assignment_stmt_alternate = window.esprima.delegate.createAssignmentExpression(
   	'=', 
   	window.esprima.delegate.createIdentifier(new_var_name), 
   	expr_normalized_alternate.expr 
   );
   assignment_stmt_alternate = window.esprima.delegate.createExpressionStatement(assignment_stmt_alternate);
   expr_normalized_alternate.stmts.push(assignment_stmt_alternate); 
  
   consequent_block_statement = window.esprima.delegate.createBlockStatement(expr_normalized_consequent.stmts); 
   alternate_block_statement = window.esprima.delegate.createBlockStatement(expr_normalized_alternate.stmts); 
   if_statement = window.esprima.delegate.createIfStatement(
      expr_normalized_test.expr, 
      consequent_block_statement, 
      alternate_block_statement
   );
   
   stmts = expr_normalized_test.stmts; 
   stmts.push(if_statement);
   expr = window.esprima.delegate.createIdentifier(new_var_name);  
   
   return {
   	stmts: stmts, 
   	expr: expr, 
   	new_vars: new_vars, 
   	vars: vars
   };
};

comp.normalizeSequenceExpr = function (seq_expr) {
	var expr, 
	    exprs, 
	    expr_stmt, 
	    final_expr, 
	    new_vars = [], 
	    normalized_expr, 
	    stmts = [], 
	    vars = []; 
	    
	exprs = seq_expr.expressions; 
	for(i = 0, len = exprs.length; i < len; i++) {
		expr = exprs[i];
		normalized_expr = this.normalize(expr);
		vars = vars.concat(normalized_expr.vars);
		new_vars = new_vars.concat(normalized_expr.new_vars);
      stmts = stmts.concat(normalized_expr.stmts); 
      
      if (i !== (len-1)) {
         expr_stmt = window.esprima.delegate.createExpressionStatement(normalized_expr.expr);
         stmts.push(expr_stmt);	
      } else {
      	if (normalized_expr.expr.type === 'AssignmentExpression') {
      	   expr_stmt = window.esprima.delegate.createExpressionStatement(normalized_expr.expr);
            stmts.push(expr_stmt);		
            final_expr = $.extend(true, {}, normalized_expr.expr.left);
      	} else {
      		final_expr = normalized_expr.expr; 
      	}
      }
	}
	
	return {
		stmts: stmts, 
		vars: vars, 
		new_vars: new_vars, 
		expr: final_expr
	};
};


/*
 * Original Code: do {s} while(e);
 * N[s] = s', V'
 * N[e] = ê, s_e, V_e
 * Normalized Code: 
 *    s'
 *    s_e
 *    while(ê) {
 * 	   s'
 *       s_e
 *    }
 * 
 *    V' \cup V_e
 */
comp.normalizeDoWhileStmt = function (do_while_stmt) {
	var first_body,
	    new_vars,  
	    normalized_first_body, 
	    normalized_first_test,
	    normalized_second_body,
	    normalized_second_test, 
       stmts, 
       vars, 
	    while_body, 
	    while_stmt;
	 
	normalized_first_body = this.normalize(do_while_stmt.body); 
   normalized_first_test = this.normalize(do_while_stmt.test);
	normalized_second_body = $.extend(true, {}, normalized_first_body);
	normalized_second_test = $.extend(true, {}, normalized_first_test); 
	
	stmts = normalized_first_body.stmts[0].body.concat(normalized_first_test.stmts);
	while_body = normalized_second_body.stmts[0]; 
	while_body.body = while_body.body.concat(normalized_second_test.stmts); 
	
	while_stmt = window.esprima.delegate.createWhileStatement(
		normalized_first_test.expr, 
		while_body
	); 
	stmts.push(while_stmt); 
	
	vars = normalized_first_test.vars.concat(normalized_first_body.vars);
	new_vars = normalized_first_test.new_vars.concat(normalized_first_body.new_vars);
	
	return {
		stmts: stmts, 
		vars: vars, 
		new_vars: new_vars
	};	
};

/*
 * Original Code: for(e_1, e_2, e_3) {s}
 * N[s] = s', V'
 * N[e_1] = ê_1, s_1, V_1
 * N[e_2] = ê_2, s_2, V_2
 * N[e_3] = ê_3, s_3, V_3
 * Normalized Code: 
 *    s_1
 *    ê_1; 
 *    s_2
 *    while(ê_2) {
 * 	   s'
 *       s_3
 *       ê_3; 
 *       s_2
 *    }
 * 
 *    V' \cup V_1 \cup V_2 \cup V_3
 */
comp.normalizeForStmt = function (for_stmt) {
	var new_vars, 
	    normalized_body,
	    normalized_init, 
	    normalized_test,
	    normalized_test_copy, 
	    normalized_update,
	    stmts, 
	    vars, 
	    while_body,
	    while_stmt;
	    
   normalized_init = this.normalize(for_stmt.init); 
   normalized_test = this.normalize(for_stmt.test); 
   normalized_test_copy = $.extend(true, {}, normalized_test);
   normalized_update = this.normalize(for_stmt.update);
   normalized_body = this.normalize(for_stmt.body);
   
   stmts = this.getStmtsAndExpr(normalized_init);
   stmts = stmts.concat(normalized_test.stmts);
   
   while_body = normalized_body.stmts[0];
   while_body.body = while_body.body.concat(this.getStmtsAndExpr(normalized_update));
   while_body.body = while_body.body.concat(normalized_test_copy.stmts); 
   while_stmt = window.esprima.delegate.createWhileStatement(
		normalized_test.expr, 
		while_body
	); 
	stmts.push(while_stmt);
	
	vars = normalized_init.vars.concat(normalized_test.vars); 
	vars = vars.concat(normalized_update.vars); 
	vars = vars.concat(normalized_body.vars);
	new_vars = normalized_init.new_vars.concat(normalized_test.new_vars); 
	new_vars = new_vars.concat(normalized_update.new_vars); 
	new_vars = new_vars.concat(normalized_body.new_vars);

	return {
      new_vars: new_vars, 
      vars: vars, 
      stmts: stmts		
	};
};

/*
 * Original Code: u++
 * <u = u+1; , u , \emptySet >  
 */
comp.normalizeUpdateExpr = function (update_expr) {
	var assignment, 
	    expr, 
	    left_expr, 
	    new_vars = [],
	    new_var_name, 
	    stmts = []; 	
	
	expr = $.extend(true, {}, update_expr.argument);
   if (update_expr.argument.type === 'MemberExpression') {
      new_var_name = this.createFreeVarName();
      new_vars.push(new_var_name);
      assignment = window.esprima.delegate.createAssignmentExpression(
      	'=', 
         window.esprima.delegate.createIdentifier(new_var_name), 
         $.extend(true, {}, expr));
      assignment = window.esprima.delegate.createExpressionStatement(assignment);
      stmts.push(assignment);
      left_expr = window.esprima.delegate.createIdentifier(new_var_name);
   } else {
      left_expr = $.extend(true, {}, expr);
   }
	 
	assignment = window.esprima.delegate.createAssignmentExpression(
		'=', 
		$.extend(true, {}, expr), 
		window.esprima.delegate.createBinaryExpression(
			update_expr.operator[0], 
			left_expr, 
			window.esprima.delegate.createLiteral2(1)
		)
	); 
	assignment = window.esprima.delegate.createExpressionStatement(assignment); 
	stmts.push(assignment);
	
	return {
		stmts: stmts,  
		expr: expr, 
		vars: [], 
		new_vars: new_vars
	};
};

/*
 * Original Code: for(p in e) { s }
 * N[e] = s_e, ê, V_e
 * N[s] = s', V'
 * Normalized Code: 
 * s_e
 * for(p in ê) {
 * 	s'
 * }
 */
comp.normalizeForInStmt = function (forin_stmt) {
	var body,
	    for_in_stmt, 
	    left,
	    new_vars, 
	    normalized_right, 
	    normalized_body, 
	    right, 
	    stmts, 
	    vars;
	
	normalized_right = this.normalize(forin_stmt.right, true); 
   normalized_body = this.normalize(forin_stmt.body);
    
   left = $.extend(true, {}, forin_stmt.left);
   right = normalized_right.expr; 
   body = normalized_body.stmts[0]; 
   for_in_stmt = window.esprima.delegate.createForInStatement(left, right, body); 
   
   stmts = normalized_right.stmts; 
   stmts.push(for_in_stmt); 
   vars = normalized_right.vars.concat(normalized_body.vars); 
   new_vars = normalized_right.new_vars.concat(normalized_body.new_vars);
   
   return {
   	vars: vars, 
   	new_vars: new_vars, 
   	stmts: stmts
   };
};

(function(){
	var i = 0; 
	function createFreeVarName() {
		return 'nvar_' + i++; 
	}
	comp.createFreeVarName = createFreeVarName; 
})();

comp.isSimple = function (expr) {
	var type; 
	type = expr.type; 
	if ((type === 'Identifier') || (type === 'Literal') || (type === 'ThisExpression')) {
		return true; 
	} else {
		return false; 
	}
};

comp.buildVarsDeclStmt = function (var_names) {
	var i,  
	    len, 
	    var_declarator,
	    var_declarators = [],
	    var_identifier;
	     
   for (i = 0, len = var_names.length; i < len; i++) {
   	var_identifier = window.esprima.delegate.createIdentifier(var_names[i]);
      var_declarator = window.esprima.delegate.createVariableDeclarator(var_identifier, null); 
      var_declarators.push(var_declarator);
   }
   
   if (len === 0) return null; 
	return window.esprima.delegate.createVariableDeclaration(var_declarators, "var");   
};

comp.turn2Literal = function (expr) {
   if (expr.type === 'Literal') {
   	return expr; 
   } else {
      return window.esprima.delegate.createLiteral2(expr.name);	
   }
}; 

comp.makeUnrestrainUpgds = function (vars) {
	var args, 
	    call_expr,
	    i, 
	    len;
	
	if (!vars || (vars.length === 0)) return null; 
	
	    
	args = []; 
	for (i = 0, len = vars.length; i < len; i++) {
		args[i] = window.esprima.delegate.createLiteral2(vars[i]); 
	}
	
   call_expr = window.esprima.delegate.createCallExpression(
   	window.esprima.delegate.createIdentifier('unrestrainUpgds'), 
   	args
   ); 
   call_expr = window.esprima.delegate.createExpressionStatement(call_expr); 
   return call_expr; 
}; 

comp.getStmtsAndExpr = function (normalized_stmt) {
	var expr_stmt, 
	    stmts; 
	    
	stmts = normalized_stmt.stmts; 
	if (expr_stmt = normalized_stmt.expr) {
		expr_stmt = window.esprima.delegate.createExpressionStatement(expr_stmt);
		stmts.push(expr_stmt);
	}
	return stmts; 
};


