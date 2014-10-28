/*
 * 
 * _processArg -> iflow_sig._processArg(arg, index, evaluator)
 * _processRet ->  iflow_sig._processRet(ret)
 *
 * Property Lookup:
 * _iflow_sig._enforce(o, ê, _lev_ctxt); 
 * _iflow_sig._updtLab(_val_i, o, ê, _lev_ctxt);  
 * 
 * Property Update:  
 * _iflow_sig._enforce(o, ê_0, ê_1, _runtime.lat.lub(_lev_ctxt, C_l[ê_1]), _lev_ctxt);
 * _iflow_sig._updtLab(o, ê_0, ê_1, _runtime.lat.lub(_lev_ctxt, C_l[ê_1]), _lev_ctxt);
 *  
 * Function Call: 
 *_iflow_sig._enforce(lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 *_iflow_sig._updtLab(_ret, lev_ctxt, f, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 *
 * Method Call: 
 *_iflow_sig._enforce(_lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 *_iflow_sig._updtLab(_ret, _lev_ctxt, o, ê_p, ê_0,  C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 * 
 * Cosntructor Call: 
 *_iflow_sig._enforce(lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 *_iflow_sig._updtLab(_val_i, _lev_ctxt, F, ê_0, C_l[ê_0], ..., ê_n, C_l[ê_n]); 
 */

