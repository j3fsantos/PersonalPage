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

// typing
var typing_environment = {};

window.addEventListener('load', function() {
   var i; 
   cm = CodeMirror.fromTextArea(document.getElementById('jsi'), 
          {lineNumbers: true, mode: "javascript"});

   cm_output = CodeMirror.fromTextArea(document.getElementById('jso'), 
          {lineNumbers: true, mode: "javascript"});

   category_select = document.getElementById('cat');
   example_select = document.getElementById('ex');
   
   for (i=0; i < category_names.length; i++) {
      category_select.options.add(new Option(category_names[i], i));
   }
   
   processCategories();
   catchange(0);
});

function loadex () {
	var current_cat_name, example, gamma, prop, selected_index, selector, type_str, types_text;
	
	current_cat_name = category_names[current_cat_index];
	selected_index = example_select.selectedIndex; 
	example = examples_by_cat[current_cat_index][selected_index];
	cm.setValue(example.prog_input);
	
	selector = '#example_categories div.category[name='+current_cat_name+'] div';
	types_text = $('.types', $($(selector)[selected_index])).text();  
	
    type_parser.full_str = types_text; 
    gamma = type_parser.parseVariableTypes();
     
    typing_environment = {}; 
    domClearSecurityTypes();
   
    for (prop in gamma) {
    	if (gamma.hasOwnProperty(prop)) {
           typing_environment[prop] = gamma[prop]; 
           type_str = sec_types.printType(gamma[prop]);
           domRegisterSecurityType(prop, type_str);
    	}
    }
    
    cm_output.setValue('');
    $('#res-type').val('');
    $('#res-writing-effect').val('');      
}

function refreshSecurityTypes () {
	var prop, type_str; 
	
	domClearSecurityTypes();
	for (prop in typing_environment) {
	   type_str = sec_types.printType(typing_environment[prop]);
	   domRegisterSecurityType(prop, type_str);
	}
}

function catchange(j) {
   var current_cat, i; 
   
   current_cat = examples_by_cat[current_cat_index];
   example_select.options.length = 0;
   for (i = 0; i < current_cat.length; i++) {
     example_select.options.add(new Option(current_cat[i].desc, i));
   }
}

function tab(id) {
   $('#'+atab).toggle();
   $('#'+id).toggle();
   atab = id;

   cm.refresh();
   return void(0);
}

var processCategories = function () {
   var i; 
   
   $('#example_categories div').each(function(index) {
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
      types = $('.types', this).text();
      
      examples_by_cat[cat_index].push({
      	desc: desc,
      	prog_input: prog_input, 
      	types: types
      }); 
     		
   });
};


function domClearSecurityTypes () {
	var i, number_of_rows;
	
	number_of_rows = $('#tabletypeenv')[0].rows.length; 
	for (i = number_of_rows-1; i >= 0; i--) {
		$('#tabletypeenv')[0].deleteRow(i);
	} 
}

function domRegisterSecurityType (var_name, type) {
   var index, new_tr, td_type, td_var_name;
 
   td_var_name = $(document.createElement('td'));
   td_var_name.text(var_name+':');
   td_var_name.toggleClass('tdvarname');
	       
         
   td_type = $(document.createElement('td'));
   td_type.text(type);
   td_type.toggleClass('tdtypestring');
	      
   new_tr = $(document.createElement('tr'));
   new_tr.append(td_var_name); 
   new_tr.append(td_type);
   
   index = $('#tabletypeenv')[0].rows.length; 
   
   new_tr.click(function() {
   	  var type; 
   	  
   	  $('#type-update-dialog .var_name').text(var_name);
   	  type =  $('.tdtypestring', $($('#tabletypeenv')[0].rows[index])).text();
      $('#type-update-dialog .type_text').text(type);
   	  
   	  $('#type-update-dialog').dialog({
         title: 'Update Type', 
	     buttons: {
	       'Remove Type': function () {
	       	   delete typing_environment[var_name];
	       	   refreshSecurityTypes();   
	           $(this).dialog('close');
	         }, 
	         
	       'Edit Type': function () {
	       	   updateTypingEnvironment(var_name, type, index);
	       	   $(this).dialog('close');
	         }, 
	         
	       Done: function () {
	    	   $(this).dialog('close');
	         } 
	       
           }, 
         width: 600
         });
   });

   $('#tabletypeenv').append(new_tr);

}

