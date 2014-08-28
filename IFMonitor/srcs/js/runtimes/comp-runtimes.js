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
      IFLOW_SIG_IDENT: '_iflow_sig', 
      STRUCT_PROP_IDENT: '_lev_struct',
      PROTO_PROP_IDENT: '_proto',
      PROTO_PROP_LEV_IDENT: '_lev_proto', 
      VAR_SHADOW_PREFIX: '_lev_'
   }; 
	
   var api_register_table = [];
   var api_register = {};
   	
   api_register.getIFlowSig = function (left, right, lab) {
      var iflow_sig; 
      for (len = api_register_table.length, i = len-1; 0 <= i; i--) {
         iflow_sig = api_register_table[i];
	     if (iflow_sig._isInDomain(left, right, lab)) {
	        return api_register_table[i];
	     } 
	  }
	  return null;  
   };
   
   api_register.defaultProcessArg = function (arg) { return arg; }; 
   api_register.defaultProcessRet = function (ret) { return ret; }; 
   
   /*
    * iflow_sig: _updtlab, _enforce, _processArg, _processRet, _isInDomain
    */
   
   api_register.registerIFlowSig = function (iflow_sig) {
      if (!iflow_sig._processArg) {
         iflow_sig._processArg = api_register.defaultProcessArg; 
      } 
      
      if (!iflow_sig._processRet) {
         iflow_sig._processRet = api_register.defaultProcessRet; 
      }
      api_register_table.push(iflow_sig);  
   };
		
   var shadow = function (prop) {
      return consts.VAR_SHADOW_PREFIX + prop; 
   }; 
   
   var diverge = function (text) {
      text = text || 'IFlow Exception';
      throw new Error(text); 
   };
   
   var create = function (proto, lev) {
      var F, obj;  
      if(proto) {
         F = function () {}; 
         F.prototype = proto; 
		 obj = new F();
      } else {
	     obj = {}; 
	  }
	  
	  defineProperty(obj, consts.STRUCT_PROP_IDENT, {enumerable: false, value: lev, writable: true});
	  defineProperty(obj, consts.PROTO_PROP_LEV_IDENT, {enumerable: false, value: lev, writable: true});
	  defineProperty(obj, consts.PROTO_PROP_IDENT, {enumerable: false, value: proto, writable: true});
	  
	  return obj; 
   };
   
   var call = function (method, obj) {
      var inner_args = [], func, apply_func, i, len;
      
      for (i = 2, len = arguments.length; i < len; i++) {
         inner_args.push(arguments[i]);
      }
      
      return method.apply(obj, inner_args); 
   };
   
   var obj = {};
   var hasOwnPropertyOriginal = obj.hasOwnProperty;
   
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   var definePropertyOriginal = Object.defineProperty;
   
   var defineProperty = function (obj, prop, attr) {
      definePropertyOriginal.apply(Object, [obj, prop, attr]); 
   };
   
   var array_prototype = Array.prototype;
   
   var randomizeRuntimeConsts = function () {
      var n;
      n = Math.random() * 1000;
      n = Math.floor(n);
      for (var prop in exports.consts) {
         exports.consts[prop] = exports.consts[prop] + '_' + n + '_';
      }
      return n;
   };

   var createShadowWindowProperties = function () {
      var prop, shadow_prop; 
      for (prop in window) {
         shadow_prop = consts.VAR_SHADOW_PREFIX + prop; 
         if (!hasOwnProperty(window, shadow_prop)) {
            defineProperty(window, shadow_prop, {
               enumerable : false,
               value : exports.lat.bot,
               writable : true
            }); 
         }
      }
   }; 
   
   exports.api_register = api_register; 
   exports.shadow = shadow; 
   exports.diverge = diverge; 
   exports.create = create; 
   exports.call = call; 
   exports.hasOwnProperty = hasOwnProperty;
   exports.defineProperty = defineProperty; 
   exports.array_prototype = array_prototype;
   exports.createShadowWindowProperties = createShadowWindowProperties;
   exports.consts = consts; 
   
})(_runtime);









