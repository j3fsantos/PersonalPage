(function() {
	var option = {
		format : {
			quotes : 'single',
			indent : {
				style : '\t'
			}
		}
	};

	var sendProgramToIFrame = function(prog) {
		var iframe = document.getElementById('exec_iframe');
		iframe.contentWindow.postMessage(prog, window.location);
	};

	var removeChildren = function(node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	};

	var inputHandler = function() {
		var apis_cb, coercions_cb, eval_cb, compiled_st, input_ta, output_prog, st, str;
        
        apis_cb = document.getElementById('apis_cb');
		eval_cb = document.getElementById('eval_cb');
		coercions_cb = document.getElementById('coercions_cb');
		input_ta = document.getElementById('prog_input');
		st = window.esprima.parse(input_ta.value);

		//st = comp.setUpCompiler(st, coercions_cb.checked, apis_cb.checked, eval_cb.checked);
		compiled_st = comp.compile(st);
		// To remove:
		str = JSON.stringify(compiled_st, null, '   ');
		alert(str);

		output_prog = window.escodegen.generate(compiled_st, option);
		$('#prog_output').val(output_prog);
		$('#prog_output').css('background-color', 'white');
	};

	var runCompiledProg = function() {
		var compiled_prog;
		compiled_prog = $('#prog_output').val();
		try {
			sendProgramToIFrame('comp' + compiled_prog);
		} catch (e) {
			alert('A problem occurred when trying to communicate with exec iframe');
		}
	};

	var processExamples = function() {
		var li_examples = $('#examples li');
		$('#examples_code span').each(function(index) {
			var example_code = $(this).text();
			var st = window.esprima.parse(example_code);
			example_code = window.escodegen.generate(st, option);
			$(li_examples[index]).click(function() {
				$('#prog_input').val(example_code);
			});
		});
	};

	var randomizeGeneration = function() {
		comp.identifiers.randomizeIdentifiers();
		window[comp.identifiers.consts.RUNTIME_IDENT] = _runtime;
	};

	var addExample = function() {
		var example = $('#prog_input').val();
		var new_span = $(document.createElement('span'));
		var new_li = $(document.createElement('li'));
		var total;

		total = $('#examples_code span').length;
		new_span.text(example);
		new_li.text('Example ' + (total + 1));

		$('#examples_code').append(new_span);
		$('#examples ul').append(new_li);

		processExamples();
	};

	var normalize = function() {
		var input_ta, normalized_st, output_prog, st, str;
		input_ta = document.getElementById('prog_input');
		st = window.esprima.parse(input_ta.value);

		normalized_st = comp.normalize(st);
		// To remove:
		str = JSON.stringify(normalized_st, null, '   ');
		alert(str);

		output_prog = window.escodegen.generate(normalized_st, option);
		$('#prog_input').val(output_prog);
	};

	var loadCSS = function() {
		var css_ta;
		css_ta = document.getElementById('css_input');
		sendProgramToIFrame('ucss' + css_ta.value);
	};

	window.onload = function() {
	    var b1, b2, b3, b4, b5, b6, b7;
		b1 = document.getElementById('compile_btn');
		b2 = document.getElementById('run_btn'); 
		b3 = document.getElementById('rand_btn'); 
		b4 = document.getElementById('add_btn'); 
		b5 = document.getElementById('normalize_btn');
		b6 = document.getElementById('load_css_btn');
        b7 = document.getElementById('load_ifsig'); 
		b1.onclick = inputHandler;
		b2.onclick = runCompiledProg;
		b3.onclick = randomizeGeneration;
		b4.onclick = addExample;
		b5.onclick = normalize;
		b6.onclick = loadCSS;
		b7.onclick = loadIFSig; 
		processExamples();

	};

	var messageHandler = function(message) {
		if ((message.data === 'IFlow Exception') || (message.data === 'Illegal Coercion')) {
			alert(message.data);
			$('#prog_output').css('background-color', 'red');
		}
	};
	
	var loadIFSig = function () {
	   var if_sig_text, st;
	   if_sig_text = $('#prog_input').val();
	   st = window.esprima.parse(if_sig_text);
	   if_sig_text = window.escodegen.generate(st, option);
	   try {
	      sendProgramToIFrame('ifsg' + if_sig_text);
	   } catch (e) {
	      alert('A problem occurred when trying to communicate with exec iframe');
	   } 
	}; 

	window.addEventListener("message", messageHandler, true);
})(); 