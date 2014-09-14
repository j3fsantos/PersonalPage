sec_types = {}; 

sec_types.conds = {}; 

sec_types.conds.makeCondSet = function (element, cond) {
   var cond_set = [];  
   if (element) { 
      cond_set.push({
         element: element, 
         cond: cond});
   }
   return cond_set; 
}; 

sec_types.conds.when = function (left_cond_set, right_cond_set, subtype_fun) {
   var cond, conds, i, j, left_side, right_side;
   conds = []; 
   for (i = 0; i < left_cond_set.length; i++) {
      for (j = 0; j < right_cond_set.length; j++) {
         left_side = left_cond_set[i]; 
         right_side = right_cond_set[j]; 
         if (subtype_fun(left_side.element, right_side.element)) {
            conds.push(this.buildBinaryCond('&&', left_side.cond, right_side.cond));
         }
      }
   }
   if (!conds.length) return false;
   cond = this.buildMultipleCond('||', conds);
   cond = this.simplifyCond(cond); 
   return cond;    
};

sec_types.conds.projection = function (triples, prop) {
   var i, len, pairs; 
   pairs = [];   
   for (i = 0, len = triples.length; i < len; i++) {
      pairs.push({
         element: triples[i][prop],
         cond: triples[i].cond
      });
   }
   return pairs; 
};

sec_types.conds.levLog = function (type_set) {
   var i, len, level_set; 
   
   level_set = []; 
   for (i = 0, len = type_set.length; i < len; i++) {
      level_set.push({
         element: type_set[i].element.level, 
         cond: type_set[i].cond});
   }
   return level_set; 
}; 

sec_types.conds.levExp = function (type_set, lev_set) {
   var i, j, new_cond, new_type, new_type_set;
   
   new_type_set = []; 
   for (i = 0; i < type_set.length; i++) {
      for (j = 0; j < lev_set.length; j++) {
         new_type = $.extend(true, {}, type_set[i].element); 
         new_type.level = lat.lub(new_type.level, lev_set[j].element);
         new_cond = this.buildBinaryCond('&&', type_set[i].cond, lev_set[j].cond); 
         new_cond = this.simplifyCond(new_cond); 
         new_type_set.push({
            element: new_type, 
            cond: new_cond
         }); 
      }
   }
   
   return new_type_set; 
}; 

sec_types.conds.floor = function (type_set, type_name) {
   var i, j, new_type_set; 
   
   new_type_set = []; 
   for (i = 0; i < type_set.length; i++) {
      if (type_set[i].element.type_name === type_name) {
         new_type_set.push(type_set[i]);
      }
   }
   
   return new_type_set; 
}; 

sec_types.conds.condExp = function (cond_set, cond) {
   var cond_aux, i, len; 
   
   for (i = 0, len = cond_set.length; i < len; i++) {
      cond_aux = sec_types.conds.buildBinaryCond('&&', $.extend(true, {}, cond), cond_set[i].cond); 
      cond_aux = this.simplifyCond(cond_aux); 
      cond_set[i].cond = cond_aux;    
   }
};

