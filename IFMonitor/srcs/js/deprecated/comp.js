/*
 * 
 * if(((typeof ê_1) !== 'string') && ((typeof ê_2) === 'object')) {
 *    // C[ê_1.toString()] = s',  _val_i, _lev_i
 * } else {
 * 	_val_i = ê_1; 
 *    _lev_i = C_l[ê_1]; 
 * }
 */
comp.processPropertyUpdateExpAux = function (var_identifier_str, val_lev_vars) {
   var assignment_expr_aux,
       call_toString_expr,
       compiled_call_toString_expr, 
       compiled_call_toString_expr_str,  
       str; 
       
   str = 'if (((typeof {0}) !== \'string\') && ((typeof {0}) === \'object\')) { } else { }';  
   str = $.validator.format(str, var_identifier_str);
   if_statement_st = window.util.parseStmt(str);
   
   // then case 
   // ..........................................................................................................
   str = '{0}.toString()'; 
   str = $.validator.format(str, var_identifier_str);
   call_toString_expr = window.util.parseExpr(str);
   compiled_call_toString_expr = this.processMethodCallExp(call_toString_expr, val_lev_vars).compiled_stmts[0];
   compiled_call_toString_expr_str = this.util.printStmtST(compiled_call_toString_expr); 
    
   // else case
   // ...........................................................................................................
   
   // _val_i = ê_1;
   assignment_expr_aux = window.esprima.delegate.createAssignmentExpression(
	   '=', 
		window.esprima.delegate.createIdentifier(val_lev_vars.val_var), 
		window.esprima.delegate.createIdentifier(var_identifier_str)
	);
	else_assignment_1 = window.esprima.delegate.createExpressionStatement(assignment_expr_aux);
    
   // _lev_i = ê_1; 
    
}; 