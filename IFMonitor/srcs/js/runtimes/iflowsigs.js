// Alert - Policy: cannot alert confidential information
// only information labeled with the bottom level of the security lattice can be alerted
(function (exports) {
   var iflow_sig = {}; 
   var original_alert = alert; 
   
   iflow_sig.check = function (lev_win, lev_fun, lev_arg, win_str, fun, arg) {
      $check(exports.lat.lub(lev_arg, lev_fun, lev_win) === exports.lat.bot);
   };
   
   iflow_sig.label = function (val_ret, lev_win, lev_fun, lev_arg, win_str, fun, arg) {
      return exports.lat.lub(lev_arg, lev_fun, lev_win); 
   }; 
   
   iflow_sig.domain = function (win_str, fun) {
      return (win_str === 'window') && (fun === original_alert); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime); 



// Confirm: the result of confirm is always labeled with the most confidential level
// there are no restrictions on the context on which it can be invoked
(function (exports) {
   var iflow_sig = {}; 
   var original_confirm = confirm; 
   
   iflow_sig.check = function (lev_win, lev_fun, lev_arg, win_str, fun, arg) {
      $check(exports.lat.lub(lev_arg, lev_fun, lev_win) === exports.lat.bot);
   };
   
   iflow_sig.label = function (val_ret, lev_win, lev_fun, lev_arg, win_str, fun, arg) {
      return exports.lat.top; 
   }; 
   
   iflow_sig.domain = function (win_str, fun) {
      return (win_str === 'window') && (fun === original_confirm); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// createElement
(function (exports) {
   var iflow_sig = {}; 
   var original_document = document; 
   
   iflow_sig.check = function (lev_doc, lev_meth_name, lev_tag_name, doc, meth_name, tag_name) {
   };
   
   iflow_sig.label = function (new_node, lev_doc, lev_meth_name, lev_arg, doc, meth_name, tag_name) {
   	  var lev; 
   	  
   	  lev = exports.lat.lub(lev_doc, lev_meth_name, lev_arg);
      new_node[exports.consts.DOM_STRUCT] = lev; 
      new_node[exports.consts.DOM_POS] = lev;
      new_node[exports.consts.DOM_VAL] = lev;
      
      new_node.dom_upg_struct = function () {};
      new_node.dom_upg_pos = function () {};
      
      return lev;  
   }; 
   
   iflow_sig.domain = function (doc, meth_name) {
      return (doc === original_document) && (meth_name === 'createElement'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// createTextNode
(function (exports) {
   var iflow_sig = {}; 
   var original_document = document; 
   
   iflow_sig.check = function (lev_doc, lev_meth_name, lev_text, doc, meth_name, text) {
   };
   
   iflow_sig.label = function (new_node, lev_doc, lev_meth_name, lev_text, doc, meth_name, text) {
   	  var lev; 
   	  
   	  lev = exports.lat.lub(lev_doc, lev_meth_name, lev_text);
      new_node[exports.consts.DOM_STRUCT] = lev; 
      new_node[exports.consts.DOM_POS] = lev;
      new_node[exports.consts.DOM_VAL] = lev;
      
      new_node.dom_upg_struct = function () {};
      new_node.dom_upg_pos = function () {};
      
      return lev;  
   }; 
   
   iflow_sig.domain = function (doc, meth_name) {
      return (doc === original_document) && (meth_name === 'createTextNode'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// append
(function (exports) {
   var iflow_sig = {}; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_parent, lev_meth_name, lev_child, new_parent, meth_name, child) {
      var lev, new_left_sibling, old_parent; 
   	  
   	  lev = exports.lat.lub(lev_parent, lev_meth_name, lev_child);
   	  $check(exports.lat.leq(lev, new_parent[exports.consts.DOM_STRUCT]));
   	  $check(exports.lat.leq(lev, child[exports.consts.DOM_POS]));
   	  
   	  if (new_parent.childNodes.length > 0) {
   	     new_left_sibling = new_parent.childNodes[new_parent.childNodes.length - 1];
   	     $check(exports.lat.leq(new_left_sibling[exports.consts.DOM_POS], child[exports.consts.DOM_POS]));
   	  }
   	  
   	  if (child.parentNode) {
   	  	 old_parent = child.parentNode; 
   	  	 $check(exports.lat.leq(lev, old_parent[exports.consts.DOM_STRUCT]));
   	  }
   };
   
   iflow_sig.label = function (new_node, lev_parent, lev_meth_name, lev_child) {
   	  var lev; 
   	  
   	  lev = exports.lat.lub(lev_parent, lev_meth_name, lev_child);
      return lev;  
   }; 
   
   iflow_sig.domain = function (node, meth_name) {
   	  var is_dom;   
   	  is_dom = hasOwnProperty(node, exports.consts.DOM_STRUCT) 
   	     && hasOwnProperty(node, exports.consts.DOM_POS)
   	     && hasOwnProperty(node, exports.consts.DOM_VAL);
      return is_dom && (meth_name === 'appendChild'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// remove
(function (exports) {
   var iflow_sig = {}; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_parent, lev_meth_name, lev_child, parent, meth_name, child) {
      var lev; 
   	  lev = exports.lat.lub(lev_parent, lev_meth_name, lev_child);
   	  $check(exports.lat.leq(lev, parent[exports.consts.DOM_STRUCT]));
   	  $check(exports.lat.leq(lev, child[exports.consts.DOM_POS]));
   };
   
   iflow_sig.label = function (new_node, lev_parent, lev_meth_name, lev_child) {
   	  var lev; 
   	  lev = exports.lat.lub(lev_parent, lev_meth_name, lev_child);
      return lev;  
   }; 
   
   iflow_sig.domain = function (node, meth_name) {
   	  var is_dom;   
   	  is_dom = hasOwnProperty(node, exports.consts.DOM_STRUCT) 
   	     && hasOwnProperty(node, exports.consts.DOM_POS)
   	     && hasOwnProperty(node, exports.consts.DOM_VAL);
      return is_dom && (meth_name === 'removeChild'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// parentNode
(function (exports) {
   var iflow_sig = {}; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_node, lev_prop, node, prop) {
   };
   
   iflow_sig.label = function (parent, lev_node, lev_prop, node, prop) {
   	  var lev; 
   	  lev = exports.lat.lub(lev_node, lev_prop, node[exports.consts.DOM_POS]);
      return lev; 
   }; 
   
   iflow_sig.domain = function (node, prop_name) {
   	  var is_dom;   
   	  is_dom = hasOwnProperty(node, exports.consts.DOM_STRUCT) 
   	     && hasOwnProperty(node, exports.consts.DOM_POS)
   	     && hasOwnProperty(node, exports.consts.DOM_VAL);
      return is_dom && (prop_name === 'parentNode'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);




// nodeValue
(function (exports) {
   var iflow_sig = {}; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_node, lev_prop, node, prop) {
   };
   
   iflow_sig.label = function (value, lev_node, lev_prop, node, prop) {
   	  var lev; 
   	  lev = exports.lat.lub(lev_node, lev_prop, node[exports.consts.DOM_VAL]);
      return lev; 
   }; 
   
   iflow_sig.domain = function (node, prop_name, update) {
   	  var is_dom;   
   	  is_dom = hasOwnProperty(node, exports.consts.DOM_STRUCT) 
   	     && hasOwnProperty(node, exports.consts.DOM_POS)
   	     && hasOwnProperty(node, exports.consts.DOM_VAL);
      return is_dom && (prop_name === 'nodeValue') && (update !== 'update'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// storeValue
(function (exports) {
   var iflow_sig = {}; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_node, lev_prop, lev_value, node, prop, value) {
      var lev; 
      lev = exports.lat.lub(lev_node, lev_prop);
      $check(exports.lat.leq(lev, node[exports.consts.DOM_VAL]));
   };
   
   iflow_sig.label = function (value, lev_node, lev_prop, lev_value, node, prop, value) {
   	  var lev; 
   	  lev = exports.lat.lub(lev_node, lev_prop, lev_value);
   	  node[exports.consts.DOM_VAL] = lev;
      return lev; 
   }; 
   
   iflow_sig.domain = function (node, prop_name, update) {
   	  var is_dom;   
   	  is_dom = hasOwnProperty(node, exports.consts.DOM_STRUCT) 
   	     && hasOwnProperty(node, exports.consts.DOM_POS)
   	     && hasOwnProperty(node, exports.consts.DOM_VAL);
      return is_dom && (prop_name === 'nodeValue') && (update === 'update'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



//  document.body
(function (exports) {
   var iflow_sig = {}; 
   var original_document = document;
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_doc, lev_prop, doc, prop) {
   };
   
   iflow_sig.label = function (body, lev_doc, lev_prop, doc, prop) {
   	  var lev;
   	  lev = exports.lat.lub(lev_doc, lev_prop, body[exports.consts.DOM_POS]);
   	  return lev; 
   }; 
   
   iflow_sig.domain = function (node, prop_name) {
   	  return (node === document) && (prop_name === 'body'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// childNodes
(function (exports) {
   var iflow_sig = {}; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_node, lev_prop, node, prop) {
   };
   
   iflow_sig.label = function (value, lev_node, lev_prop, node, prop) {
   	  var lev; 
   	  lev = exports.lat.lub(lev_node, lev_prop);
   	  value[exports.consts.DOM_LEV] = lev;
   	  value[exports.consts.DOM_PARENT] = node;
      return lev; 
   }; 
   
   iflow_sig.domain = function (node, prop_name) {
   	  var is_dom;   
   	  is_dom = hasOwnProperty(node, exports.consts.DOM_STRUCT) 
   	     && hasOwnProperty(node, exports.consts.DOM_POS)
   	     && hasOwnProperty(node, exports.consts.DOM_VAL);
      return is_dom && (prop_name === 'childNodes'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// childNodes - length
(function (exports) {
   var iflow_sig = {}; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_node, lev_prop, node, prop) {
   };
   
   iflow_sig.label = function (value, lev_node, lev_prop, node, prop) {
   	  var lev, parent; 
   	  parent = node[exports.consts.DOM_PARENT];
   	  lev = exports.lat.lub(lev_node, lev_prop, node[exports.consts.DOM_LEV]);
   	  lev = exports.lat.lub(lev, parent[exports.consts.DOM_STRUCT]);
      return lev; 
   }; 
   
   iflow_sig.domain = function (node, prop_name) {
   	  var is_child_nodes;   
   	  is_child_nodes = hasOwnProperty(node, exports.consts.DOM_LEV) 
   	     && hasOwnProperty(node, exports.consts.DOM_PARENT);
      return is_child_nodes && (prop_name === 'length'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// childNodes - item
(function (exports) {
   var iflow_sig = {}; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_node, lev_prop, node, prop) {
   };
   
   iflow_sig.label = function (child, lev_node, lev_prop, node, prop) {
   	  var lev, parent; 
   	  
   	  parent = node[exports.consts.DOM_PARENT];
   	  
   	  
   	  lev = exports.lat.lub(lev_node, lev_prop);
   	  if (child) {
   	     lev = exports.lat.lub(lev, child[exports.consts.DOM_POS]);	
   	  }
      return lev; 
   }; 
   
   iflow_sig.domain = function (node, prop) {
   	  var is_child_nodes;   
   	  is_child_nodes = hasOwnProperty(node, exports.consts.DOM_LEV) 
   	     && hasOwnProperty(node, exports.consts.DOM_PARENT);
      return is_child_nodes && ((typeof prop) === 'number'); 
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// dom_upg_struct 
(function (exports) {
   var iflow_sig = {}; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_node, lev_prop, lev_level, node, prop, level) {
      var lev; 
      lev = exports.lat.lub(lev_node, lev_prop, lev_level);
      $check(exports.lat.leq(lev, node[exports.consts.DOM_STRUCT]));
   };
   
   iflow_sig.label = function (ret, lev_node, lev_prop, lev_level, node, prop, level) {
   	  var lev; 
   	  lev = exports.lat.lub(lev_node, lev_prop, lev_level, level);
   	  node[exports.consts.DOM_STRUCT] = lev;
      return lev; 
   }; 
   
   iflow_sig.domain = function (node, prop) {
   	  var is_dom;   
   	  is_dom = hasOwnProperty(node, exports.consts.DOM_STRUCT) 
   	     && hasOwnProperty(node, exports.consts.DOM_POS)
   	     && hasOwnProperty(node, exports.consts.DOM_VAL);
      return is_dom && (prop === 'dom_upg_struct'); 
   }; 
  
   //window[exports.consts.VAR_SHADOW_PREFIX + 'dom_upg_struct'] = exports.lat.bot; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// dom_upg_pos 
(function (exports) {
   var iflow_sig = {}; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_node, lev_prop, lev_level, node, prop, level) {
      var lev; 
      lev = exports.lat.lub(lev_node, lev_prop, lev_level);
      $check(exports.lat.leq(lev, node[exports.consts.DOM_POS]));
   };
   
   iflow_sig.label = function (ret, lev_node, lev_prop, lev_level, node, prop, level) {
   	  var lev; 
   	  lev = exports.lat.lub(lev_node, lev_prop, lev_level, level);
   	  node[exports.consts.DOM_POS] = lev;
      return lev; 
   }; 
   
   iflow_sig.domain = function (node, prop) {
   	  var is_dom;   
   	  is_dom = hasOwnProperty(node, exports.consts.DOM_STRUCT) 
   	     && hasOwnProperty(node, exports.consts.DOM_POS)
   	     && hasOwnProperty(node, exports.consts.DOM_VAL);
      return is_dom && (prop === 'dom_upg_pos'); 
   }; 
   
   //window.dom_upg_pos = function () {};
   //window[exports.consts.VAR_SHADOW_PREFIX + 'dom_upg_pos'] = exports.lat.bot;
   
   $addIFlowSig(iflow_sig);
})($runtime);



// getElementsByTagName
(function (exports) {
   var iflow_sig = {}; 
   var original_document = document; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_node, lev_meth_name, lev_tag, node, meth_name, tag) {
   };
   
   iflow_sig.label = function (live_col, lev_node, lev_meth_name, lev_tag, node, meth_name, tag) {
   	  var lev; 
   	  
   	  lev = exports.lat.lub(lev_node, lev_meth_name, lev_tag);
      live_col[exports.consts.LIVE_LEV] = lev; 
      live_col[exports.consts.LIVE_ROOT] = node; 
      live_col[exports.consts.LIVE_TAG] = tag;
      
      return lev;  
   }; 
   
   iflow_sig.domain = function (node, meth_name) {
   	  var is_dom;   
   	  is_dom = hasOwnProperty(node, exports.consts.DOM_STRUCT) 
   	     && hasOwnProperty(node, exports.consts.DOM_POS)
   	     && hasOwnProperty(node, exports.consts.DOM_VAL);
      
      return is_dom && (meth_name === 'getElementsByTagName');  
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// length 
(function (exports) {
   var iflow_sig = {}; 
   var original_document = document; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_live, lev_prop, live_col, prop) {
      var live_root; 
      
      live_root = live_col[exports.consts.LIVE_ROOT];
      $runtime.predicateWLD(live_root, {});
   };
   
   iflow_sig.label = function (len, lev_live, lev_prop, live_col, prop) {
   	  var lev, live_root, live_tag; 
   	  
   	  live_tag = live_col[exports.consts.LIVE_TAG]; 
   	  live_root = live_col[exports.consts.LIVE_ROOT];
   	  lev = exports.lat.lub(lev_live, lev_prop, live_root[exports.consts.LIVE_LEV], exports.getTagLevel(live_tag));
   	  
      return lev;  
   }; 
   
   iflow_sig.domain = function (node, prop) {
   	  var is_live;   
   	  is_live = hasOwnProperty(node, exports.consts.LIVE_LEV) 
   	     && hasOwnProperty(node, exports.consts.LIVE_ROOT)
   	     && hasOwnProperty(node, exports.consts.LIVE_TAG);
      return is_live && (prop === 'length');  
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// live item  
(function (exports) {
   var iflow_sig = {}; 
   var original_document = document; 
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_live, lev_prop, live_col, prop) {
      var live_root; 
      
      live_root = live_col[exports.consts.LIVE_ROOT];
      $runtime.predicateWLD(live_root, {});
   };
   
   iflow_sig.label = function (live_item, lev_live, lev_prop, live_col, prop) {
   	  var lev, live_root, live_tag; 
   	  
   	  live_root = live_col[exports.consts.LIVE_ROOT];
   	  live_tag = live_col[exports.consts.LIVE_TAG]; 
   	  
   	  lev = exports.lat.lub(lev_live, lev_prop, live_root[exports.consts.LIVE_LEV]);
   	  if (live_item) {
   	     lev = exports.lat.lub(lev, live_item[exports.consts.DOM_POS]);	
   	  } else {
   	  	 lev = exports.lat.lub(lev, exports.getTagLevel(live_tag));
   	  }
   	  
      return lev;  
   }; 
   
   iflow_sig.domain = function (node, prop) {
   	  var is_live;   
   	  is_live = hasOwnProperty(node, exports.consts.LIVE_LEV) 
   	     && hasOwnProperty(node, exports.consts.LIVE_ROOT)
   	     && hasOwnProperty(node, exports.consts.LIVE_TAG);
      return is_live && ((typeof prop) === 'number');   
   }; 
   
   $addIFlowSig(iflow_sig);
})($runtime);



// dom_upg_tag 
(function (exports) {
   var iflow_sig = {}; 
   var internal_document = document;
   
   var o = {}; 
   var hasOwnPropertyOriginal = o.hasOwnProperty;
   var hasOwnProperty = function (obj, prop) {
      return hasOwnPropertyOriginal.apply(obj, [ prop ]);    
   };
   
   iflow_sig.check = function (lev_doc, lev_meth_name, lev_tag, lev_level, doc, meth_name, tag, level) {
      var lev;
       
      lev = exports.lat.lub(lev_doc, lev_meth_name, lev_tag, lev_level);
      
      $check(exports.lat.leq(lev, exports.getTagLevel(tag)));
   };
   
   iflow_sig.label = function (ret, lev_doc, lev_meth_name, lev_tag, lev_level, doc, meth_name, tag, level) {
   	  var lev; 
   	  
   	  lev = exports.lat.lub(lev_doc, lev_meth_name, lev_tag, lev_level);
      exports.setTagLevel(tag, exports.lat.lub(lev, level));
      
      return lev; 
   }; 
   
   iflow_sig.domain = function (node, prop) {
      return (node === internal_document) && (prop === 'dom_upg_tag');  
   }; 
   
   internal_document.dom_upg_tag = function () {};
   //window[exports.consts.VAR_SHADOW_PREFIX + 'dom_upg_struct'] = exports.lat.bot; 
   
   $addIFlowSig(iflow_sig);
})($runtime);







