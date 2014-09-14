type_parser = {}; 

sec_types.STR = 1; 

type_parser.parseType = function (index) {
   var prefix,
       parser_fun, 
       parser_table,
       ret;
        
   prefix = this.full_str.substring(index, index+2); 
   
   parser_table = {
      FU: 'parseFunType',
      OB: 'parseObjType', 
      PR: 'parsePrimType'
   };
   parser_fun = parser_table[prefix];
   
   if (!parser_fun) throw new Error ('Irrecognizable Type'); 
   
   ret = this[parser_fun](index);
   return ret;  
};


/*
 * PRIM^{\sigma}
 */
type_parser.parsePrimType = function (left_index) {
   var index, formula, level, ret, type; 
   
   index = left_index; 
   this.check_str(index, index+4, 'PRIM', 'Parser Expecting PRIM Type' + this.full_str.substring(index,index+4)); 
   index += 4; 
   
   // Parse Level: ^{\sigma}
   // Compute: level
   this.check_str(index, index+2, '^{');
   index += 2; 
   index = this.skip(index);  
   ret = this.parseLevel(index); 
   level = ret.level; 
   index = ret.index;
   index = this.skip(index);  
   this.check_char(index, '}');
   index++;
      
   type = sec_types.buildPrimType(level); 
   return {
      type: type, 
      index: index
   }; 
};

/*
 * OBJ<k><p^{\secLev}: \tau, ..., p^{\secLev}:\tau><\secLev, \tau>^{\sigma}
 * OBJ<k><p^{0}: PRIM^{4}><0, PRIM^{0}>^{0}
 */
type_parser.parseObjType = function (left_index) {
   var index, formula, full_str, level, ret, row_type, star_level, star_type, type_var;
   
   full_str = this.full_str; 
   index = left_index; 
   this.check_str(index, index+3, 'OBJ', 'OBJ Type Was Expected. Given: ' + this.full_str.substring(index, index+3));
   index += 3;    

   // parse type_variable <k>
   // compute type_var
   this.check_char(index, '<'); 
   index++; 
   this.check_str(index, index+2, '\_\_', 'Type Vars must be prefixed with: \_\_'); 
   index = this.skip(index);
   ret = this.parseWord(index, [' ', '>']); 
   index = ret.index; 
   type_var = ret.word;
   index = this.skip(index);  
   this.check_char(index, '>');
   index++;
   
   // parse row type <p^{0}: PRIM^{4}, q^{0}: PRIM^{4}>
   // compute row_type
   ret = this.parseRowType(index); 
   row_type = ret.row_type; 
   index = ret.index; 
   star_type = ret.star_type; 
   star_level = ret.star_level; 
   
   // Old Parsing Star Type:  <0, PRIM^{0}>
   /*
   if (this.full_str[index] === '<') {
      index++; 
      index = this.skip(index);
      ret = this.parseLevel(index);
      star_level = ret.level;
      index = ret.index; 
      index = this.skip(index);
      this.check_char(index, ','); 
      index++;
      index = this.skip(index);	
      ret = this.parseType(index); 
      index = ret.index; 
      star_type = ret.type; 
      index = this.skip(index); 
      this.check_char(index, '>'); 
      index++; 
   }*/
   
   //^{0}
   // compute level
   this.check_str(index, index+2, '^{'); 
   index += 2; 
   index = this.skip(index); 
   ret = this.parseLevel(index); 
   index = ret.index; 
   level = ret.level; 
   index = this.skip(index); 
   this.check_char(index, '}'); 
   index++; 
    
   return {
      type: sec_types.buildObjType(type_var, row_type, star_level, star_type, level), 
      index: index
   }; 
}; 


/*
 * <p1^{sigma1}:  \tau_1, ..., pn^{sigman}: \tau_n>
 */