function registerSecurityType (var_name, type) {
   var parsed_type, ret;
   
   if (typing_environment.hasOwnProperty(var_name)) {
      alert('Variable ' + var_name + ' already has a type. You must delete it first!');
	  return false;
   }
	       
   try {
      type_parser.full_str = type;
      ret = type_parser.parseType(0);
	  parsed_type = ret.type;
	  typing_environment[var_name] = parsed_type;
   } catch (e) {
	  alert('Illegal Type!');
	  return false; 
   }
	       
   domRegisterSecurityType (var_name, type);
   return true; 
}


function updateSecurityType (var_name, type, index) {
   var parsed_type, ret, td_type;
   
   if (!typing_environment.hasOwnProperty(var_name)) {
      alert('Variable ' + var_name + ' has not been given a type yet!');
	  return false;
   }
	       
   try {
      type_parser.full_str = type;
	  ret = type_parser.parseType(0);
	  parsed_type = ret.type; 
	  typing_environment[var_name] = parsed_type;
   } catch (e) {
	  alert('Illegal Type!');
	  return false; 
   }
         
   td_type = $('.tdtypestring', $($('#tabletypeenv')[0].rows[index])); 
   td_type.text(type);
            
   return true; 
}


function updateTypingEnvironment (var_name, type, index) {
   var is_edit = false; 
   
   type =  $('.tdtypestring', $($('#tabletypeenv')[0].rows[index])).text();
   
   if (var_name) {
      is_edit = true; 
      $('#type-insertion-dialog #var_name').val(var_name); 
      $('#type-insertion-dialog textarea').val(type);
   }	
	
   $('#type-insertion-dialog').dialog({
      title: 'Add Type', 
	  buttons: {
	    Register: function () {
	       var parsed_type, span_type, span_var_name, text_node, type, var_name; 
	       
	       var_name = $('#var_name').val(); 
	       type = $('textarea', this).val();
	       
	       if (!is_edit && registerSecurityType (var_name, type)) {
	            $('#var_name').val('');
	            $('textarea', this).val('');
	       }
	       
	       if (is_edit && updateSecurityType (var_name, type, index)) {
	            $('#var_name').val('');
	            $('textarea', this).val('');
	       }
	       
	       $(this).dialog('close');
	    }, 
	    
	    Done: function () {
	    	$(this).dialog('close');
	    }
      }, 
      width: 600  
   });
}

function typecheck () {
   var e, instrumentation, output, reading_effect, st, str, writing_effect; 
   
   cm_output.setValue('');
   $('#res-type').val('');
   $('#res-writing-effect').val('');      
   str = cm.getValue();
   
   if (document.getElementById('radbutton_st').checked) {
      alert('This functionality is still under development');	  
   } else {
   	  try {
   	  	
   	   	 st = window.esprima.parse(str); 
         output = sec_types.typeCheck(st, typing_environment); 
         instrumentation = output.instrumentation; 
         instrumentation = window.escodegen.generate(instrumentation, option);
         cm_output.setValue(instrumentation);
         
         reading_effect = output.reading_effect;
         reading_effect = sec_types.conds.printTypeSet(reading_effect); 
         $('#res-type').val(reading_effect);
         
         writing_effect = output.writing_effect; 
         writing_effect = sec_types.conds.printLevelSet(writing_effect);
         $('#res-writing-effect').val(writing_effect); 
         	
      } catch (e) {
      	 if ((typeof e === 'object') && e.typing_error) {
      	    alert(e.message);   	
      	 }
      	 else {
      	    alert ('Program cannot be typed due to syntactic error.');	
      	 }
      	 
      	 return;
      }
      alert ('Program successfully Typed! Check Instrumentation Below.');
   }
   
}


