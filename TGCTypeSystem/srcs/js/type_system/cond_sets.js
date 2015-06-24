sec_types = {}; 

sec_types.this_prop = 'this_prop';
sec_types.ret_prop = 'ret_prop';
sec_types.my_proto = 'my_proto';
sec_types.conds = {}; 
sec_types.original_pc_level = 'original_pc_level';
sec_types.dynamic_type = '#dynamic';


sec_types.isPropInObjTypeDomain = function (type_o, prop) {
	if (prop === '__proto__') {
		prop = sec_types.my_proto; 
	}
	
    return type_o.row_type.hasOwnProperty(prop) || (type_o.star_type != null); 
};


sec_types.getTypeObjProp = function (type_o, prop) {
	var ret_type, type; 
	
	if (!sec_types.isPropInObjTypeDomain(type_o, prop)) {
	   return false; 
	}
	
	if (prop === '__proto__') prop = sec_types.my_proto; 
	
	if (type_o.row_type.hasOwnProperty(prop)) {
	   type = type_o.row_type[prop].type;	
	} else {
	   type = type_o.star_type;
	}
	 
	ret_type = sec_types.substitute(type, type_o.type_var, type_o);
	return ret_type;
};

sec_types.getLevelObjProp = function (type_o, prop) {
	var level; 
	
	if (!sec_types.isPropInObjTypeDomain(type_o, prop)) {
	   return false; 
	}
	
	if (prop === '__proto__') prop = sec_types.my_proto; 
	
	if (type_o.row_type.hasOwnProperty(prop)) {
	   level = type_o.row_type[prop].level; 	
	} else {
	   level = type_o.star_level;
	}
	 
	return level;  
};

sec_types.getLevelObjStar = function (type_o) {
	var ret_type, type; 
	
	if (!type_o.star_type) {
	   return false; 
	}
	
	type = type_o.star_type; 
	ret_type = sec_types.substitute(type, type_o.type_var, type_o);
	return ret_type; 
};

sec_types.getTypeObjStar = function (type_o) {
	var ret_type, type; 
	
	if (!type_o.star_type) {
	   return false; 
	}
	
	type = type_o.star_type; 
	ret_type = sec_types.substitute(type, type_o.type_var, type_o);
	return ret_type; 
};

sec_types.getTypeProtoChainProp = function (type_o, prop) {
	var proto_type, ret_type, aux_type;
	
	if (sec_types.isPropInObjTypeDomain(type_o, prop) && type_o.row_type[sec_types.my_proto]) {
		ret_type = sec_types.getTypeObjProp(type_o, prop);
		
		// proto chain type
		proto_type = type_o.row_type[sec_types.my_proto].type;
		aux_type = sec_types.getTypeProtoChainProp(proto_type, prop);
		
		// Lub
		ret_type = sec_types.lubType(ret_type, aux_type);
		return ret_type; 
	} else if (type_o.row_type[sec_types.my_proto]) {
		// Proto + !Field
		proto_type = type_o.row_type[sec_types.my_proto].type;
		ret_type = sec_types.getTypeProtoChainProp(proto_type, prop); 
		return ret_type; 
		//		
	} else if (sec_types.isPropInObjTypeDomain(type_o, prop)) {
		// Field
		return ret_type = sec_types.getTypeObjProp(type_o, prop);
		//
	} else {
		return null; 
	}
	
};

sec_types.getLevelProtoChainProp = function (type_o, prop) {
	var proto_type, ret_lev, aux_lev;
	
	if (sec_types.isPropInObjTypeDomain(type_o, prop) && type_o.row_type[sec_types.my_proto]) {
		ret_lev = sec_types.getLevelObjProp(type_o, prop);
		
		// proto chain type
		proto_type = type_o.row_type[sec_types.my_proto].type;
		aux_lev = sec_types.getLevelProtoChainProp(proto_type, prop);
		
		// Lub
		ret_lev = lat.lub(ret_lev, aux_type);
		return ret_lev;
		// 
	} else if (type_o.row_type[sec_types.my_proto]) {
		// Proto + !Field
		proto_type = type_o.row_type[sec_types.my_proto].type;
		ret_lev = sec_types.getLevelProtoChainProp(proto_type, prop); 
		return ret_lev; 
		//		
	} else if (sec_types.isPropInObjTypeDomain(type_o, prop)) {
		// Field
		return ret_lev = sec_types.getLevelObjProp(type_o, prop);
		//
	} else {
		return null; 
	}
	
};


