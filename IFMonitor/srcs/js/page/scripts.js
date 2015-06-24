// Option for escodegen

var option = {
   format : {
      quotes : 'single',
	  indent : {
	     style : '\t'
	   }
   }
};

// code mirror variable
var cm, cm_output;

//categories and examples
var examples_by_cat = [];
var current_cat_index = 0;
var category_names = []; 

//category select and example select
var category_select, example_select;

//tab
var atab = "intro";

window.addEventListener('load', function() {
   cm = CodeMirror.fromTextArea(document.getElementById('jsi'), 
          {lineNumbers: true, mode: "javascript"});

   cm_output = CodeMirror.fromTextArea(document.getElementById('jso'), 
          {lineNumbers: true, mode: "javascript"});
   
   category_select = document.getElementById('cat');
   example_select = document.getElementById('ex');
   
   loadStoredIflowSigs();
   
   $(category_select).change(function(){
      var selected_index; 
      
      selected_index = $(this)[0].selectedIndex;
      current_cat_index = selected_index; 
      catchange(); 
   });
   
   processCategories();
   catchange(0); 
});

var processCategories = function () {
   var i; 
   
   $('#example_categories > div').each(function(index) {
   	  var cat_name; 
   	  cat_name = $(this).attr('name'); 
   	  category_names.push(cat_name);
      processExamples($(this), index);	
   });
   
   category_select.options.length = 0;
   for (i = 0; i < category_names.length; i++) {
     category_select.options.add(new Option(category_names[i], i));
   }
};

var processExamples = function(cat_div, cat_index) {
   	
   if (!examples_by_cat[cat_index]) examples_by_cat[cat_index] = [];	
   
   $('div', cat_div).each(function(index) {
      var desc, prog_input, types; 
	  
	  desc = $('.desc', this).text();	
      prog_input = $('.prog_input', this).text();
      prog_input = window.esprima.parse(prog_input); 
      prog_input = window.escodegen.generate(prog_input, option);
      examples_by_cat[cat_index].push({
      	desc: desc,
      	prog_input: prog_input
      }); 	
   });
};

function loadex () {
	var current_cat_name, example, selected_index;
	
	current_cat_name = category_names[current_cat_index];
	selected_index = example_select.selectedIndex; 
	example = examples_by_cat[current_cat_index][selected_index];
	cm.setValue(example.prog_input);

    cm_output.setValue('');
}

function catchange() {
   var current_cat, i; 
   
   current_cat = examples_by_cat[current_cat_index];
   example_select.options.length = 0;
   for (i = 0; i < current_cat.length; i++) {
     example_select.options.add(new Option(current_cat[i].desc, i));
   }
}

function findCatIndex (catname) {
	for (i = 0, len = category_names.length; i < len; i++) {
		if (catname === category_names[i])
		   return i;
	}
	throw new Error ('Looking for an example category that does not exist!');
}

function tab(id) {
   $('#'+atab).toggle();
   $('#'+id).toggle();
   atab = id;

   cm.refresh();
   return void(0);
}

function process () {
   var instrumentation, output, st, str; 
   
   cm_output.setValue('');
   str = cm.getValue();
   
  // if (document.getElementById('radbutton_st').checked) {
      try {
   	   	 st = window.esprima.parse(str); 
   	   	 output = comp.compile(st);
         output = window.escodegen.generate(output, option);
         cm_output.setValue(output); 	
         alert ('Program successfully instrumented!');
      } catch (e) {
      	 alert ('Program cannot be instrumented.');	
      }   
  /* } else {
   	  alert ('Not Implemented yet!');
   }*/  
}

var sendProgramToIFrame = function(prog) {
   var iframe = document.getElementById('exec_iframe');
   iframe.contentWindow.postMessage(prog, window.location);
};

var messageHandler = function(message) {
   if ((message.data === 'IFlow Exception') || (message.data === 'Illegal Coercion')) {
      alert(message.data);
   } else if (message.data === 'Success!') {
   	  alert('Successful Execution!');
   }
};

var runCompiledProg = function() {
   var compiled_prog;
   
   compiled_prog = cm_output.getValue();
   try {
      sendProgramToIFrame('comp' + compiled_prog);
   } catch (e) {
	  alert('A problem occurred when trying to communicate with exec iframe');
   }
};

var loadStoredIflowSigs = function () {
   var iflow_sig_select; 
   
   iflow_sig_select = document.getElementById('iflow_ex');
   $('#example_iflowsigs > span').each(function(index) {
   	  var iflow_sig_name; 
   	  iflow_sig_name = $(this).attr('data-iflow-desc'); 
   	  iflow_sig_select.options.add(new Option(iflow_sig_name));	
   });
};

var addSig = function () {
   var str, iflow_sig; 
   
   alert("you entered loadSig, bastard :P");
   str = cm.getValue();
   cm_output.setValue('');
   try {
      iflow_sig = ifloweval(str);
      $addIFlowSig(iflow_sig);    	
   } catch (e) {
   	  alert ('IFlow Signature could not be loaded.');	
   }
};

var loadIflowSig = function () {
	
};

window.addEventListener("message", messageHandler, true); 






