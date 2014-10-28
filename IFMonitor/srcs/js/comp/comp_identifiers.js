comp.identifiers = {}; 

comp.identifiers.consts = {
	LEV_HOLDER_IDENT: '$lev_', 
	VAL_HOLDER_IDENT: '$val_',
	PC_HOLDER_IDENT: '$pc_holder_',
	PC_IDENT: '$pc',  
	PC_FUN_IDENT: '$pc_fun',  
	LEV_CTXT_IDENT: '$lev_ctxt',
	RET_IDENT: '$ret',
    RUNTIME_IDENT: '$runtime',
    VAR_SHADOW_PREFIX: '$shadow_',  
    CHECK_IDENT: '$check', 
    LEGAL_IDENT: '$legal', 
    IFLOW_SIG_IDENT: '$iflow_sig',
    IFLOW_REG_IDENT: '$register',
    INSPECT_IDENT: '$inspect',
    PROP_DYN_SHADOW: '$shadowV',
    EXIST_DYN_SHADOW: '$shadowE',
	STRUCT_PROP_IDENT: '$struct', 
	PROTO_PROP_STR: '\'__proto__\'',
	LEV_RET: 'prop_lev', 
    VAL_RET: 'prop_val',
    LOCAL_EVAL: '$local_eval'
}; 

comp.identifiers.printState = function() {
	var lab, 
	    prop,
	    runtime,
	    str = ''; 
	lab = window[this.consts.LAB_IDENT];
	for(prop in lab) {
		str += 'variable: ' + prop + ', value: ' + window[prop] + ', level: ' + lab[prop] + '\n';    
	}
	return str; 
};

comp.identifiers.getAuxIdentifier = function (i) {
	return esprima.delegate.createIdentifier(this.getAuxIdentifierStr(i));  
};

comp.identifiers.getAuxIdentifierStr = function (i) {
   if (isFinite(i)) {
   	return this.consts.AUX_IDENT + '_' + i; 
   } else {
   	return this.consts.AUX_IDENT + '_1';  
   }
};

comp.identifiers.getRuntimeMemberExpr = function (prop_name) {
	var delegate = window.esprima.delegate;
	return delegate.createMemberExpression('[',
	   delegate.createIdentifier(this.consts.RUNTIME_IDENT), 
	   delegate.createLiteral2(prop_name));
};

comp.identifiers.getRuntimeMemberExprStr = function (prop_name) {
	return this.consts.RUNTIME_IDENT + '.' + prop_name;  
};

comp.identifiers.getFreeValLevVars = (function () {
   var i = 0;
   return function() {
      var val_var = this.consts.VAL_VAR_IDENT + i,
          lev_var = this.consts.LEV_VAR_IDENT + i; 
      i++;
      return {
      	val_var: val_var, 
      	lev_var: lev_var
      };
   };
})();

comp.identifiers.getPcHolderVar = (function() {
   var i = 0;
   return function() {
      i++;
      return this.consts.PC_HOLDER_IDENT+i;
   };
})();

comp.identifiers.getLevHolderVar = (function() {
   var i = 0;
   return function() {
      i++;
      return { lev_holder: this.consts.LEV_HOLDER_IDENT+i };
   };
})();

comp.identifiers.getValHolderVar = (function() {
   var i = 0;
   return function() {
      i++;
      return { val_holder: this.consts.VAL_HOLDER_IDENT+i };
   };
})();

comp.identifiers.getLevValHolderVars = (function() {
   var i = 0;
   return function() {
      i++;
      return { 
         val_holder: this.consts.VAL_HOLDER_IDENT+i, 
         lev_holder: this.consts.LEV_HOLDER_IDENT+i 
      };
   };
})();


comp.identifiers.randomizeIdentifiers = function() {
   var n; 
   n = Math.random() * 1000; 
   n = Math.floor(n); 
   for (var prop in comp.identifiers.consts) {
   	comp.identifiers.consts[prop] = comp.identifiers.consts[prop] + '_' + n + '_';  
   }	
   return n; 
}; 


comp.identifiers.getShadowVar = function (var_ident) {
   return  this.consts.VAR_SHADOW_PREFIX + var_ident;   
};
