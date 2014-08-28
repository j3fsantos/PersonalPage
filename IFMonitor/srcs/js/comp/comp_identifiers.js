comp.identifiers = {}; 

comp.identifiers.consts = {
	AUX_IDENT: '_aux',
	LAB_IDENT: '_lab',
	LAB_PROP_IDENT: '_lab', 
	LEV_VAR_IDENT: '_lev_',
	LEV_PROP_IDENT: '_lev', 
	PC_IDENT: '_pc',   
	PC_HOLDER_IDENT: '_pc_holder_',
	PC_PROP_IDENT: '_pc', 
	VAL_VAR_IDENT: '_val_',
	VAL_PROP_IDENT: '_val',
	RUNTIME_IDENT: '_runtime',
	INSTRUMENTED_PROP_IDENT: '_instrumented', 
	ARGS_LEVELS_PARAM: 'args_levels', 
	IS_ARGUMENTS_ARRAY: '_is_arguments_array', 
	IFLOW_SIG_IDENT: '_iflow_sig', 
	LEV_CTXT_IDENT: '_lev_ctxt', 
	LEV_FSCOPE_IDENT: '_lev_fscope',
	VAR_SHADOW_PREFIX: '_lev_', 
	RET_IDENT: '_ret', 
	NO_RET_PROP_IDENT: '_no_ret',
	STRUCT_PROP_IDENT: '_lev_struct', 
	PROTO_PROP_IDENT: '_proto',
	PROTO_PROP_LEV_IDENT: '_lev_proto', 
	LEV_HOLDER_IDENT: '_lev_holder_', 
	INSPECTOR_IDENT: '_inspector'
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
      return { pc_holder: this.consts.PC_HOLDER_IDENT+i };
   };
})();

comp.identifiers.getLevHolderVar = (function() {
   var i = 0;
   return function() {
      i++;
      return { lev_holder: this.consts.LEV_HOLDER_IDENT+i };
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