sec_types.getLevelProtoChainProp = function (to, prop) {
	var proto_type, ret_lev, aux_lev;
	
	if ((to.star_type || sec_types.isPropInObjTypeDomain(to, prop))
			&& to[sec_types.my_proto]) {
		// Field + Prototype 			
		
		// Field type
		if (sec_types.isPropInObjTypeDomain(to, prop)) {
			ret_lev = sec_types.getLevelObjProp(to, prop);
		} else {
			ret_lev = sec_types.getLevelObjStar(to);
		}
		
		// proto chain type
		proto_type = sec_types.getTypeObjProp(to, '__proto__');
		aux_lev = sec_types.getLevelProtoChainProp(proto_type, prop);
		
		// Lub
		ret_lev = lat.lub(ret_lev, aux_lev);
		return ret_lev; 
		//
	} else if (to[sec_types.my_proto]) {
		// Proto + !Field
		proto_type = sec_types.getTypeObjProp(to, '__proto__');
		ret_lev = sec_types.getLevelProtoChainProp(proto_type, prop); 
		return ret_lev; 
		//		
	} else if (to.star_type || sec_types.isPropInObjTypeDomain(to, prop)) {
		// Field
		if (sec_types.isPropInObjTypeDomain(to, prop)) {
			ret_lev = sec_types.getLevelObjProp(to, prop);
			return ret_lev; 
		} else {
			ret_lev = sec_types.getLevelObjStar(to);
			return ret_lev;  
		}
		//
	} else {
		return null; 
	}
	
};


sec_types.conds.unwrapType = function (wrapped_type) {
   var err; 
   if ((wrapped_type.length != 1) && (wrappped_type[0].cond != 'true')){
   	  err = new Error ('Typing Error: no hypothetical reasonging about function calls!');
   	  err.typing_error = true; 
      throw err;  
   }
   
   return wrapped_type[0].element; 
}; 

sec_types.conds.unwrapLevel = function (wrapped_level) {
   var err; 
   if ((wrapped_level.length != 1) && (wrappped_level[0].cond != 'true')){
   	  err = new Error ('Typing Error: no hypothetical reasonging about function literals!');
   	  err.typing_error = true; 
      throw err;  
   }
   
   return wrapped_level[0].element; 
}; 

/*
 * if (right_type.type_name === 'DELAYED_FUN') {
      	 	// I have to do something here
      	 	return sec_types.typeDelayedFunTypes(right_type, left_type);
      	 }
 */

sec_types.isSubType = function (left_type, right_type) {
   
   if (left_type.type_name === 'DELAYED_FUN') {
      return sec_types.typeDelayedFunTypeAux(right_type, left_type); 
   } 
 
   if (left_type.type_name === 'DELAYED_OBJ') {
   	   return sec_types.typeDelayedObjType(right_type, left_type);
   }
   
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
      if (right_type.type_name !== 'FUN') { return false; }
      if (!utils.equals(left_type.this_type, right_type.this_type)) return false;
      if (!utils.equals(left_type.parameter_types, right_type.parameter_types)) return false;
      if (!utils.equals(left_type.ret_type, right_type.ret_type)) return false;
      if (!lat.equals(left_type.context_level, right_type.context_level)) return false;
      return lat.leq(left_type.level, right_type.level);
   }  else {
   	  return false;
   }
}; 

sec_types.lubType = function (left_type, right_type) {
   var new_type; 
   
   if (left_type.type_name === 'DELAYED_FUN') {
      // I have to do something here
      // return sec_types.typeDelayedFunTypes(right_type, left_type);
      alert('lubType still not done for delayed fun types');
      return false;
   }
   
   if (left_type.type_name === 'DELAYED_OBJ') {
      // I have to do something here
      // return sec_types.typeDelayedFunTypes(right_type, left_type);
      alert('lubType still not done for delayed obj types');
      return false;
   }
   
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
      if (right_type.type_name !== 'FUN') { return false; }
      if (!utils.equals(left_type.this_type, right_type.this_type)) return false;
      if (!utils.equals(left_type.parameter_types, right_type.parameter_types)) return false;
      if (!utils.equals(left_type.ret_type, right_type.ret_type)) return false;
      if (!lat.equals(left_type.context_level, right_type.context_level)) return false;
      new_type = $.extend(true, {}, left_type);
      new_type.level = lat.lub(left_type.level, right_type.level);
      return new_type;
   } else {
   	  return false;
   }
}; 

