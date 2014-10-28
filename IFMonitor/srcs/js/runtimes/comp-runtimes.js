/*
 * 1) _runtime.api_register.getIFlowSig(o, p)
 * 2) _runtime.create(F.prototype, _lev_ctxt)
 * 3) _runtime.call(f,arg_0, ..., arg_n)
 * 5) _runtime.hasOwnProperty(o, p)
 * 6) _runtime.shadow(p)
 * 7) _runtime.diverge()
 * 8) _runtime.array_prototype
 * 9) _runtime.defineProperty
 * 10) _runtime.api_register.registerIFlowSig(sig)
 */

(function(exports) {
   var consts = {
      VAR_SHADOW_PREFIX: '$shadow_',
      PROTO_PROP_STR: '__proto__', 
      STRUCT_PROP_IDENT: '$struct', 
      DOM_STRUCT: '$struct', 
      DOM_POS: '$pos', 
      DOM_VAL: '$val',
      //childNodes
      DOM_LEV: '$lev', 
      DOM_PARENT: '$dom_parent', 
      // live collections
      LIVE_LEV: '$live_lev', 
      LIVE_ROOT: '$live_root',
      LIVE_TAG: '$live_tag',
      TAG_LEVELS: '$tag_levels'
   }; 
   exports.consts = consts;
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   exports.hasOwnProperty = hasOwnProperty; 
   
   var createShadowWindowProperties = function () {
      var prop, shadow_prop; 
      for (prop in window) {
         shadow_prop = consts.VAR_SHADOW_PREFIX + prop; 
         if (!hasOwnProperty(window, shadow_prop)) {
            Object.defineProperty(window, shadow_prop, {
               enumerable : false,
               value : exports.lat.bot,
               writable : true
            }); 
         }
      }
      document[consts.TAG_LEVELS] = {};
      setUpDocument(document);
   }; 
   exports.createShadowWindowProperties = createShadowWindowProperties;
   
   var getTagLevel = function (tag) {
      if (hasOwnProperty(document[consts.TAG_LEVELS], tag)) {
         return document[consts.TAG_LEVELS][tag];
      } else {
      	 return $runtime.lat.bot;
      }
   };
   exports.getTagLevel = getTagLevel;
   
   var setTagLevel = function (tag, tag_level) {
   	  document[consts.TAG_LEVELS][tag] = tag_level;
   };
   exports.setTagLevel = setTagLevel; 
   
   var predicateWLD = function (node, last_tag_level_register) {
      
      if (!last_tag_level_register) return last_tag_level_register; 
      if ((node.nodeType !== 1) && (node.nodeType !== 3) && (node.nodeType !== 9)) return last_tag_level_register;
      
      // Constraint 1 - position levels must be increasing 
      $check(exports.lat.leq(last_tag_level_register[node.tagName], node[consts.DOM_POS]));
      
      // Constraint 2 - levels must be lower than the tag levels
      $check(exports.lat.leq(node[consts.DOM_POS], getTagLevel(node.tagName)));
      
      last_tag_level_register[node.tagName] = node[consts.DOM_POS];
      
      if (!node.childNodes) return last_tag_level_register;
        
      for (var i = 0, len = node.childNodes.length; i < len; i++) {
         last_tag_level_register = predicateWLD(node.childNodes[i], last_tag_level_register); 
      }
      
      return last_tag_level_register; 
   }; 
   exports.predicateWLD = predicateWLD;
   
   var setUpDocument = function (node) {
      
      if (!node) return; 
      if ((node.nodeType !== 1) && (node.nodeType !== 3) && (node.nodeType !== 9)) return;
      
      node[consts.DOM_STRUCT] = exports.lat.bot; 
      node[consts.DOM_POS] = exports.lat.bot; 
      node[consts.DOM_VAL] = exports.lat.bot; 
      
      node.dom_upg_struct = function () {};
      node.dom_upg_pos = function () {};
      
      if (!node.childNodes) return;
        
      for (var i = 0, len = node.childNodes.length; i < len; i++) {
         setUpDocument(node.childNodes[i]); 
      }
   }; 
   
   
})($runtime);

(function(exports){
   var consts = {
      VAR_SHADOW_PREFIX: '$shadow_',
      PROTO_PROP_STR: '__proto__', 
      STRUCT_PROP_IDENT: '$struct'
   }; 
   
   var api_register_table = [];
   var $register;
   var $addIFlowSig;
   var o = {}; 
   var internalHasOwnProperty = o.hasOwnProperty;
   
   var hasOwnProperty = function (obj, prop) {
      return internalHasOwnProperty.call(obj, prop);    
   };
   
   var $shadow = function (prop) {
      return consts.VAR_SHADOW_PREFIX + prop; 
   }; 
   	
   $register = function (left, right) {
      var iflow_sig; 
      for (len = api_register_table.length, i = len-1; 0 <= i; i--) {
         iflow_sig = api_register_table[i];
	     if (iflow_sig.domain(left, right)) {
	        return api_register_table[i];
	     } 
	  }
	  return null;  
   };
    
   $addIFlowSig = function (iflow_sig) {
      api_register_table.push(iflow_sig);  
   };
   
   $check = function (arg, text) {
      if (!arg) {
      	text = text || 'IFlow Exception'; 
        throw new Error(text); 
      }
   };

   $shadowE = function (prop) {
      return consts.VAR_SHADOW_PREFIX + 'e_' + prop; 
   };
   
   $shadowV = function (prop) {
      return consts.VAR_SHADOW_PREFIX + 'v_' + prop; 
   };
   
   $legal = function (prop) {
   	  if (prop[0] === '$') {
   	  	return false;
   	  } else {
   	  	return true;
   	  } 
   };
   
   $inspect = function (o, prop, level) {
      var o_proto, new_lev;
    
      if (level === undefined) {
   	     level = $runtime.lat.bot;
   	  }
   	  
   	  if (!hasOwnProperty(o, $shadowV(consts.PROTO_PROP_STR))) {
   	     return level;    	
   	  }
   	   
   	  if (hasOwnProperty(o, prop)) {
         return level;	
      } else {
       	 o_proto = o.__proto__;
       	 new_lev = $runtime.lat.lub(level, 
       	 	o[$shadowV(consts.PROTO_PROP_STR)],
       	 	o[consts.STRUCT_PROP_IDENT]);
       	 return $inspect(o_proto, prop, new_lev); 
      }
   };
   
   exports.$addIFlowSig = $addIFlowSig;
   exports.$register = $register; 
   exports.$shadow = $shadow;
   exports.$shadowE = $shadowE;
   exports.$shadowV = $shadowV;   
   exports.$legal = $legal; 
   exports.$check = $check; 
})(window);
   
   
 





