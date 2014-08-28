/*
 * 
 * _processArg -> iflow_sig._processArg(arg, index, evaluator)
 * _processRet ->  iflow_sig._processRet(ret)
 *
 * Property Lookup:
 * _iflow_sig._enforce(o, ê, _lev_ctxt); 
 * _iflow_sig._updtLab(_val_i, o, ê, _lev_ctxt);  
 * 
 * Property Update:  
 * _iflow_sig._enforce(o, ê_0, ê_1, _runtime.lat.lub(_lev_ctxt, C_l[ê_1]), _lev_ctxt);
 * _iflow_sig._updtLab(o, ê_0, ê_1, _runtime.lat.lub(_lev_ctxt, C_l[ê_1]), _lev_ctxt);
 *  
 * Function Call: 
 *_iflow_sig._enforce(lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 *_iflow_sig._updtLab(_ret, lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 *
 * Method Call: 
 *_iflow_sig._enforce(_lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 *_iflow_sig._updtLab(_ret, _lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 * 
 * Cosntructor Call: 
 *_iflow_sig._enforce(lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 *_iflow_sig._updtLab(_val_i, _lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 */

// Alert - Policy: cannot alert confidential information
// only information labeled with the bottom level of the security lattice can be alerted
(function (exports) {
   var iflow_sig = {}; 
   var original_alert = alert; 
   
   iflow_sig._enforce = function (lev_ctxt, f, arg, lev_arg) {
      if (exports.lat.lub(lev_arg, lev_ctxt) != exports.lat.bot) {
   	     exports.diverge('IFlow Exception'); 
   	  }
   }; 
   
   iflow_sig._updtLab = function (ret,  lev_ctxt, f, arg, lev_arg) {
      return lev_ctxt; 
   }; 
   
   iflow_sig._isInDomain = function (f, prop, fun_flag) {
      return (fun_flag === 'function_call') && (f === original_alert) && (prop === null); 
   }; 
   
   exports.api_register.registerIFlowSig(iflow_sig);

})(_runtime); 


// Confirm: the result of confirm is always labeled with the most confidential level
// there are no restrictions on the context on which it can be invoked
(function (exports) {
   var iflow_sig = {}; 
   var original_confirm = confirm; 
   
   iflow_sig._enforce = function (lev_ctxt, f, arg, lev_arg) {}; 
   
   iflow_sig._updtLab = function (ret, lev_ctxt, f, arg, lev_arg) {
      return exports.lat.top; 
   }; 
   
   iflow_sig._isInDomain = function (f, prop, fun_flag) {
      return (fun_flag === 'function_call') && (f === original_confirm) && (prop === null); 
   }; 
   
   exports.api_register.registerIFlowSig(iflow_sig);

})(_runtime); 


// Eval
(function (exports) {
   var iflow_sig = {}; 
   var original_eval = eval; 
   
   iflow_sig._enforce = function (lev_ctxt, f, arg, lev_arg) {}; 
   
   iflow_sig._processArg = function (arg, index, evaluator) {
      var assign_fun_stmt, assign_fun_stmt_str, call_stmt_str, fun_expr, str; 
       
   	  // function(_pc) { C[arg] }
      str = '(function () { ' + arg + '})()';
      fun_expr = window.util.parseExpr(str); 
      fun_expr = fun_expr.callee; 
      window.util.addReturnToLastExpressionStatement(fun_expr); 
      fun_expr = comp.setUpCompiler(fun_expr);
      fun_expr = comp.computeNewFunctionLiteral(fun_expr.expr);
      
      // _ret = function(_pc) { C[str] }; 
      assign_fun_stmt = window.esprima.delegate.createAssignmentExpression('=', 
         window.esprima.delegate.createIdentifier(comp.identifiers.consts.RET_IDENT), fun_expr); 
      assign_fun_stmt = window.esprima.delegate.createExpressionStatement(assign_fun_stmt); 
      assign_fun_stmt_str = window.util.printStmtST(assign_fun_stmt);
      
      // _ret( _pc);
      call_stmt_str = '{0}({1});';
      call_stmt_str = $.validator.format(call_stmt_str,
         comp.identifiers.consts.RET_IDENT,
         comp.identifiers.consts.PC_IDENT); 
       
      return assign_fun_stmt_str + call_stmt_str;  
   };
   
   iflow_sig._processRet = function (ret) {
      ret = ret && ret[comp.identifiers.consts.VAL_PROP_IDENT];
      return ret; 
   };
   
   iflow_sig._updtLab = function (ret, lev_ctxt, f, arg, lev_arg) {
      ret = ret && ret[comp.identifiers.consts.LEV_PROP_IDENT];
      return ret;
   }; 
   
   iflow_sig._isInDomain = function (f, prop, fun_flag) {
      return (fun_flag === 'function_call') && (f === original_eval) && (prop === null); 
   }; 
   
   exports.api_register.registerIFlowSig(iflow_sig);

})(_runtime); 


