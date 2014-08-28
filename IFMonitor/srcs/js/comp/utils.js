(function(exports) {
	
   option = {
      format : {
         quotes : 'single',
         indent : {
            style : '\t'
         }
      }
   };

   function deepCopy(obj) {
      if (Object.prototype.toString.call(obj) === '[object Array]') {
         var out = [], i = 0, len = obj.length;
         for (; i < len; i++) {
            out[i] = arguments.callee(obj[i]);
         }
         return out;
      }
      if ( typeof obj === 'object') {
         var out = {}, i;
         for (i in obj ) {
            out[i] = arguments.callee(obj[i]);
         }
         return out;
      }
      return obj;
   }

   function printExprST(expr_st) {
      var expr_str, last_colon, prog_st, prog_str;
      prog_st = esprima.delegate.createProgram([
      	esprima.delegate.createExpressionStatement(expr_st)
      ]);
      prog_str = window.escodegen.generate(prog_st, option);
      last_colon = prog_str.lastIndexOf(';');
      expr_str = prog_str.substr(0, last_colon); 
      return expr_str; 
      
   }
   
   function printStmtST(stmt_st) {
   	var stmt_str, prog_st; 
   	prog_st = esprima.delegate.createProgram([
   		stmt_st
   	]);
   	stmt_str = window.escodegen.generate(prog_st, option); 
   	return stmt_str; 
   }
   
   function printST(st) { 
   	if (esprima.delegate.isExpr(st)) {
   		return this.printExprST(st);
   	} else {
   		return this.printStmtST(st); 
   	}
   }
   
   function parseStmt(str) {
   	var prog_st; 
   	prog_st = window.esprima.parse(str); 
   	return prog_st.body[0];
   }

	function parseExpr(str) {
		var prog_st; 
		prog_st = window.esprima.parse(str); 
		return prog_st.body[0].expression; 
	}
	
	function getFunctionName(f) {
		var i, len, str, substrings; 
		str = f.toString(); 
		substrings = str.split(' ');
		if ((typeof f) === 'function') { 
         str = substrings[1];
         substrings = str.split('(');
         str = substrings[0];
         return str;
      } else {
      	for (i = 0, len = substrings.length; i < len; i++) {
      		if (substrings[i] === 'function') {
      			i++; 
      			break; 
      		}
      	}
      	if (i === len) {
      		return ''; 
      	} else {
      		str = substrings[i]; 
      		substrings = str.split('(');
      		str = substrings[0];
      		return str;
      	}
      } 
	} 
	
	function addReturnToLastExpressionStatement(f) {
	   stmts = f.body.body;
	   last_index = stmts.length - 1; 
	   last_stmt =  stmts[last_index];
	   if (last_stmt.type === 'ExpressionStatement') {
	      stmts[last_index] = window.esprima.delegate.createReturnStatement(last_stmt.expression);	
	   } else {
	      stmts.push(
	      	window.esprima.createReturnStatement(
	            window.esprima.delegate.createIdentifier('undefined'))); 	
	   }
	}


   exports.util = {};
   exports.util.deepCopy = deepCopy;
   exports.util.printExprST = printExprST; 
   exports.util.printStmtST = printStmtST; 
   exports.util.printST = printST; 
   exports.util.parseStmt = parseStmt; 
   exports.util.parseExpr = parseExpr; 
   exports.util.getFunctionName = getFunctionName; 
   exports.util.addReturnToLastExpressionStatement = addReturnToLastExpressionStatement;
   
})(window);