sec_types.conds.objLookup = function (obj_type, prop_expr_st, prop_set, obj_cond) {
   var cond, obj_type_domain, new_prop_set, prop, prop_var, triples;
   
   // Statically, we know the property that is being accessed
   if (prop_expr_st.type === 'Literal') {
      prop = prop_expr_st.value; 
      if (obj_type.row_type.hasOwnProperty(prop)) {
         return [{
            level: obj_type.row_type[prop].level, 
            type: obj_type.row_type[prop].type, 
            cond: obj_cond
         }]; 
      } 
      if (obj_type.star_type) {
         return [{
            level: obj_type.star_level, 
            type: obj_type.star_type, 
            cond: obj_cond
         }];
      }
      return false; 
   }
   
   // We don't know the property that is being accessed
   triples = []; 
   prop_var = prop_expr_st.name; 
   for (prop in obj_type.row_type) {
      if (obj_type.row_type.hasOwnProperty(prop) && this.belongsTo(prop, prop_set)) {
         cond = this.buildElementaryCond(prop_var, [ prop ]);
         cond = this.buildBinaryCond('&&', obj_cond, cond);  
         triples.push({
            level: obj_type.row_type[prop].level, 
            type: obj_type.row_type[prop].type, 
            cond: cond});
      } 
   }
   
   if (!obj_type.star_type) {
      return triples;
   } 
   
   obj_type_domain =  sec_types.objTypeDomain(obj_type);
   if (!prop_set.all_strings) {
      new_prop_set = this.setSubtract(prop_set.properties, obj_type_domain);
      if (new_prop_set.length === 0) return triples; 
      cond = this.buildElementaryCond(prop_var, new_prop_set);
      cond = this.buildBinaryCond('&&', obj_cond, cond); 
      triples.push({
         level: obj_type.star_level, 
         type: obj_type.star_type, 
         cond: cond});
   } else {
      cond = this.buildElementaryCond(prop_var, obj_type_domain);
      cond = this.buildUnaryCond("!", cond);
      cond = this.buildBinaryCond('&&', obj_cond, cond); 
      triples.push({
         level: obj_type.star_level, 
         type: obj_type.star_type, 
         cond: cond
      }); 
   }
   return triples; 
}; 

sec_types.conds.objSetLookup = function (obj_type_set, prop_expr_st, prop_set) {
   var i, len, triples = []; 
   
   for (i = 0, len = obj_type_set.length; i < len; i++) {
     triples = triples.concat(this.objLookup(obj_type_set[i].element, prop_expr_st, prop_set, obj_type_set[i].cond));
   }
   
   return triples; 
};


sec_types.conds.genFun = function (left_cond_set, right_cond_set, lub_fun) {
   var cond_set, i, j, left_side, new_cond, right_side;
   cond_set = [];
   for (i = 0; i < left_cond_set.length; i++) {
      for (j = 0; j < right_cond_set.length; j++) {
         left_side = left_cond_set[i]; 
         right_side = right_cond_set[j]; 
         new_element = lub_fun(left_side.element, right_side.element); 
         if ((new_element != null) || (new_element != undefined)) {
            new_cond = this.buildBinaryCond('&&', left_side.cond, right_side.cond); 
            new_cond = this.simplifyCond(new_cond); 
            cond_set.push({
               element: new_element, 
               cond: new_cond
            });
         } 
      }  	
   }
   return cond_set;       
};

sec_types.conds.unwrapType = function (wrapped_type) {
   if ((wrapped_type.length != 1) && (wrappped_type[0].cond != 'true')){
      throw new Error ('Typing Error: unwrappable type'); 
   }
   
   return wrapped_type[0].element; 
}; 


sec_types.isSubType = function (left_type, right_type) {
   if (left_type.type_name != right_type.type_name) return false;
   
   if (left_type.type_name == 'PRIM') {
      if (right_type.type_name !== 'PRIM') return false;
      return lat.leq(left_type.level, right_type.level); 
   } else if (left_type.type_name == 'OBJ') {
      if (right_type.type_name !== 'OBJ') return false;
      if (left_type.type_var != right_type.type_var) return false;
      if (!utils.equals(left_type.row_type, right_type.row_type)) return false; 
      if (!utils.equals(left_type.star_type, right_type.star_type)) return false; 
      if (!lat.equals(left_type.star_level, right_type.star_level)) return false; 
      return lat.leq(left_type.level, right_type.level);      
   } else if (left_type.type_name == 'FUN') {
      if (right_type.type_name !== 'FUN') return false;
      if (!utils.equals(left_type.this_type, right_type.this_type)) return false;
      if (!utils.equals(left_type.parameter_types, right_type.parameter_types)) return false;
      if (!utils.equals(left_type.ret_type, right_type.ret_type)) return false;
      if (!lat.equals(left_type.context_level, right_type.context_level)) return false;
      return lat.leq(left_type.level, right_type.level);
   }
   return false; 
}; 

