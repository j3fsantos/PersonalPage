/**
**contact_prototype_type: OBJ<__k><
   fst^{0}: PRIM^{0},
   lst^{0}: PRIM^{0},
   email^{0}: PRIM^{5},  
   id^{0}: PRIM^{5},
   favorite^{5}: PRIM^{5}, 
   printContact^{0}: FUN<__k.() ->^{0} PRIM^{0}>^{0},
   makeFavorite^{0}: FUN<__k.() ->^{5} PRIM^{5}>^{0}, 
   isFavorite^{0}: FUN<__k.() ->^{0} PRIM^{5}>^{0}, 
   unFavorite^{0}: FUN<__k.() ->^{5} PRIM^{5}>^{0} 
>^{0}

**contact_type: OBJ<__k><
   fst^{0}: PRIM^{0},
   lst^{0}: PRIM^{0},
   email^{0}: PRIM^{5}, 
   id^{0}: PRIM^{5},
   favorite^{5}: PRIM^{5}, 
   printContact^{0}: FUN<__k.() ->^{0} PRIM^{0}>^{0},
   makeFavorite^{0}: FUN<__k.() ->^{5} PRIM^{5}>^{0}, 
   isFavorite^{0}: FUN<__k.() ->^{0} PRIM^{5}>^{0}, 
   unFavorite^{0}: FUN<__k.() ->^{5} PRIM^{5}>^{0},
   __proto__^{0}: **contact_prototype_type
>^{0}       

**contact_manage = OBJ<__k><
     proto_contact^{0}: **contact_type, 
     contact_list^{0}: OBJ<__k>< *^{0}: **contact_type>^{0}, 
     createContact^{0}: FUN<__k.(PRIM^{0}, PRIM^{0}, PRIM^{5}) ->^{0} **contact_type >^{0}, 
     storeContact^{0}: FUN<__k.(**contact_type, PRIM^{0}) ->^{0} **contact_type>^{0}, 
     getContact^{0}: FUN<__k.(PRIM^{0}, PRIM^{0}) ->^{0} **contact_type>^{0}
>^{0}
**/
function contactManagerTypes() {
   var contact_prototype_type, contact_prototype_type_name, contact_manager_type_name, contact_manager_type, cm_types;  
   
   cm_types = [];
   
   contact_manager_type_name = "**contact_manager_type"; 
   contact_manager_type ="OBJ<__k>< \n\t proto_contact^{0}: **contact_prototype_type, \n\t contact_list^{0}: OBJ<__k>< *^{0}: **contact_type>^{0}, \n\t createContact^{0}: FUN<__k.(PRIM^{0}, PRIM^{0}, PRIM^{5})[contact: **contact_type] ->^{0} **contact_type >^{0}, \n\t storeContact^{0}: FUN<__k.(**contact_type, PRIM^{0})[key: PRIM^{0}, list: OBJ<__k>< *^{0}: **contact_type>^{0}] ->^{0} **contact_type>^{0}, \n\t getContact^{0}: FUN<__k.(PRIM^{0}, PRIM^{0}) ->^{0} **contact_type>^{0} \n>^{0}";
   cm_types.push({
      type: contact_manager_type, 
      type_name: contact_manager_type_name
   });
   
   contact_type_name = "**contact_type";
   contact_type = "OBJ<__k>< \n\t fst^{0}: PRIM^{0}, \n\t lst^{0}: PRIM^{0}, \n\t email^{0}: PRIM^{5}, \n\t id^{0}: PRIM^{5}, \n\t favorite^{5}: PRIM^{5}, \n\t __proto__^{0}: **contact_prototype_type \n >^{0}";
   cm_types.push({
      type: contact_type, 
      type_name: contact_type_name
   });
   
   contact_prototype_type_name = "**contact_prototype_type";
   contact_prototype_type = "OBJ<__k>< \n\t fst^{0}: PRIM^{0}, \n\t lst^{0}: PRIM^{0},  \n\t email^{0}: PRIM^{5}, \n\t id^{0}: PRIM^{5}, \n\t favorite^{5}: PRIM^{5}, \n\t printContact^{0}: FUN<__k.() ->^{0} PRIM^{0}>^{0}, \n\t makeFavorite^{0}: FUN<__k.() ->^{5} PRIM^{5}>^{0}, \n\t isFavorite^{0}: FUN<__k.() ->^{5} PRIM^{5}>^{0}, \n\t unFavorite^{0}: FUN<__k.() ->^{5} PRIM^{5}>^{0} \n >^{0}";
   cm_types.push({
      type: contact_prototype_type, 
      type_name: contact_prototype_type_name
   }); 
   
   return cm_types; 
} 
