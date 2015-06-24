var source, origin; 

var random = function () {
	return Math.random()*10;
};

var messageHandler = function(message) {
   var data = message.data;
    
   source = message.source;
   origin = message.origin;

   try { 
      eval(data);
      source.postMessage('Success!', origin);
   } catch(e) {
   	  source.postMessage('IFlow Exception', origin);
   }
};

window.addEventListener("message", messageHandler, true); 