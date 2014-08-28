var source, origin; 

var setUpCSSNode = function(css_text) {
	var css_node = document.createElement('style');
	css_node.type = 'text/css';

	if (css_node.styleSheet)
		css_node.styleSheet.cssText = css_text;
	else
		css_node.appendChild(document.createTextNode(css_text));

	document.getElementsByTagName("head")[0].appendChild(css_node);
};

var messageHandler = function(message) {
	var data = message.data, data_type;
    
    source = message.source;
    origin = message.origin;
	data_type = data.substr(0, 4);
	data = data.substr(4);

	if (data_type === 'comp') {
		try {
			eval(data);
		} catch(e) {
			if (e.message === 'IFlow Exception') {
				source.postMessage('IFlow Exception', origin);
			} else if (e.message === 'Illegal Coercion') {
				source.postMessage('Illegal Coercion', origin);
			}
		}
	} else if (data_type === 'ucss') {
		setUpCSSNode(data);
	} else if (data_type === 'ifsg') {
	    setUpIFSig(data); 
    }
};

var setUpIFSig = function (ifsig_text) {
   var _enforce, _isInDomain, if_sig, _updtLab; 
   eval(ifsig_text);
   if_sig = {
      _enforce: _enforce, 
      _isInDomain: _isInDomain, 
      _updtLab: _updtLab
   }; 
   _runtime.api_register.registerIFlowSig(if_sig); 
}; 

window.addEventListener("message", messageHandler, true); 