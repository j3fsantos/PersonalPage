comp.utils = {};

comp.utils.isSimpleCallExp = function(call_exp) { 
	var type = call_exp.type, 
	    fun_type = call_exp.callee.type;
	return (type === esprima.Syntax.CallExpression) && (fun_type === esprima.Syntax.Identifier); 
};

comp.utils.buildArgsArrayExpr = function (params) {
   var i, 
       len, 
       literals_arr = []; 
       
   for (i = 0, len = params.length; i < len; i++) {
      literals_arr.push(window.esprima.delegate.createLiteral2(params[i].name));   	 
   }
   
   return esprima.delegate.createArrayExpression(literals_arr);   
};

comp.utils.buildDeclVarsArrayExpr = function (decl_stmt) {
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


comp.utils.getOriginalDeclarations = function (funlit_exp) {
   var body, original_vars_decls; 
   body = funlit_exp.body.body; 
   if ((body.length > 0) && (body[0].type === 'VariableDeclaration')) {
      original_vars_decls = $.extend(true, {}, body[0]); 
      return comp.utils.addShadowVarsDeclarations(original_vars_decls);
   } else {
      return []; 
   }
};

comp.utils.getProgDeclarations = function(prog_exp) {
   var body = prog_exp.body, original_vars_decls; 
   if ((body.length > 0) && (body[0].type === 'VariableDeclaration')) {
      original_vars_decls = $.extend(true, {}, body[0]); 
   	  return comp.utils.addShadowVarsDeclarations(original_vars_decls, true);
   } else {
      return [];
   } 
};


// new_vars_to_string
comp.utils.newVarsToString = function (new_vars) {
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
			continue; 
		} if (current_var.hasOwnProperty('pc_holder')) {
			new_vars_str += current_var.pc_holder;
			continue;  
		} else if (current_var.hasOwnProperty('lev_holder')) {
		    new_vars_str += current_var.lev_holder;
		    continue;  
		} else {
		   throw new Error('The generated new var has an unknown type');
		}
	}
	
	if (new_vars_str !== '') {
	   return 'var '+ comp.identifiers.getShadowVar('this') + ', ' + new_vars_str;
	} else {
	   return 'var '+ comp.identifiers.getShadowVar('this');
	} 
}; 



comp.utils.getAllIdentifiers = function (expr_st) {
   switch (expr_st.type) {
      case 'Literal': 
         return []; 
      case 'Identifier': 
	     return [ expr_st.name ];   
      case 'ThisExpression': 
         return [];
      case 'BinaryExpression': 
	     return comp.utils.getAllIdentifiers(expr_st.left).concat(comp.utils.getAllIdentifiers(expr_st.right)); 
      case 'UnaryExpression': 
		 return comp.utils.getAllIndetifiers(expr_st.argument);
      case 'LogicalExpression': 
         return comp.utils.getAllIdentifiers(expr_st.left).concat(comp.utils.getAllIdentifiers(expr_st.right)); 
	  default: throw new Error('Illegal Simple Expression'); 
   }
};


comp.utils.addShadowVarsDeclarations = function (vars_decls, init_pc) {
   var assign_lev_this_stmt, i, init_stmts = [], len, shadow_vars_decls = [], shadow_var_ident, str; 
   
   if(init_pc) {
      //_pc = _runtime.lat.bot;
      str = '{0} = {1}.lat.bot;';
      str = $.validator.format(str, comp.identifiers.consts.PC_IDENT, comp.identifiers.consts.RUNTIME_IDENT); 
      init_stmts.push(window.util.parseStmt(str));
   }
   
   // _lev_this = _pc; 
   str = '{0} = {1};';
   str = $.validator.format(str, 
   comp.identifiers.getShadowVar('this'), 
   comp.identifiers.consts.PC_IDENT); 
   assign_lev_this_stmt = window.util.parseStmt(str);
   init_stmts.push(assign_lev_this_stmt); 
   
   for (i = 0, len = vars_decls.declarations.length; i < len; i++) {
      shadow_var_ident = comp.identifiers.getShadowVar(vars_decls.declarations[i].id.name);
      
      shadow_vars_decls.push(window.esprima.delegate.createVariableDeclarator(
         window.esprima.delegate.createIdentifier(shadow_var_ident), null));
      
      //_lev_i = _pc; 
      str = '{0} = {1};';
      str = $.validator.format(str, shadow_var_ident, comp.identifiers.consts.PC_IDENT); 
      init_stmts.push(window.util.parseStmt(str));
   }
   
   vars_decls.declarations = vars_decls.declarations.concat(shadow_vars_decls);
   init_stmts.unshift(vars_decls);
   return init_stmts; 
}; 