// XMLHttpRequest: prevent everything high
(function (exports) {
   var iflow_sig = {}; 
   var original_XMLHttpRequest = XMLHttpRequest; 
   
   iflow_sig._enforce = function (lev_ctxt, fun) {
      if (!exports.lat.leq(lev_ctxt, exports.lat.bot)) {
         exports.diverge('IFlow Exception'); 
      }
   }; 
   
   iflow_sig._updtLab = function (ret, lev_ctxt, f, arg, lev_arg) {
      return exports.lat.bot; 
   }; 
   
   iflow_sig._isInDomain = function (f, prop, fun_flag) {
      return (fun_flag === 'constructor_call') && (f === original_XMLHttpRequest) && (prop === null); 
   }; 
   
   exports.api_register.registerIFlowSig(iflow_sig);

})(_runtime); 


// xhr.open(http_method, url); 
(function (exports) {
   var iflow_sig = {}; 
   
   var xhr = new XMLHttpRequest; 
   var original_xhr_open = xhr.open; 
   
   iflow_sig._enforce = function (lev_ctxt, o, prop, http_method, lev_method, url, lev_url) {
      var lev = exports.lat.lub(lev_method, lev_url, lev_ctxt); 
      if (!exports.lat.leq(lev, exports.lat.bot)) {
         exports.diverge('IFlow Exception'); 
      }
   }; 
   
   iflow_sig._updtLab = function (ret, lev_ctxt, o, prop, http_method, lev_method, url, lev_url) {
      return exports.lat.bot; 
   }; 
   
   iflow_sig._isInDomain = function (obj, prop, flag) {
      return (flag === 'method_call') && (obj[prop] === original_xhr_open); 
   }; 
   
   exports.api_register.registerIFlowSig(iflow_sig);

})(_runtime); 


// xhr.send(data); 
(function (exports) {
   var iflow_sig = {}; 
   
   var xhr = new XMLHttpRequest; 
   var original_xhr_send = xhr.send; 
   
   iflow_sig._enforce = function (lev_ctxt, o, prop, data, lev_data) {
      var lev = exports.lat.lub(lev_data, lev_ctxt); 
      if (!exports.lat.leq(lev, exports.lat.bot)) {
         exports.diverge('IFlow Exception'); 
      }
   }; 
   
   iflow_sig._updtLab = function (ret, lev_ctxt, o, prop, data, lev_data) {
      return exports.lat.bot; 
   }; 
   
   iflow_sig._isInDomain = function (obj, prop, flag) {
      return (flag === 'method_call') && (obj[prop] === original_xhr_send); 
   }; 
   
   exports.api_register.registerIFlowSig(iflow_sig);

})(_runtime); 



// document.cookie - read policy
(function (exports) {
   var iflow_sig = {}; 
   
   var original_doc = document;  
   
   iflow_sig._enforce = function (o, prop, lev_ctxt) {}; 
   
   iflow_sig._updtLab = function (cook_val, doc, cookie_prop, lev_ctxt) {
      if (!exports.hasOwnProperty(original_doc, exports.shadow('cookie'))) {
         return exports.lat.lub(original_doc[exports.consts.STRUCT_PROP_IDENT], lev_ctxt); 
      } else {
         return exports.lat.lub(original_doc[exports.shadow('cookie')], lev_ctxt);
      } 
   }; 
   
   iflow_sig._isInDomain = function (obj, prop, flag) {
      return (flag === 'prop_lookup') && (obj === original_doc) && (prop === 'cookie'); 
   }; 
   
   exports.api_register.registerIFlowSig(iflow_sig);

})(_runtime); 


// document.cookie = v - write policy
(function (exports) {
   var iflow_sig = {}; 
   
   var original_doc = document;  
   
   iflow_sig._enforce = function (o, prop, val, lev_val, lev_ctxt) {
      if (!exports.hasOwnProperty(original_doc, exports.shadow('cookie'))) {
         if (!exports.lat.leq(lev_ctxt, original_doc[exports.consts.STRUCT_PROP_IDENT])) {
            exports.diverge();
         }
      } else {
         if (!exports.lat.leq(lev_ctxt, original_doc[exports.shadow('cookie')])) {
            exports.diverge(); 
         }
      } 
   }; 
   
   iflow_sig._updtLab = function (o, prop, val, lev_val, lev_ctxt) {
      original_doc[exports.shadow('cookie')] = lev_val; 
      return lev_val; 
   }; 
   
   iflow_sig._isInDomain = function (obj, prop, flag) {
      return (flag === 'prop_updt') && (obj === original_doc) && (prop === 'cookie'); 
   }; 
   
   exports.api_register.registerIFlowSig(iflow_sig);

})(_runtime); 


// window.location = v - write policy
(function (exports) {
   var iflow_sig = {}; 
   
   var original_window = window;  
   
   iflow_sig._enforce = function (o, prop, val, lev_val, lev_ctxt) {
      var location_lev, new_lev;
      location_lev = original_window[exports.shadow('location')];
      new_lev = exports.lat.leq(lev_ctxt, lev_val); 
      if (exports.lat.leq(new_lev, location_lev) && exports.lat.leq(location_lev, new_lev)) return; 
      else exports.diverge();
   }; 
   
   iflow_sig._updtLab = function (o, prop, val, lev_val, lev_ctxt) {
      return lev_val; 
   }; 
   
   iflow_sig._isInDomain = function (obj, prop, flag) {
      return (flag === 'prop_updt') && (obj === original_window) && (prop === 'location'); 
   }; 
   
   exports.api_register.registerIFlowSig(iflow_sig);

})(_runtime); 



