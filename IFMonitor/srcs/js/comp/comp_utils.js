comp.utils = {};

comp.utils.getOriginalDeclarations = function (funlit_exp) {
   var body, original_vars_decls; 
   body = funlit_exp.body.body; 
   if ((body.length > 0) && (body[0].type === 'VariableDeclaration')) {
      original_vars_decls = $.extend(true, {}, body[0]); 
      return comp.utils.addShadowVarsDeclarations(original_vars_decls.declarations);
   } else {
      return comp.utils.addShadowVarsDeclarations([]); 
   }
};

comp.utils.getProgDeclarations = function(prog_exp) {
   var body = prog_exp.body, original_vars_decls; 
   if ((body.length > 0) && (body[0].type === 'VariableDeclaration')) {
      original_vars_decls = $.extend(true, {}, body[0]); 
   	  return comp.utils.addShadowVarsDeclarations(original_vars_decls.declarations, true);
   } else {
      return comp.utils.addShadowVarsDeclarations([], true);
   } 
};

// new_vars_to_string
comp.utils.varsToString = function (new_vars, with_var) {
   var i, len, str;
   str = "";  
   for (i = 0, len = new_vars.length; i < len; i++) {
      if(str !== '') str += ', ';  	 
      str += new_vars[i]; 
   }
   
   if (with_var) {
   	  if (str === "") {
   	  	 return null; 
   	  } else {
   	     return 'var ' + str;
   	  } 
   } else {
   	  return str;
   }
};


comp.utils.addShadowVarsDeclarations = function (declarations, init_pc) {
   var assign_lev_this_stmt, i, init_stmts = [], len, shadow_vars_decls = [], shadow_var_ident, str; 
   
   str = '{0} = {1}.lat.bot;';
   if(init_pc) {
      //$pc = $runtime.lat.bot;
      str = $.validator.format(str, comp.identifiers.consts.PC_IDENT, comp.identifiers.consts.RUNTIME_IDENT); 
      init_stmts.push(window.util.parseStmt(str));
      
   } else {
   	  //$pc_fun = $runtime.lat.bot;
   	  str = $.validator.format(str, comp.identifiers.consts.PC_FUN_IDENT, comp.identifiers.consts.RUNTIME_IDENT); 
      init_stmts.push(window.util.parseStmt(str));
      
      // declare $pc_fun
      shadow_vars_decls.push(window.esprima.delegate.createVariableDeclarator(
         window.esprima.delegate.createIdentifier(comp.identifiers.consts.PC_FUN_IDENT), null));
   }
      
   for (i = 0, len = declarations.length; i < len; i++) {
      shadow_var_ident = comp.identifiers.getShadowVar(declarations[i].id.name);
      
      shadow_vars_decls.push(window.esprima.delegate.createVariableDeclarator(
         window.esprima.delegate.createIdentifier(shadow_var_ident), null));
      
      //$lev_i = $pc; 
      str = '{0} = {1};';
      str = $.validator.format(str, shadow_var_ident, comp.identifiers.consts.PC_IDENT); 
      init_stmts.push(window.util.parseStmt(str));
   }
   
   declarations = declarations.concat(shadow_vars_decls);
   if (declarations.length > 0) {
      declarations = window.esprima.delegate.createVariableDeclaration(declarations, 'var');
      init_stmts.unshift(declarations);
   }
   return init_stmts; 
}; 
