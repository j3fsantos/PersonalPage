//Test
$(function() {

   var escogen_option = {
      format : {
         quotes : 'single',
         indent : {
            style : '\t'
         }
      }
   };

   module('Testing External Libraries - escodegen + esprima');

   test('Basic Parsing and Printing Test 1', function() {
      var input_prog, input_st, output_prog, output_st;
      input_prog = 'if(x) { alert(\'macaco\'); } else { alert(\'banana\'); }';
      input_st = window.esprima.parse(input_prog);
      output_st = input_st;
      output_prog = window.escodegen.generate(output_st, escogen_option);
      ok(output_prog);
   });

	test('Basic Parsing and Printing Test 2', function() {
      var input_prog, input_st, output_prog, output_st;
      input_prog = 'x = f();';
      input_st = window.esprima.parse(input_prog);
      output_st = input_st;
      output_prog = window.escodegen.generate(output_st, escogen_option);
      ok(output_prog);
   });
   
   test('Basic Parsing and Printing Test 3', function() {
      var input_prog, input_st, output_prog, output_st;
      input_prog = 'x = f(); z=4; u=20; ';
      input_st = window.esprima.parse(input_prog);
      output_st = input_st;
      output_prog = window.escodegen.generate(output_st, escogen_option);
      ok(output_prog);
   });

	test('Basic Parsing and Printing Test 4', function() {
      var input_prog, input_st, output_prog, output_st;
      input_prog = 'f() ';
      input_st = window.esprima.parse(input_prog);
      output_st = input_st;
      output_prog = window.escodegen.generate(output_st, escogen_option);
      ok(output_prog);
   });
   
   module('Testing uitls.js');
   
   test('Testing printExprST', function() {
      var assignment_st,
          assingment_str, 
          left_st, 
          right_st; 
      left_st = window.esprima.delegate.createIdentifier('x');
      right_st = window.esprima.delegate.createLiteral2('xpto'); 
      assignment_st = window.esprima.delegate.createAssignmentExpression('=', left_st, right_st); 
      assignment_str = window.util.printExprST(assignment_st); 
      equal(assignment_str, 'x = \'xpto\''); 
   });
   
   test('Auxiliar Test', function() {
      var f, str; 
      f = eval;
      str = util.getFunctionName(f);
      equal(str, 'eval'); 
   }); 
   
   
   module('Testing the dom...');
   
   test('dom - createTextNode', function() {
      var str; 
      var n = document.createTextNode('batata'); 
      var x = n.constructor; 
      alert(n.constructor.toString())
      ok(true);
   });
   
   
   
});
