(function() {
	var option = {
		format : {
			quotes : 'single',
			indent : {
				style : '\t'
			}
		}
	};

	var removeChildren = function(node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	};

	var inputHandler = function() {
		var gamma, lambda_types, lit_annotations, output_prog, property_annotations, st, str;
        
        str = $('#prog_input').val();
        st = window.esprima.parse(str); 
        
        str = $('#global_vars_types').val();
        type_parser.full_str = str; 
        gamma = type_parser.parseVariableTypes(); 
        
        str = $('#prop_annotations').val();
        type_parser.full_str = str; 
        property_annotations = type_parser.parsePropertySets(); 
        
		str = $('#lit_annotations').val(); 
		type_parser.full_str = str; 
        lit_annotations = type_parser.parseLitTypes(); 
        
        sec_types.property_annotations = property_annotations;
        sec_types.annotation_index = 0;
        sec_types.lit_annotations = lit_annotations; 
        sec_types.lit_index = 0; 
          
        output_prog = sec_types.typeCheck(st, gamma); 
		output_prog = window.escodegen.generate(output_prog, option);
		$('#prog_output').val(output_prog);
					
		alert('END'); 
		//output_prog = window.escodegen.generate(st, option);
		//$('#prog_output').css('background-color', 'white');
	};

	var processExamples = function() {
		
		$('#examples_code div').each(function(index) {
		    var prog_input, global_vars_types, prop_annotations, lit_annotations, st, new_li; 
		
			prog_input = $('.prog_input', this).text();
		    global_vars_types = $('.global_vars_types', this).text();
		    prop_annotations = $('.prop_annotations', this).text();
		    lit_annotations = $('.lit_annotations', this).text();
		
			st = window.esprima.parse(prog_input);
			prog_input = window.escodegen.generate(st, option);
			
			new_li = $(document.createElement('li'));
            new_li.text('Example ' + (index + 1));
            new_li.click(function() {
				$('#prog_input').val(prog_input);
				$('#global_vars_types').val(global_vars_types);
				$('#prop_annotations').val(prop_annotations);
				$('#lit_annotations').val(lit_annotations);
			});
			
			$('#examples ul').append(new_li);
			
		});
	};

	window.onload = function() {
	    var b1;
		b1 = document.getElementById('type_btn');
		b1.onclick = inputHandler;
		processExamples();
	};

})();