(function(exports) {
   
   // store reference to the original document
   var original_doc = document; 
   
   // Create element 
   var dom_consts = {
      SHADOW_PREFIX: exports.consts.VAR_SHADOW_PREFIX, 
      STRUCT_LEV_IDENT: exports.consts.STRUCT_PROP_IDENT, 
      DOM_PREFIX: '_dom_'
   }; 
   
   var dom_props = {
      TAG: dom_consts.DOM_PREFIX + 'tag', 
      INDEX: dom_consts.DOM_PREFIX + 'index',
      PNODE: dom_consts.DOM_PREFIX + 'pnode',
      LENGTH: dom_consts.DOM_PREFIX + 'lenght',
      //CHILD_NODES: dom_consts.DOM_PREFIX + 'child_nodes',
      IS_CHILDREN: dom_consts.DOM_PREFIX + 'is_children',
      VALUE: dom_consts.DOM_PREFIX + 'value', 
      QUERY: dom_consts.DON_PREFIX + 'query'
   };
   
   var dom_shadow_props = {
      TAG: dom_consts.SHADOW_PREFIX + dom_consts.DOM_PREFIX + 'tag', 
      INDEX: dom_consts.SHADOW_PREFIX + dom_consts.DOM_PREFIX + 'index',
      PNODE: dom_consts.SHADOW_PREFIX + dom_consts.DOM_PREFIX + 'pnode',
      LENGTH: dom_consts.SHADOW_PREFIX + dom_consts.DOM_PREFIX + 'lenght',
      //CHILD_NODES: dom_consts.SHADOW_PREFIX + dom_consts.DOM_PREFIX + 'child_nodes',
      IS_CHILDREN: dom_consts.SHADOW_PREFIX + dom_consts.DOM_PREFIX + 'is_children',
      VALUE: dom_consts.SHADOW_PREFIX + dom_consts.DOM_PREFIX + 'value',
      QUERY: dom_consts.SHADOW_PREFIX + dom_consts.DOM_PREFIX + 'query', 
      TAG_LEVEL_PREFIX: dom_consts.SHADOW_PREFIX + dom_consts.DOM_PREFIX + 'tag_level_'
   };

   var getIndexedProp = function (index) {
      return dom_consts.DOM_PREFIX + index; 
   };

   var getShadowIndexedProp = function (index) {
      return dom_consts.SHADOW_PREFIX + dom_consts.DOM_PREFIX + index; 
   };

   // CreateElement 

   var create_element_iflow_sig = {}; 
   
   create_element_iflow_sig.name = 'createElement';
   
   create_element_iflow_sig._enforce = function (lev_ctxt, o, prop, arg, arg_lev) {}; 
   
   create_element_iflow_sig._updtLab = function (ret, lev_ctxt, o, prop, arg, arg_lev) {
      var lev; 
      
      // updating internal values
      ret[dom_props.TAG] = ret.nodeName; 
      ret[dom_props.INDEX] = null; 
      ret[dom_props.PNODE] = null; 
      ret[dom_props.LENGTH] = 0; 
      
      // updating internal levels
      lev = exports.lat.lub(lev_ctxt, arg_lev);
      ret[dom_shadow_props.TAG] = lev; 
      ret[dom_shadow_props.INDEX] = lev; 
      ret[dom_shadow_props.PNODE] = lev; 
      ret[dom_shadow_props.LENGTH] = lev;
      
      return lev; 
   };
   
   create_element_iflow_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'method_call') && (o === original_doc) && (prop === 'createElement'); 
   };

   exports.api_register.registerIFlowSig(create_element_iflow_sig);
   
   
   // CreateTextNode

   var create_text_node_iflow_sig = {}; 
   
   create_text_node_iflow_sig.name = 'create_text_node';
   
   create_text_node_iflow_sig._enforce = function (lev_ctxt, o, prop, arg, arg_lev) {}; 
   
   create_text_node_iflow_sig._updtLab = function (ret, lev_ctxt, o, prop, arg, arg_lev) {
      var lev; 
      
      // updating internal values
      ret[dom_props.TAG] = ret.nodeName; 
      ret[dom_props.INDEX] = null; 
      ret[dom_props.PNODE] = null; 
      
      // updating internal levels
      lev = exports.lat.lub(lev_ctxt, arg_lev);
      ret[dom_shadow_props.TAG] = lev; 
      ret[dom_shadow_props.INDEX] = lev; 
      ret[dom_shadow_props.PNODE] = lev; 
      
      return lev; 
   };
   
   create_text_node_iflow_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'method_call') && (o === original_doc) && (prop === 'createTextNode'); 
   };

   exports.api_register.registerIFlowSig(create_text_node_iflow_sig);
   
   
   // removeChild
   
   var remove_child_iflow_sig = {}; 
   
   remove_child_iflow_sig.name = 'remove_child';
   
   remove_child_iflow_sig._enforce = function (lev_ctxt, parent, prop, child, child_lev) {
      var pc; 
      
      // pre-condition
      if (child[dom_props.PNODE] != parent) {
         exports.diverge();
      }
      
      pc = exports.lat.lub(lev_ctxt, child_lev); 
      if (!exports.lat.leq(pc, child[dom_shadow_props.INDEX])) {
         exports.diverge(); 
      } 
   }; 
   
   remove_child_iflow_sig._updtLab = function (ret, lev_ctxt, parent, prop, child, child_lev) {
      var child_index, i, len, number_of_children, updated_child;  
      
      // updating the index properties of the parent, the length property of the parent, the @index properties of the right siblings
      // the levels of the index properties of the parent 
      child_index = child[dom_props.INDEX];
      number_of_children = parent[dom_props.LENGTH]; 
      for (i = child_index, len = number_of_children - 1; i < len; i++) {
         updated_child = parent[getIndexedProp(i+1)];
         parent[getIndexedProp(i)] = updated_child;
         parent[getShadowIndexedProp(i)] = parent[getShadowIndexedProp(i+1)];
         updated_child[dom_props.INDEX] =  updated_child[dom_props.INDEX] - 1; 
      }
      parent[dom_props.LENGTH] = parent[dom_props.LENGTH] - 1; 
      
      // updating the properties of child 
      child[dom_props.INDEX] = null; 
      child[dom_props.PNODE] = null; 
      
      return lev_ctxt; 
   };
   
   remove_child_iflow_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'method_call') && (exports.hasOwnProperty(o, dom_props.INDEX)) && (prop === 'removeChild'); 
   };

   exports.api_register.registerIFlowSig(remove_child_iflow_sig);

   
   // append_child - fresh node
     
   var enforce_append_fresh_child = function (lev_ctxt, parent, prop, child, child_lev) {
      var pc;  
      
      pc = exports.lat.lub(lev_ctxt, child_lev); 
      if ((!exports.lat.leq(pc, child[dom_shadow_props.INDEX])) || (!exports.lat.leq(pc, parent[dom_consts.STRUCT_LEV_IDENT]))) {
         exports.diverge(); 
      } 
   }; 
   
   var updt_append_fresh_child = function (ret, lev_ctxt, parent, prop, child, child_lev) {
      var lev, n;    
   
      lev = exports.lat.lub(child[dom_shadow_props.INDEX], parent[dom_shadow_props.INDEX], parent[dom_consts.STRUCT_LEV_IDENT]); 
      n = parent[dom_props.LENGTH];
      
      // update parent node - @length and @n (where n is the number of children) 
      parent[getIndexedProp(n)] = child; 
      parent[dom_props.LENGTH] = n+1; 
      
      // update child node - @pnode and @index
      child[dom_props.INDEX] = n; 
      child[dom_props.PNODE] = parent; 
      child.upgTreeLevel = upgTreeLevel;
      
      // update levels of @pnode and @index of child and @n of parent
      child[dom_shadow_props.INDEX] = lev; 
      child[dom_shadow_props.PNODE] = lev;
      parent[getShadowIndexedProp(n)] = lev;
      parent[dom_shadow_props.LENGTH] = lev; 
      parent[dom_consts.STRUCT_LEV_IDENT] = lev;   
      
      if (!exports.hasOwnProperty(window, dom_shadow_props.TAG_LEVEL_PREFIX+child.nodeName)) {
         window[dom_shadow_props.TAG_LEVEL_PREFIX+child.nodeName] = exports.lat.bot; 
      }
      
      if (!predicateWLD(document, {})) {
         exports.diverge(); 
      }
      
      return exports.lat.lub(lev_ctxt, child_lev);  
   };
   
   var isAncestor = function (node_1, node_2) {
      return node_1 === node_2; 
   };
   
   
   // appendChild 
   
   var append_child_iflow_sig = {}; 
   
   append_child_iflow_sig.name = 'append_child';
   
   append_child_iflow_sig._enforce = function (lev_ctxt, parent, prop, child, child_lev) {
      var lev_p, old_parent; 
      
      if (isAncestor(child, parent)) {
         exports.diverge();
      }
      
      old_parent = child[dom_props.PNODE];
      if (old_parent) {
         // the child has a parent node
         lev_p = exports.lat.lub(lev_ctxt, child[dom_shadow_props.PNODE]);
         remove_child_iflow_sig._enforce(lev_p, old_parent, 'removeChild', child, child_lev);
         old_parent.removeChild(child); 
         remove_child_iflow_sig._updtLab(null, lev_p, old_parent, 'removeChild', child, child_lev);  
      }
      
      enforce_append_fresh_child(lev_ctxt, parent, prop, child, child_lev);
   }; 
   
   append_child_iflow_sig._updtLab = updt_append_fresh_child;
   
   append_child_iflow_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'method_call') && (exports.hasOwnProperty(o, dom_props.INDEX)) && (prop === 'appendChild'); 
   };

   exports.api_register.registerIFlowSig(append_child_iflow_sig);
   
   
   // childNodes
   
   var child_nodes_iflow_sig = {}; 
   
   child_nodes_iflow_sig.name = 'lookup_child_nodes';
   
   child_nodes_iflow_sig._enforce = function (o, prop, ctxt_lev) {};
   
   child_nodes_iflow_sig._updtLab = function (children_list, node, prop, ctxt_lev) {
      if (!exports.hasOwnProperty(children_list, dom_props.IS_CHILDREN)) {
         children_list[dom_props.IS_CHILDREN] = true;
         children_list[dom_props.PNODE] = node; 
      } 
      return ctxt_lev; 
   }; 
   
   child_nodes_iflow_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'prop_lookup') && (exports.hasOwnProperty(o, dom_props.INDEX)) && (prop === 'childNodes'); 
   };
   
   exports.api_register.registerIFlowSig(child_nodes_iflow_sig);
   
   
   // childAt
   
   var child_at_iflow_sig = {}; 
   
   child_at_iflow_sig.name = 'lookup_child_at';
   
   child_at_iflow_sig._enforce = function (o, prop, ctxt_lev) {};
   
   child_at_iflow_sig._updtLab = function (child, children_list, index, ctxt_lev) {
      var index_lev, parent; 
      
      parent = children_list[dom_props.PNODE]; 
      index_lev = parent[getShadowIndexedProp(index)];
      return exports.lat.lub(ctxt_lev, index_lev); 
   };
   
   child_at_iflow_sig._isInDomain = function (o, prop, flag) {
      var is_in_domain; 
      
      is_in_domain = true; 
      if (prop === 'length') {
         is_in_domain = false; 
      } 
      
      //FALTA VERIFICAR SE O INDICE E VALIDO!!!!!!!
      
      return (flag === 'prop_lookup') && (exports.hasOwnProperty(o, dom_props.IS_CHILDREN)) && is_in_domain; 
   };
   
   exports.api_register.registerIFlowSig(child_at_iflow_sig);
   
   
   // Number of Children 
   
   var number_of_children_iflow_sig = {}; 
   
   number_of_children_iflow_sig.name = 'lookup_number_of_children'; 
   
   number_of_children_iflow_sig._enforce = function (o, prop, ctxt_lev) {};

   number_of_children_iflow_sig._updtLab = function (len, children_list, prop_len, ctxt_lev) {
      var index_lev, parent; 
      
      parent = children_list[dom_props.PNODE]; 
      len_lev = parent[dom_consts.STRUCT_LEV_IDENT];
      return exports.lat.lub(ctxt_lev, len_lev); 
   };
   
   number_of_children_iflow_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'prop_lookup') && (exports.hasOwnProperty(o, dom_props.IS_CHILDREN)) && (prop === 'length'); 
   };
   
   exports.api_register.registerIFlowSig(number_of_children_iflow_sig);
   
   
   // Parent Node

   var parent_node_iflow_sig = {}; 
   
   parent_node_iflow_sig.name = 'lookup_parent_node'; 
   
   parent_node_iflow_sig._enforce = function (o, prop, ctxt_lev) {};

   parent_node_iflow_sig._updtLab = function (pnode, node, prop_parent, ctxt_lev) {
      return exports.lat.lub(ctxt_lev, node[dom_shadow_props.PNODE]); 
   };
   
   parent_node_iflow_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'prop_lookup') && (exports.hasOwnProperty(o, dom_props.INDEX)) && (prop === 'parentNode'); 
   };

   exports.api_register.registerIFlowSig(parent_node_iflow_sig);
   
   
    // Next Sibling

   var next_sibling_iflow_sig = {}; 
   
   next_sibling_iflow_sig.name = 'lookup_next_sibling';
   
   next_sibling_iflow_sig._enforce = function (o, prop, ctxt_lev) {};

   next_sibling_iflow_sig._updtLab = function (next_sibling, node, prop_next_sibling, ctxt_lev) {
      var lev_i, node_index, parent; 
      
      parent = node[dom_props.PNODE]; 
      node_index = node[dom_props.INDEX]; 
      if ((node_index + 1) < parent[dom_props.LENGTH]) {
         lev_i = parent[getShadowIndexedProp(node_index + 1)];
      } else {
         lev_i = parent[dom_consts.STRUCT_LEV_IDENT];
      }
    
      return exports.lat.lub(ctxt_lev, lev_i, node[dom_shadow_props.PNODE]); 
   };
   
   next_sibling_iflow_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'prop_lookup') && (exports.hasOwnProperty(o, dom_props.INDEX)) && (prop === 'nextSibling'); 
   };

   exports.api_register.registerIFlowSig(next_sibling_iflow_sig);
   
   
   // document.body

   var body_iflow_sig = {}; 
   
   body_iflow_sig.name = 'lookup_document_body'; 
   
   body_iflow_sig._enforce = function (o, prop, ctxt_lev) {};

   body_iflow_sig._updtLab = function (body, doc_node, prop_body, ctxt_lev) {
      return exports.lat.lub(ctxt_lev, document.body[dom_shadow_props.INDEX]); 
   };
   
   body_iflow_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'prop_lookup') && (o === original_doc) && (prop === 'body'); 
   };

   exports.api_register.registerIFlowSig(body_iflow_sig);
   
   
   // ugpTreeLevel

   var upgTreeLevel = function () {}; 
   var upg_tree_level_iflow_sig = {}; 
   
   upg_tree_level_iflow_sig.name = 'upg_tree_level'; 
   
   upg_tree_level_iflow_sig._enforce = function (lev_ctxt, node, prop, new_tree_level, level_of_level) {
      var child, next_sibling, node_index, old_level, parent_node, x;
      
      lev_ctxt = exports.lat.lub(lev_ctxt, level_of_level); 
      parent_node = node[dom_props.PNODE]; 
      node_index = node[dom_props.INDEX]; 
      
      x = node[prop];
      if (x !== upgTreeLevel) {
         exports.diverge(); 
      }
      
      old_level = node[dom_shadow_props.INDEX];
      if (!exports.lat.leq(lev_ctxt, old_level)) {
         exports.diverge();
      }
      
      new_tree_level = exports.lat.lub(old_level, new_tree_level); 
      next_sibling = node.nextSibling;  
      if (next_sibling) {
         if (!exports.lat.leq(new_tree_level, next_sibling[dom_shadow_props.INDEX])) {
            exports.diverge();
         }
      } else {
         if (!exports.lat.leq(new_tree_level, parent_node[dom_consts.STRUCT_LEV_IDENT])) {
            exports.diverge();
         }
      }
      
      for (var i = 0, len = node.childNodes; i < len; i++) {
         child = node.childNodes[i]; 
         if (!exports.lat.leq(new_tree_level, child[dom_shadow_props.INDEX])) {
            exports.diverge(); 
         }
      }
      
      parent_node[getShadowIndexedProp(node_index)] = new_tree_level; 
      node[dom_shadow_props.INDEX] = new_tree_level; 
      node[dom_shadow_props.PNODE] = new_tree_level;
      
   };

   upg_tree_level_iflow_sig._updtLab = function () { };
   
   upg_tree_level_iflow_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'method_call') && (exports.hasOwnProperty(o, dom_props.INDEX)) && (prop === 'upgTreeLevel'); 
   };

   exports.api_register.registerIFlowSig(upg_tree_level_iflow_sig);


   // getElementsByTagName

   var get_elements_by_tag_name_sig = {}; 
   
   get_elements_by_tag_name_sig.name = 'get_elements_by_tag_name';
   
   get_elements_by_tag_name_sig._enforce = function (lev_ctxt, doc, prop, query_string, query_string_lev) {}; 
   
   get_elements_by_tag_name_sig._updtLab = function (ret, lev_ctxt, doc, prop, query_string, query_string_lev) {     
      query_string = query_string.toUpperCase();  
      ret[dom_props.QUERY] = query_string;  
      ret[dom_consts.STRUCT_LEV_IDENT] = lev_ctxt; 
      ret[dom_shadow_props.QUERY] = exports.lat.lub(lev_ctxt, query_string_lev); 
   };
   
   get_elements_by_tag_name_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'method_call') && (o === original_doc) && (prop === 'getElementsByTagName'); 
   };

   exports.api_register.registerIFlowSig(get_elements_by_tag_name_sig);


   // execute live query
   
   var execute_live_query_sig = {}; 
   
   execute_live_query_sig.name = 'execute_live_query';
   
   execute_live_query_sig._enforce = function (query_obj, prop, lev_ctxt) {}; 
   
   execute_live_query_sig._updtLab = function (ret, query_obj, prop, lev_ctxt) {
      var query_str, query_str_level, ret_lev; 
      query_str = query_obj[dom_props.QUERY]; 
      query_str_level = query_obj[dom_shadow_props.QUERY]; 
      
      ret_lev =  exports.lat.lub(lev_ctxt, query_str_level); 
      if (ret && (prop !== 'length')) {
         ret_lev = exports.lat.lub(ret_lev, ret[dom_shadow_props.INDEX]); 
      } else {
         ret_lev = exports.lat.lub(ret_lev, window[dom_shadow_props.TAG_LEVEL_PREFIX+query_str]);
      }
      
      return ret_lev; 
   };
   
   execute_live_query_sig._isInDomain = function (o, prop, flag) {
      return (flag === 'prop_lookup') && (exports.hasOwnProperty(o, dom_props.QUERY)); 
   };

   exports.api_register.registerIFlowSig(execute_live_query_sig);
   
   
   // upgTagGlobalLevel 
   
   var upgGlobalTagLevel = function () {};
   window.upgGlobalTagLevel = upgGlobalTagLevel; 
   var upg_global_tag_level_sig = {}; 
   
   upg_global_tag_level_sig.name = 'upg_global_tag_level';
   
   upg_global_tag_level_sig._enforce = function (lev_ctxt, fun, tag, tag_level, level, level_of_level) {
      var old_tag_level; 
      
      old_tag_level = window[dom_shadow_props.TAG_LEVEL_PREFIX+tag];
      if (!exports.lat.leq(lev_ctxt, old_tag_level)) {
         exports.diverge();
      }
      
      if (fun !== upgGlobalTagLevel) {
         exports.diverge();
      }
      
      if (!exports.lat.leq(level_of_level, exports.lat.bot)) {
         exports.diverge(); 
      }
      
      window[dom_shadow_props.TAG_LEVEL_PREFIX+tag] = exports.lat.lub(old_tag_level, level);  
   }; 
   
   upg_global_tag_level_sig._updtLab = function (ret, lev_ctxt, fun, arg, arg_lev) {};
   
   upg_global_tag_level_sig._isInDomain = function (f, prop, flag) {
      return (flag === 'function_call') && (f === upgGlobalTagLevel); 
   };

   exports.api_register.registerIFlowSig(upg_global_tag_level_sig);
   
   
   
   // Prepare DOM
   
   var domDFS = function (node, index, process) {
     
      if (node.nodeType === 1) {
          node;
      }
     
      if ((node.nodeType !== 1) && (node.nodeType !== 3) && (node.nodeType !== 9) && (node.nodeType !== 11)) return; 
      
      process(node, index);
      
      if (!node.childNodes) return nodes;
      
      for (var i = 0, len = node.childNodes.length; i < len; i++) {
         domDFS(node.childNodes[i], i, process); 
      }  
   };
   
   var predicateWLD = function (node, last_tag_level_register) {
      
      if (!last_tag_level_register) return last_tag_level_register; 
      if ((node.nodeType !== 1) && (node.nodeType !== 3) && (node.nodeType !== 9)) return last_tag_level_register;
      
      // Constraint 1 - levels must be increasing 
      if (!exports.lat.leq(last_tag_level_register[node.tagName], node[dom_shadow_props.INDEX])) {
         return false; 
      }
      
      // Constraint 2 - levels must be lower than the global levels
      if (!exports.lat.leq(node[dom_shadow_props.INDEX], window[dom_shadow_props.TAG_LEVEL_PREFIX+node.tagName])) {
         return false; 
      }
      
      last_tag_level_register[node.tagName] = node[dom_shadow_props.INDEX];
      
      if (!node.childNodes) return last_tag_level_register;
        
      for (var i = 0, len = node.childNodes.length; i < len; i++) {
         last_tag_level_register = predicateWLD(node.childNodes[i], last_tag_level_register);
         if (!last_tag_level_register) {
            return last_tag_level_register; 
         } 
      }
      
      return last_tag_level_register; 
   }; 
   
   var preProcessNode = function (node, index) {
      var lev; 
      
      node[dom_props.TAG] = node.nodeName; 
      node[dom_props.INDEX] = index; 
      node[dom_props.PNODE] = node.parentNode;  
      
      // updating internal levels
      lev = exports.lat.bot;
      node[dom_shadow_props.TAG] = lev; 
      node[dom_shadow_props.INDEX] = lev; 
      node[dom_shadow_props.PNODE] = lev;
      
      node.upgTreeLevel = upgTreeLevel; 
      
      
      if (!exports.hasOwnProperty(window, dom_shadow_props.TAG_LEVEL_PREFIX+node.nodeName)) {
         window[dom_shadow_props.TAG_LEVEL_PREFIX+node.nodeName] = exports.lat.bot; 
      }
      
   }; 
   
   $(function() {
      domDFS(document, null, preProcessNode); 
   });  

   
})(_runtime); 