sec_types.lubType = function (left_type, right_type) {
   var new_type; 
   if (left_type.type_name != right_type.type_name) return false;
   
   if (left_type.type_name == 'PRIM') {
      // lub between prim types
      if (right_type.type_name !== 'PRIM') return false;
      return sec_types.buildPrimType(lat.lub(left_type.level, right_type.level)); 
   } else if (left_type.type_name == 'OBJ') {
      // lub between obj types
      if (right_type.type_name !== 'OBJ') return false;
      if (left_type.type_var != right_type.type_var) return false;
      if (!utils.equals(left_type.row_type, right_type.row_type)) return false; 
      if (!utils.equals(left_type.star_type, right_type.star_type)) return false; 
      if (!lat.equals(left_type.star_level, right_type.star_level)) return false; 
      new_type = $.extend(true, {}, left_type); 
      new_type.level = lat.lub(left_type.level, right_type.level);
      return new_type;       
   } else if (left_type.type_name == 'FUN') {
      // lub between fun types
      if (right_type.type_name !== 'FUN') return false;
      if (!utils.equals(left_type.this_type, right_type.this_type)) return false;
      if (!utils.equals(left_type.parameter_types, right_type.parameter_types)) return false;
      if (!utils.equals(left_type.ret_type, right_type.ret_type)) return false;
      if (!lat.equals(left_type.context_level, right_type.context_level)) return false;
      new_type = $.extend(true, {}, left_type);
      new_type.level = lat.lub(left_type.level, right_type.level);
      return new_type;
   }
   return false;
}; 


/*
 * Type Constructors
 */
sec_types.buildPrimType = function (level) {
   return {
      type_name: 'PRIM',
      level: level
   };
};

sec_types.buildObjType = function (type_var, row_type, star_level, star_type, level) {
   return {
      type_name: 'OBJ', 
      type_var: type_var, 
      row_type: row_type,
      star_level: star_level, 
      star_type: star_type, 
      level: level
   }; 
};

sec_types.buildFunType = function (this_type, parameter_types, context_level, ret_type, level) {
   return {
      type_name: 'FUN', 
      this_type: this_type, 
      parameter_types: parameter_types, 
      context_level: context_level, 
      ret_type: ret_type, 
      level: level
   }; 
};

sec_types.objTypeDomain = function (obj_type) {
   var prop, props; 
   props = []; 
   for (prop in obj_type.row_type) {
      if (obj_type.row_type.hasOwnProperty(prop)) {
         props.push(prop);
      } 
   }
   return props; 
}; 


/*
 * Print methods
 */
sec_types.printType = function (type) {
   var fun, redirector, str; 
   
   redirector = {
      PRIM: sec_types.printPrimType, 
      OBJ: sec_types.printObjType, 
      FUN: sec_types.printFunType
   };
   
   fun = redirector[type.type_name];
   str = fun.call(sec_types, type);
   
   return str; 
};

sec_types.printPrimType = function (type) {
	return 'PRIM^{' + lat.print(type.level) + '}';
};

sec_types.printObjType = function (type) {
	var i, prop, prop_level, prop_type, str, type; 
	
	str = 'OBJ<' + type.type_var + '><';
	i = 0;
	
	for (prop in type.row_type){
		if (type.row_type.hasOwnProperty(prop)) {
		   prop_level = type.row_type[prop].level; 
		   prop_type = type.row_type[prop].type; 
		   
		   if (i > 0) str += ', ';
		   str += prop +'^{' + lat.print(prop_level) + '}: ' + sec_types.printType(prop_type); 	
		   
		   i++; 
		}
	}
	
	if (type.star_type) {
		if (i > 0) str += ', ';
		str += '*^{' + lat.print(type.star_level) + '}: ' + sec_types.printType(type.star_type);
	}
	
	str += '>^{' + lat.print(type.level) + '}';
	return str; 
};

sec_types.printFunType = function (type) {
   var i, str; 
   
   str = 'FUN<'; 
   str += sec_types.printType(type.this_type);
   str += '.(';
   
   for (i = 0; i < type.parameter_types.length; i++) {
   	  if (i > 0) str += ', ';
      str += sec_types.printType(type.parameter_types[i]);	
   }
   
   str += ') ->^{ ' + lat.print(type.level) + '} ';
   
   str += sec_types.printType(type.ret_type);
   str += '>^{' + lat.print(type.level) + '}';
   return str; 
};