type_parser.parseRowType = function (index) {
   var c, full_str, index, level, prop, ret, row_type, star_type, star_level, type;  
   
   full_str = this.full_str; 
   row_type = {};
   
   // check first char 
   this.check_char(index, '<'); 
   index++; 
   index = this.skip(index); 
   
   while (true) {
   
     // Parse Property Name
     ret = this.parseWord(index, ['^']); 
     index = ret.index; 
     prop = ret.word;
     index = this.skip(index);
     
     // Parse Property Level
     this.check_str(index, index+2, '^{'); 
     index += 2; 
     index = this.skip(index);
     ret = this.parseLevel(index);
     level = ret.level;
     index = ret.index;
     this.check_char(index, '}');
     index++;
     index = this.skip(index);
     this.check_char(index, ':');     
     index++;
     
     // Parse Property Type
     index = this.skip(index);              
     ret = this.parseType(index); 
     index = ret.index; 
     type = ret.type;
     index = this.skip(index);
   
     // Storage
     if (prop !== '*') {
        row_type[prop] = {level: level, type: type};	
     } else {
     	if (star_type) {
     	   throw new Error('Star Type Already Defined');
     	}
     	star_type = type; 
     	star_level = level;
     }
       
     c = full_str[index];      
     if (c === ',') {
        index++; 
        index = this.skip(index); 
        continue;
     } else if (c === '>') {
        index++; 
        break;
     } else {
        throw new Error ('Object Type Incorrectly Specified: You Must Separate Properties with a Comma'); 
     } 
   }
   
   return {
      index: index, 
      row_type: row_type, 
      star_type: star_type, 
      star_level: star_level
   };  
};

/*
 * FUN<\tau.(\tau, ..., \tau)->^{\sigma}\tau>^{\sigma}
 * FUN<OBJ<k><p1: PRIM^{0}, p2: PRIM^{1}><PRIM^{1}>^{0}.(PRIM^{1})->^{1}PRIM^{1}?<true>>^{0}?{true}
 */
type_parser.parseFunType = function (left_index) {
   var args_types, context_level, formula, index, level, parameter_types, ret, ret_type, this_type; 
   
   full_str = this.full_str;
   index = left_index; 
   this.check_str(index, index+3, 'FUN', 'FUN Type Incorrectly Specified: ' + this.full_str.substring(index, index+3));
   index += 3;    

   this.check_char(index, '<'); 
   index++; 
   
   // parse this type
   index = this.skip(index); 
   ret = this.parseType(index);
   this_type = ret.type;
   index = ret.index;
   
   // .  
   index = this.skip(index); 
   this.check_char(index, '.'); 
   index++; 
   index = this.skip(index); 
     
   // parse argument types
   ret = this.parseParameterTypes(index);
   parameter_types = ret.parameter_types;
   index = ret.index;
   index = this.skip(index); 
   this.check_str(index, index+4, '->^{');
   index += 4; 
   
   // process context level
   index = this.skip(index); 
   ret = this.parseLevel(index);
   context_level = ret.level; 
   index = ret.index;
   index = this.skip(index); 
   this.check_char(index, '}');  
   index++;
   
   // process return type
   index = this.skip(index); 
   ret = this.parseType(index); 
   ret_type = ret.type; 
   index = ret.index;
   index = this.skip(index); 
   this.check_str(index, index+3, '>^{'); 
   index += 3; 
   
   // process level 
   index = this.skip(index);
   ret = this.parseLevel(index); 
   level = ret.level; 
   index = ret.index;
   index = this.skip(index); 
   this.check_char(index, '}');
   index++; 
   
   return {
      type: sec_types.buildFunType(this_type, parameter_types, context_level, ret_type, level), 
      index: index
   };     
};

/*
 * (\tau, \tau, ..., \tau)
 */
type_parser.parseParameterTypes = function (index) {
   var full_str, index, parameter_types, ret, type;
   
   parameter_types = [];  
   full_str = this.full_str;
   
   this.check_char(index, '('); 
   index++; 
   index = this.skip(index); 
   
   while (true) {
      // process this type
      ret = this.parseType(index);
      type = ret.type;
      index = ret.index;
      parameter_types.push(type);
      
      index = this.skip(index); 
      if (full_str[index] === ',') {
        index++; 
        index = this.skip(index); 
        continue;
      } else if (full_str[index] === ')') {
         index++; 
         break; 
      } else {
          throw new Error ('Function Type Incorrectly Specified: You Must Separate Argument Types with a Comma');
      } 
   }
   
   return {
      parameter_types: parameter_types, 
      index: index
   }; 
}; 