sec_types.glbType = function (left_type, right_type) {
   var new_type; 
   
   if (left_type.type_name === 'DELAYED_FUN') {
      // I have to do something here
      // return sec_types.typeDelayedFunTypes(right_type, left_type);
      alert('glbType still not done for delayed fun types');
      return false;
   } 
   
   if (left_type.type_name === 'DELAYED_OBJ') {
      // I have to do something here
      // return sec_types.typeDelayedFunTypes(right_type, left_type);
      alert('glbType still not done for delayed fun types');
      return false;
   } 
   
   if (left_type.type_name != right_type.type_name) return false;
   
   if (left_type.type_name == 'PRIM') {
      // lub between prim types
      if (right_type.type_name !== 'PRIM') return false;
      return sec_types.buildPrimType(lat.glb(left_type.level, right_type.level)); 
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
      if (right_type.type_name !== 'FUN') { return false; }
      if (!utils.equals(left_type.this_type, right_type.this_type)) return false;
      if (!utils.equals(left_type.parameter_types, right_type.parameter_types)) return false;
      if (!utils.equals(left_type.ret_type, right_type.ret_type)) return false;
      if (!lat.equals(left_type.context_level, right_type.context_level)) return false;
      new_type = $.extend(true, {}, left_type);
      new_type.level = lat.glb(left_type.level, right_type.level);
      return new_type;
   } else {
      return false;
   }
};

sec_types.typeDelayedFunTypeAux = function (fun_type, delayed_funs_to_type) {
	var fun_lit_expr, i, len, pc_level, type_env; 
	
    if (fun_type.type_name !== 'FUN') {
    	return false;
    }
    
    for (i = 0, len = delayed_funs_to_type.fun_lits.length; i < len; i++) {
       delayed_type = delayed_funs_to_type.fun_lits[i];
       fun_lit_expr = delayed_type.fun_lit_expr; 
       pc_level = delayed_type.pc_level; 
       type_env = delayed_type.type_env; 
       try {
          sec_types.typeDelayedFunType(fun_lit_expr, type_env, fun_type);
       } catch (e) {
       	  //if (e.typing_error) return false; 
       	  throw e;  
       }
       if (!lat.leq(pc_level, fun_type.level)) {
          return false;	
       } 
    }
    
    delete delayed_funs_to_type.fun_lits; 
    delayed_funs_to_type.type_name = fun_type.type_name; 
    delayed_funs_to_type.this_type = fun_type.this_type;
    delayed_funs_to_type.parameter_types = fun_type.parameter_types;
    delayed_funs_to_type.context_level = fun_type.context_level;
    delayed_funs_to_type.ret_type = fun_type.ret_type;
    delayed_funs_to_type.level = fun_type.level;
   
    return true; 
}; 