sec_types.conds.belongsTo = function (prop, prop_set) {
   if (prop_set.all_strings) return true; 

   for (var i = 0, len = prop_set.properties.length; i < len; i++) {
       if (prop_set.properties[i] === prop) return true;
   }
   return false; 
};

sec_types.conds.setSubtract = function (left_set, right_set) {
   var i, len, new_set, prop, table;  
   
   table = {}; 
   for (i = 0, len = right_set.length; i < len; i++) {
      table[right_set[i]] = true; 
   }
 
   new_set = [];   
   for (i = 0, len = left_set.length; i < len; i++) {
      if (table.hasOwnProperty(left_set[i])) continue; 
      new_set.push(left_set[i]);
   }
   return new_set; 
};


/*
 * Formula Constructors
 */
sec_types.conds.isUnaryOperator = function (op) {
   return op === '!'; 
};

sec_types.conds.buildUnaryCond = function (operator, arg) {
   return {
      operator: operator,
      arg: arg
   }; 
};

sec_types.conds.buildBinaryCond = function (operator, left_arg, right_arg) {
   return {
      operator: operator,
      left: left_arg, 
      right: right_arg
   }; 
};

sec_types.conds.buildElementaryCond = function (var_name, property_set) {
   return {
      var_name: var_name, 
      property_set: property_set
   }; 
}; 


/*
 * Formula Testers
 */
sec_types.conds.isUnaryCond = function (cond) {
   return cond.hasOwnProperty('arg'); 
};

sec_types.conds.isBinaryCond = function (cond) {
   return cond.hasOwnProperty('left'); 
};

sec_types.conds.isElementaryCond = function (cond) {
   return cond.hasOwnProperty('var_name'); 
};

sec_types.conds.getCondType = function (cond) {
   if (cond.hasOwnProperty('arg')) return 'UNARY';
   
   if (cond.hasOwnProperty('left')) return 'BINARY';
   
   if (cond.hasOwnProperty('var_name')) return 'ELEMENTARY';
   
   throw new Error ('Illegal Runtime Assertion');
};


/*
 * Formulas: Auxiliar Constructors
 */
sec_types.conds.buildMultipleCond = function (operator, args) {
   var cond, i, len; 
   if (!args || (args.length === 0)) return 'true';
   cond = args[0]; 
   for (i = 1, len = args.length; i < len; i++) 
      cond = sec_types.conds.buildBinaryCond(operator, cond, args[i]);  
   return cond; 
};

sec_types.conds.simplifyCond = function (cond) {
   var left_side, new_cond, right_side; 
 
   if (cond === 'true') return cond;  
   if (cond.hasOwnProperty('var_name')) return $.extend(true, {}, cond);
   
   // unary condition
   if (this.isUnaryOperator(cond.operator)) {
      new_cond = this.simplifyCond(cond.arg);
      return {
         operator: cond.operator,
         arg: new_cond
      }; 
   }
   
   // binary condition
   left_side = this.simplifyCond(cond.left); 
   right_side = this.simplifyCond(cond.right); 
   
   // or
   if (cond.operator === '||') {
      if ((left_side === 'true') || (right_side === 'true')) {
         return 'true';
      } else {
         return {
            operator: '||', 
            left: left_side, 
            right: right_side
         };
      }
   }
   
   // and
   if (left_side === 'true') return right_side;
   if (right_side === 'true') return left_side; 
 
   return {
      operator: '&&', 
      left: left_side, 
      right: right_side
   };
   
};

/*
 * Printing Formulas
 */
sec_types.conds.printUnaryCond = function (cond) {
   var str; 
   
   str = cond.operator + '(' + sec_types.conds.printCond(cond.arg) + ')'; 
   return str;
}; 

sec_types.conds.printBinaryCond = function (cond) {
   var str, str_left, str_right; 
   
   str_left = sec_types.conds.printCond(cond.left); 
   str_right = sec_types.conds.printCond(cond.right); 
   
   str_left = sec_types.conds.isBinaryCond(cond.left) ? str_left = '(' + str_left + ')' : str_left; 
   str_right = sec_types.conds.isBinaryCond(cond.right) ? str_right = '(' + str_right + ')' : str_right;
  
   str = str_left + ' ' + cond.operator + ' ' + str_right; 
   return str;
}; 