type_parser.parseLevel = function (index) {
   var level; 
   
   level = parseInt(this.full_str[index]);
   index++;  
   return {
      level: level, 
      index: index
   }; 
}; 

type_parser.skip = function (index, skip_chars) {
   var full_str, i, len;
   
   if (!skip_chars) skip_chars = [' ']; 
   
   full_str = this.full_str;  
   for (i = index, len = full_str.length; i < len; i++) {
      if (!utils.belongsTo(full_str[i], skip_chars)) break; 
   }
   return i; 
}; 

type_parser.parseWord = function (index, delimiters) {
   var full_str, i, len, word;
   
   if (!delimiters) delimiters = [' ']; 
   
   full_str = this.full_str; 
   for (i = index, len = full_str.length; i < len; i++) {
      if (utils.belongsTo(full_str[i], delimiters)) break;    
   }
   
   word = full_str.substring(index, i);
   return {
      word: word, 
      index: i
   };  
};

type_parser.check_char = function (index, vchar, error_message) {
   if (vchar !== this.full_str[index]) {
      if (error_message) {
         throw new Error(error_message);
      } else {
         throw new Error('Expected: ' + vchar + ' Got: '+this.full_str[index]);
      } 
   }
};

type_parser.check_str = function (l_index, r_index, expected_str, error_message) {
   var str = this.full_str.substring(l_index, r_index);
   if (str !== expected_str) {
      if (error_message) {
         throw new Error(error_message);
      } else {
         throw new Error('Expected: ' + expected_str + ' Got: '+str);
      } 
   }
};

type_parser.parseVariableTypes = function () {
   var gamma, index, ret, type, var_name;
   
   gamma = {};
   index = 0; 
   while (index < this.full_str.length) {
      index = this.skip(index); 
      ret = this.parseWord(index, [':']); 
      var_name = ret.word; 
      index = ret.index; 
      this.check_char(index, ':'); 
      index++; 
      index = this.skip(index); 
      ret = this.parseType(index); 
      type = ret.type; 
      index = ret.index; 
      index = this.skip(index);
      this.check_char(index, '\n'); 
      index++;
      gamma[var_name] = type;  
      index = this.skip(index, [' ', '\n', '\t']);
   }   
       
   return gamma; 
}; 

type_parser.parsePropertySet = function (index) {
   var full_str, index, properties, ret, str; 
   
   full_str = this.full_str; 
   if ((full_str[index] !== '{') && (full_str[index] !== '<')) {
      throw new Error ('Parsing Error: Property Set Incorrectly Specified, Wrong Set Character: ' + full_str[index]); 
   }
   
   if ((full_str[index] === '<')) {
      str = full_str.substring(index, index+5);
      if (str !== '<STR>') {
         throw new Error ('Parsing Error: The set of all strings is incorrectly specified: ' + str);
      }
      return {
         property_set: sec_types.STR, 
         index: index+5
      };
   }
   
   properties = []; 
   
   index++;
   index = this.skip(index);  
   while (full_str[index] !== '}') {
      ret = this.parseWord(index, [',', '}', ' ']);
      properties.push(ret.word); 
      index = ret.index;
      index = this.skip(index, [' ', ',']);
   }
   
   index++;
   return {
      property_set: properties, 
      index: index
   }; 
}; 

type_parser.parsePropertySets = function () {
   var property_sets; 
   property_sets = this.parseItemList(this.parsePropertySet, 'property_set', '\n'); 
   return property_sets; 
};

type_parser.parseItemList = function (parsing_function, item_accessor, item_separator) {
   var c, index, parsed_items, ret;
   
   parsed_items = []; 
   index = 0; 
   index = this.skip(index, [' ', '\n', '\t']); 
   while (index < this.full_str.length) {
      index = this.skip(index);  
      ret = parsing_function.call(type_parser, index);
      parsed_items.push(ret[item_accessor]); 
      index = ret.index;
      index = this.skip(index); 
      c = this.full_str[index]; 
      this.check_char(index, item_separator); 
      index++;   
   }
   return parsed_items; 
}; 

type_parser.parseLitTypes = function () {
   var lit_types; 
   lit_types = this.parseItemList(this.parseType, 'type', '\n'); 
   return lit_types;
};


