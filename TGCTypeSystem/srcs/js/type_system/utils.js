utils = {}; 

utils.option = {
  format : {
     quotes : 'single',
     indent : { style : '\t' }
  }
};

utils.belongsTo = function (member, arr) {
   for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === member) return true; 
   }
   
   return false; 
}; 

utils.Set = function () {}; 

utils.Set.prototype.union = function (set) {
   var prop; 
   for (prop in set) {
      if (set.hasOwnProperty(prop)) this[prop] = true; 
   }
};

utils.Set.prototype.addMember = function (member) {
   this[member] = true; 
};  

utils.Set.prototype.removeMember = function (member) {
   if (this.hasOwnProperty(member)) {
      delete this[member]; 
   } 
};

utils.Set.prototype.contains = function (el) {
   return this[el];
}; 

utils.equals = function (obj1, obj2) {
   var prop; 
   
   if ((typeof obj1) !== (typeof obj2)) {
      return false; 
   }
   
   if ((typeof obj1) !== 'object') {
      return obj1 === obj2; 
   }
   
   if (obj1 instanceof Array) {
      return this.equalsArray(obj1, obj2);
   }
   
   if ((obj1 === null) && (obj2 === null)) {
      return true; 
   }
   
   for (prop in obj1) {
      if (obj1.hasOwnProperty(prop)) {
         if (!obj2.hasOwnProperty(prop) || !this.equals(obj1[prop], obj2[prop])) {
            return false;
         }
      }
   }
   
   for (prop in obj2) {
      if (obj2.hasOwnProperty(prop) && !obj1.hasOwnProperty(prop)) {
         return false; 
      }
   }
   
   return true; 
}; 


utils.equalsArray = function (obj1, obj2) {
   var i, len; 
   
   if ((typeof obj1 !== 'object') || (typeof obj2 !== 'object')) return false; 
   if (!((obj1 instanceof Array) && (obj2 instanceof Array))) return false; 
   
   if (obj1.length !== obj2.length) return false; 
   
   for (i = 0, len = obj1.length; i < len; i++) {
      if(!this.equals(obj1[i], obj2[i])) return false; 
   }
   
   return true;
}; 

utils.getProgDeclarations = function (prog_exp) {
   var body = prog_exp.body, original_vars_decl; 
   if ((body.length > 0) && (body[0].type === 'VariableDeclaration')) {
      original_vars_decl = $.extend(true, {}, body[0]); 
   	  return original_vars_decl;
   } else {
      return null;
   } 
};

utils.arraySubtraction = function (arr1, arr2) {
   var arr, i, len, obj, prop; 
   
   obj = {}; 
   for (i = 0, len = arr1.length; i < len; i++) {
      obj[arr1[i]] = 1; 
   }

   for (i = 0, len = arr2.length; i < len; i++) {
      if (obj[arr2[i]]) {
         obj[arr2[i]] = 0;
      }
   }
   
   arr = [];
   for (prop in obj) {
      if (obj.hasOwnProp(prop) && obj[prop]) arr.push(prop); 
   }
   
   return arr; 
};

utils.arrayIntersection = function (arr1, arr2) {
   var arr, i, len, obj, prop; 
   
   obj = {}; 
   for (i = 0, len = arr1.length; i < len; i++) {
      obj[arr1[i]] = 0; 
   }

   for (i = 0, len = arr2.length; i < len; i++) {
      if (obj[arr2[i]]) {
         obj[arr2[i]] = 1;
      }
   }
   
   arr = [];
   for (prop in obj) {
      if (obj.hasOwnProp(prop) && obj[prop]) arr.push(prop); 
   }
   
   return arr; 
}; 


utils.parseStmt = function (str) {
   var prog_st; 
   prog_st = window.esprima.parse(str); 
   return prog_st.body[0];
};

utils.parseExpr = function (str) {
   var prog_st; 
   prog_st = window.esprima.parse(str); 
   return prog_st.body[0].expression; 
};

utils.printExprST = function (expr_st) {
   var expr_str, last_colon, prog_st, prog_str;
   
   prog_st = esprima.delegate.createProgram([
      esprima.delegate.createExpressionStatement(expr_st)
   ]);
   prog_str = window.escodegen.generate(prog_st, utils.option);
   last_colon = prog_str.lastIndexOf(';');
   expr_str = prog_str.substr(0, last_colon); 
   
   return expr_str;    
};
   
utils.printStmtST = function (stmt_st) {
   var stmt_str, prog_st; 
   
   prog_st = esprima.delegate.createProgram([
   		stmt_st
   ]);
   stmt_str = window.escodegen.generate(prog_st, utils.option); 

   return stmt_str; 
};

