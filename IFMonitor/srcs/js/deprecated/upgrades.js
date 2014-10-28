(function (exports) {
   var iflow_sig = {}; 
   
   iflow_sig.check = function ($local_eval, lev_win, lev_upg, lev_var, lev_lev, val_win, val_upg, val_var, val_lev) {
   	  var lev_ctxt, current_lev; 
   	  lev_ctxt = exports.lat.lub(lev_win, lev_upg, lev_var, lev_lev); 
   	  current_lev = $local_eval($shadow(val_var));
      if (exports.lat.leq(lev_ctxt, current_lev)) {
   	     exports.diverge('IFlow Exception'); 
   	  }
   }; 
   
   iflow_sig.domain = function (val_win, prop) {
      return (val_win === 'window') && (prop === 'upg_var'); 
   }; 
   
   iflow_sig.label = function ($local_eval, lev_win, lev_upg, lev_var, lev_lev, val_win, val_upg, val_var, val_lev) {
   	  var new_lev; 
   	  new_lev = exports.lat.lub(lev_win, lev_upg, lev_var, lev_lev, val_lev); 
   	  $local_eval($shadow(val_var) + '=' + new_lev);
   }; 
   
   exports.$addIFlowSig(iflow_sig);

})(window); 