sec_types.conds.printElementaryCond = function (cond) {
   var prop_set_str, str, var_name; 
  
   var_name = cond.var_name; 
   prop_set_str = sec_types.conds.printPropertySet(cond.property_set);
   str = var_name + ' in ' + prop_set_str; 
   return str;
}; 

sec_types.conds.printCond = function (cond) {
   var cond_type, fun, printing_functions, str; 
   
   if ((typeof cond === 'string') && (cond === 'true')) return 'true';
   
   cond_type = sec_types.conds.getCondType(cond); 
   
   printing_functions = {
      UNARY:   sec_types.conds.printUnaryCond, 
      BINARY: sec_types.conds.printBinaryCond, 
      ELEMENTARY: sec_types.conds.printElementaryCond
   };
   
   fun = printing_functions[cond_type];
   str = fun.call(this, cond);
   return str; 
};

sec_types.conds.printPropertySet = function (property_set) {
   var i, len, str; 
   
   if (property_set.length === 0) return '[]';
   
   str = '{'; 
   str += property_set[0];
   for (i = 1, len = property_set.length; i < len; i++) {
      str += ', ';
      str += property_set[i]; 
   }
   str += '}';
   return str;
};


/*
 * Generating ASTs for runtime assertions!
 */
sec_types.buildPropertyPredicateST = function (property_predicate) {
   var operator, property_set_str, ret_expr_st, str;
   
   property_set_str = this.buildPropertySetArrayStr(property_predicate.property_set);
   str = '_runtime.in({0}, {1})';
   str = $.validator.format(str, property_predicate.var_name, property_set_str);
   ret_expr_st = utils.parseExpr(str); 
   return ret_expr_st; 
};

sec_types.buildPropertySetArrayStr = function (property_set) {
   var i, len, str; 
   
   if (property_set.length === 0) return '[]';
   
   str = '['; 
   str += '\''+property_set[0]+'\'';
   for (i = 1, len = property_set.length; i < len; i++) {
      str += ', ';
      str += '\''+property_set[i]+'\''; 
   }
   str += ']';
   return str;
};

sec_types.buildCondST = function (cond) {
   var arg_st, cond_st, left_side_st, right_side_st; 
   
   if (cond === 'true') {
      return window.esprima.delegate.createLiteral2(true); 
   } 
   
   if (cond.hasOwnProperty('var_name') && (cond.property_set != this.STR)) {  
      return this.buildPropertyPredicateST(cond);
   }
   
   if (cond.hasOwnProperty('var_name') && (cond.property_set === this.STR)) {
      return 'true';
   }
   
   if (this.conds.isUnaryOperator(cond.operator)) {
      arg_st = this.buildCondST(cond.arg); 
      cond_st = window.esprima.delegate.createUnaryExpression(cond.operator, arg_st); 
      return cond_st; 
   }
   
   left_side_st = this.buildCondST(cond.left); 
   right_side_st = this.buildCondST(cond.right); 
   cond_st = window.esprima.delegate.createBinaryExpression(cond.operator, left_side_st, right_side_st); 
   return cond_st;
}; 

/*
 * Print Type Set and Level Set
 */
sec_types.conds.printTypeSet = function (type_set) {
	var i, str;
	 
	str = ''; 
	for (i = 0; i < type_set.length; i++) {
	   if (i > 0) {
	      str += '\n';
	   }
	   str += sec_types.printType(type_set[i].element); 
	   str += ' ? ';
	   str += sec_types.conds.printCond(type_set[i].cond);
	}
	return str; 
};

sec_types.conds.printLevelSet = function (level_set) {
	var i, str;
	 
	str = ''; 
	for (i = 0; i < level_set.length; i++) {
	   if (i > 0) {
	      str += '\n';
	   }
	   str += lat.print(level_set[i].element); 
	   str += ' ? ';
	   str += sec_types.conds.printCond(level_set[i].cond);
	}
	return str; 
};