sec_types.typeDelayedObjType = function (obj_type, delayed_obj_type) {
	var i, len, pc_level; 
	
	pc_level = delayed_obj_type.pc_level;
    if (!lat.leq(pc_level, obj_type.level)) {
       return false;	
    }
    
    delete delayed_obj_type.pc_level; 
    delayed_obj_type.type_name = obj_type.type_name; 
    delayed_obj_type.type_var = obj_type.type_var;
    delayed_obj_type.row_type = obj_type.row_type;
    delayed_obj_type.star_level = obj_type.star_level;
    delayed_obj_type.star_type = obj_type.star_type;
    delayed_obj_type.level = obj_type.level;
  
    return true; 
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

sec_types.buildFunType = function (this_type, parameter_types, context_level, ret_type, level, var_types) {
   return {
      type_name: 'FUN', 
      this_type: this_type, 
      parameter_types: parameter_types, 
      context_level: context_level, 
      ret_type: ret_type, 
      level: level,
      var_types: var_types
   }; 
};

sec_types.buildTypeVariable = function (var_name) {
   return {
    	type_name: 'VAR', 
    	var_name: var_name
   };
}; 

sec_types.buildGlobalType = function () {
   return {
    	type_name: 'GLOBAL'
   };
}; 

sec_types.buildDelayedFunType = function (fun_lit_expr, type_env, pc_level) {
   var delayed_type; 
   
   delayed_type = {
      fun_lit_expr: fun_lit_expr, 
      type_env: type_env, 
      pc_level: pc_level	
   };  
   
   return {
      type_name: 'DELAYED_FUN', 
      fun_lits: [ delayed_type ]
   };
}; 

sec_types.buildDelayedObjType = function (pc_level) { 
   return {
      type_name: 'DELAYED_OBJ', 
      pc_level: pc_level
   };
}; 


/*
 * Substitutions
 */

sec_types.substitute = function (type, type_var, new_type) {
   var fun, redirector, ret_type; 
   
   redirector = {
      PRIM: sec_types.substitutePrimType, 
      OBJ: sec_types.substituteObjType, 
      FUN: sec_types.substituteFunType, 
      GLOBAL: sec_types.substituteGlobalType, 
      VAR: sec_types.substituteTypeVariable
   };
   
   fun = redirector[type.type_name];
   ret_type = fun.call(sec_types, type, type_var, new_type);
   
   return ret_type; 
};

sec_types.substitutePrimType = function (prim_type, type_var, new_type) {
   return prim_type; 
};

sec_types.substituteObjType = function (obj_type, type_var, new_type) {
   var new_prop_type, new_row_type, new_star_type, new_type, prop, prop_type, prop_level; 
   
   if (obj_type.type_var === type_var) return obj_type;
   
   new_row_type = {}; 
   for (prop in obj_type.row_type) {
      if (sec_types.isPropInObjTypeDomain(obj_type, prop)) {
      	 prop_type = sec_types.getTypeObjProp(obj_type, prop); 
      	 prop_level = sec_types.getLevelObjProp(obj_type, prop); 
         prop_type = sec_types.substitute(prop_type, type_var, new_type);
         new_row_type[prop] = {
         	type: new_prop_type, 
         	level: new_prop_level
         }; 
      }
   }
   
   if (obj_type.star_type) {
      new_star_type = sec_type.substitute(obj_type.star_type, type_var, new_type);
   }
   
   new_type = sec_types.buildObjType(obj_type.type_var, new_row_type, obj_type.star_level, new_star_type, obj_type.level);
   return new_type; 
};

sec_types.substituteFunType = function (fun_type, type_var, new_type) {
   var i, len, new_this_type, new_parameter_types, new_ret_type, new_type;
   
   new_parameter_types = []; 
   for (i = 0, len = fun_type.parameter_types.length; i < len; i++) {
       new_parameter_types.push(sec_types.substitute(fun_type.parameter_types[i], type_var, new_type));    
   }
   new_this_type = sec_types.substitute(fun_type.this_type, type_var, new_type);
   new_ret_type = sec_types.substitute(fun_type.ret_type, type_var, new_type);
   
   new_type = sec_types.buildFunType(new_this_type, new_parameter_types, fun_type.context_level, new_ret_type, fun_type.level, fun_type.var_types);
   return new_type; 
};

sec_types.substituteTypeVariable = function (var_type, type_var, new_type) {
   if (var_type.var_name !== type_var) {
      return var_type; 
   }	
   
   return $.extend(true, {}, new_type); 
};

sec_types.substituteGlobalType = function (global_type, type_var, new_type) {
   return global_type;
}; 



sec_types.globalType2ObjectType = function (typing_environment) {
	var prop, row_type;
	
	row_type = {}; 
    for (prop in typing_environment) {
       if (typing_environment.hasOwnProperty(prop)) {
          row_type[prop] = typing_environment[prop];  		
       }
    }
    
    return {
      type_name: 'OBJ', 
      type_var: '__kGlobal', 
      row_type: row_type,
      star_level: null, 
      star_type: null, 
      level: lat.bot
   }; 
}; 

sec_types.objTypeDomain = function (obj_type) {
   var prop, props; 
   props = []; 
   for (prop in obj_type.row_type) {
      if (sec_types.isPropInObjTypeDomain(obj_type, prop)) {
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
   
   if (type.my_type_name) {
      return type.my_type_name;	
   }
   
   redirector = {
      PRIM: sec_types.printPrimType, 
      OBJ: sec_types.printObjType, 
      FUN: sec_types.printFunType, 
      GLOBAL: sec_types.printGlobalType, 
      VAR: sec_types.printTypeVar, 
      DELAYED_FUN: sec_types.printDelayedFunType, 
      DELAYED_OBJ: sec_types.printDelayedObjType
   };
   
   fun = redirector[type.type_name];
   str = fun.call(sec_types, type);
   
   return str; 
};

sec_types.printTypeVar = function (type) {
	return type.var_name;
};

sec_types.printGlobalType = function (type) {
	return 'GLOB';
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
   var not_first_property, i, str, prop; 
   
   str = 'FUN<'; 
   str += sec_types.printType(type.this_type);
   
   //print parameter types
   str += '.(';
   for (i = 0; i < type.parameter_types.length; i++) {
   	  if (i > 0) str += ', ';
      str += sec_types.printType(type.parameter_types[i]);	
   }
   str += ')'; 
   
   // print var-types
   if (type.var_types) {
   	  str += '[';
   	  not_first_property = false;
   	  for (prop in type.var_types) {
   	     if (type.var_types.hasOwnProperty(prop)) {
   	     	if (not_first_property) str += ', ';
   	        str += prop + ': ' + sec_types.printType(type.var_types[prop]);	
   	     }
   	  }
      str += ']';	
   }
   
   str += ' ->^{' + lat.print(type.context_level) + '} ';
   
   str += sec_types.printType(type.ret_type);
   str += '>^{' + lat.print(type.level) + '}';
   return str; 
};

sec_types.printDelayedFunType = function (type) {
    return false; 
};

sec_types.printDelayedObjType = function (type) {
    return false; 
};

sec_types.isLegalTypeName = function (type_name) {
	var ret, str; 
	
	str = type_name.substring(0, 2);
	ret = {};
	if (str !== '**') {
		ret.is_legal = false; 
		ret.message = 'Type names must be preceded by \'**\''; 
	} else {
		ret.is_legal = true; 
	}
	return ret; 
};










