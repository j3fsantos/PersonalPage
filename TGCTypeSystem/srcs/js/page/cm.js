/*
CM = {};
CM.proto_contact = {};
CM.contact_list = {};

CM.proto_contact.printContact = function() { 
   return this.lst + "," + this.fst;
};

CM.proto_contact.makeFavorite = function() { 
   this.favorite = null;
};                             

CM.proto_contact.unFavorite = function() { 
   delete this.favorite; 
   return true; 
};

CM.proto_contact.isFavorite = function() { 
   return "favorite" in this; 
};

CM.createContact = function(fst_name, lst_name, email) { 
   var contact; 
   contact = {}; 
   contact.__proto__ = CM.proto_contact;
   contact.fst = fst_name;
   contact.lst = lst_name;  
   contact.email = email; 
   return contact; 
};

CM.storeContact = function(contact, i) {
   var list, key; 
   list = this.contact_list;
   key = contact.lst+i;
   if (key in list) {
      CM.storeContact(contact, i+1);
   } else {
   	  list[key] = contact;
   }
};
            
CM.getContact = function(lst_name, i) { 
	return this.contact_list[lst_name+i];
};
*/

var CM; 

function displayContacts () {
	var contact, contact_table, str, str_buttons; 
	
	contact_table = $('#tableContacts');
	contact_table.empty(); 
	
	str = '<thead><th> First Name </th><th> Last Name </th><th> Email </th></thead>';
	$('#tableContacts').append(str);
	
	str_buttons = '<td><button class=\'fav\'>Make Favorite</button></td> <td><button class=\'unfav\'>UnFavorite</button></td> <td><button class=\'del\'>Delete</button></td>';
	
	for (var contact_id in CM.contact_list) {
	   contact = CM.contact_list[contact_id];
	   if ('favorite' in contact) {
	      str = '<tr class=\'favorite\' id=\'' + contact_id + '\'><td>' + contact.fst + '</td><td>' + contact.lst + '</td><td>' + contact.email + '</td>' + str_buttons + '</tr>'; 
	   } else {
	   	  str = '<tr id=\'' + contact_id + '\'><td>' + contact.fst + '</td><td>' + contact.lst + '</td><td>' + contact.email + '</td>' + str_buttons + '</tr>'; 
	   }
	   $('#tableContacts').append(str);
	}
	
	$('#tableContacts tr').each(function(){
	   var id = this.id;
	   $('button.fav', this).click(function(){
	       CM.contact_list[id].makeFavorite();
	       displayContacts();
	   });
	   
	   $('button.unfav', this).click(function(){
	       CM.contact_list[id].unFavorite();
	       displayContacts();
	   });	
	   
	   $('button.del', this).click(function(){
	       delete CM.contact_list[id];
	       displayContacts();
	   });		
	});
}

$(function(){
   $('#addContactBtn').click(function(){
      var first_name = prompt("Type the first name"); 
	  var last_name = prompt("Type the last name"); 
	  var email = prompt("Type the email"); 
		
	  CM.storeContact(CM.createContact(first_name, last_name, email), 0);  
	  displayContacts(); 
   });
});

var messageHandler = function(message) {  	
   try { 
      eval(message.data);
      alert('CM code loaded with success');
   } catch(e) {
   	  alert('Error loading contact manager code');
   }
};

window.addEventListener("message", messageHandler, true); 


var $fun_type_1, $env_1, $pc_1;
$pc_1 = lat.bot;
$env_1 = {'CM': {
		'type_name': 'OBJ',
		'type_var': '__k',
		'row_type': {
			'proto_contact': {
				'level': 0,
				'type': {
					'type_name': 'OBJ',
					'type_var': '__k',
					'row_type': {
						'fst': {
							'level': 0,
							'type': {
								'type_name': 'PRIM',
								'level': 0
							}
						},
						'lst': {
							'level': 0,
							'type': {
								'type_name': 'PRIM',
								'level': 0
							}
						},
						'email': {
							'level': 0,
							'type': {
								'type_name': 'PRIM',
								'level': 5
							}
						},
						'id': {
							'level': 0,
							'type': {
								'type_name': 'PRIM',
								'level': 5
							}
						},
						'favorite': {
							'level': 5,
							'type': {
								'type_name': 'PRIM',
								'level': 5
							}
						},
						'printContact': {
							'level': 0,
							'type': {
								'type_name': 'FUN',
								'this_type': {
									'type_name': 'VAR',
									'var_name': '__k'
								},
								'parameter_types': [],
								'context_level': 0,
								'ret_type': {
									'type_name': 'PRIM',
									'level': 0
								},
								'level': 0
							}
						},
						'makeFavorite': {
							'level': 0,
							'type': {
								'type_name': 'FUN',
								'this_type': {
									'type_name': 'VAR',
									'var_name': '__k'
								},
								'parameter_types': [],
								'context_level': 5,
								'ret_type': {
									'type_name': 'PRIM',
									'level': 5
								},
								'level': 0
							}
						},
						'isFavorite': {
							'level': 0,
							'type': {
								'type_name': 'FUN',
								'this_type': {
									'type_name': 'VAR',
									'var_name': '__k'
								},
								'parameter_types': [],
								'context_level': 5,
								'ret_type': {
									'type_name': 'PRIM',
									'level': 5
								},
								'level': 0
							}
						},
						'unFavorite': {
							'level': 0,
							'type': {
								'type_name': 'FUN',
								'this_type': {
									'type_name': 'VAR',
									'var_name': '__k'
								},
								'parameter_types': [],
								'context_level': 5,
								'ret_type': {
									'type_name': 'PRIM',
									'level': 5
								},
								'level': 0
							}
						}
					},
					'star_level': null,
					'star_type': null,
					'level': 0,
					'my_type_name': '**contact_prototype_type'
				}
			},
			'contact_list': {
				'level': 0,
				'type': {
					'type_name': 'OBJ',
					'type_var': '__k',
					'row_type': {},
					'star_level': 0,
					'star_type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'my_proto': {
								'level': 0,
								'type': {
									'type_name': 'OBJ',
									'type_var': '__k',
									'row_type': {
										'fst': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 0
											}
										},
										'lst': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 0
											}
										},
										'email': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'id': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'favorite': {
											'level': 5,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'printContact': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 0,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 0
												},
												'level': 0
											}
										},
										'makeFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										},
										'isFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										},
										'unFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										}
									},
									'star_level': null,
									'star_type': null,
									'level': 0,
									'my_type_name': '**contact_prototype_type'
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_type'
					},
					'level': 0
				}
			},
			'createContact': {
				'level': 0,
				'type': {
					'type_name': 'FUN',
					'this_type': {
						'type_name': 'VAR',
						'var_name': '__k'
					},
					'parameter_types': [
						{
							'type_name': 'PRIM',
							'level': 0
						},
						{
							'type_name': 'PRIM',
							'level': 0
						},
						{
							'type_name': 'PRIM',
							'level': 5
						}
					],
					'context_level': 0,
					'ret_type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'my_proto': {
								'level': 0,
								'type': {
									'type_name': 'OBJ',
									'type_var': '__k',
									'row_type': {
										'fst': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 0
											}
										},
										'lst': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 0
											}
										},
										'email': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'id': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'favorite': {
											'level': 5,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'printContact': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 0,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 0
												},
												'level': 0
											}
										},
										'makeFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										},
										'isFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										},
										'unFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										}
									},
									'star_level': null,
									'star_type': null,
									'level': 0,
									'my_type_name': '**contact_prototype_type'
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_type'
					},
					'level': 0,
					'var_types': {'contact': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						}}
				}
			},
			'storeContact': {
				'level': 0,
				'type': {
					'type_name': 'FUN',
					'this_type': {
						'type_name': 'VAR',
						'var_name': '__k'
					},
					'parameter_types': [
						{
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						{
							'type_name': 'PRIM',
							'level': 0
						}
					],
					'context_level': 0,
					'ret_type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'my_proto': {
								'level': 0,
								'type': {
									'type_name': 'OBJ',
									'type_var': '__k',
									'row_type': {
										'fst': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 0
											}
										},
										'lst': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 0
											}
										},
										'email': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'id': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'favorite': {
											'level': 5,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'printContact': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 0,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 0
												},
												'level': 0
											}
										},
										'makeFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										},
										'isFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										},
										'unFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										}
									},
									'star_level': null,
									'star_type': null,
									'level': 0,
									'my_type_name': '**contact_prototype_type'
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_type'
					},
					'level': 0
				}
			},
			'getContact': {
				'level': 0,
				'type': {
					'type_name': 'FUN',
					'this_type': {
						'type_name': 'VAR',
						'var_name': '__k'
					},
					'parameter_types': [
						{
							'type_name': 'PRIM',
							'level': 0
						},
						{
							'type_name': 'PRIM',
							'level': 0
						}
					],
					'context_level': 0,
					'ret_type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'my_proto': {
								'level': 0,
								'type': {
									'type_name': 'OBJ',
									'type_var': '__k',
									'row_type': {
										'fst': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 0
											}
										},
										'lst': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 0
											}
										},
										'email': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'id': {
											'level': 0,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'favorite': {
											'level': 5,
											'type': {
												'type_name': 'PRIM',
												'level': 5
											}
										},
										'printContact': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 0,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 0
												},
												'level': 0
											}
										},
										'makeFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										},
										'isFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										},
										'unFavorite': {
											'level': 0,
											'type': {
												'type_name': 'FUN',
												'this_type': {
													'type_name': 'VAR',
													'var_name': '__k'
												},
												'parameter_types': [],
												'context_level': 5,
												'ret_type': {
													'type_name': 'PRIM',
													'level': 5
												},
												'level': 0
											}
										}
									},
									'star_level': null,
									'star_type': null,
									'level': 0,
									'my_type_name': '**contact_prototype_type'
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_type'
					},
					'level': 0
				}
			}
		},
		'star_level': null,
		'star_type': null,
		'level': 0
	}};
$fun_type_1 = undefined;
CM = {};
CM.proto_contact = {};
CM.contact_list = {};
CM.proto_contact.printContact = function () {
	var $fun_type_2, $env_2, $pc_2;
	$pc_2 = 0;
	$env_2 = {
		'CM': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'this_prop': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'printContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 0,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 0
						},
						'level': 0
					}
				},
				'makeFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'isFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'unFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_prototype_type'
		},
		'ret_prop': {
			'type_name': 'PRIM',
			'level': 0
		},
		'original_pc_level': 0
	};
	$fun_type_2 = {
		'type_name': 'FUN',
		'this_type': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'printContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 0,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 0
						},
						'level': 0
					}
				},
				'makeFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'isFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'unFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_prototype_type'
		},
		'parameter_types': [],
		'context_level': 0,
		'ret_type': {
			'type_name': 'PRIM',
			'level': 0
		},
		'level': 0
	};
	return this.lst + (',' + this.fst);
};
CM.proto_contact.makeFavorite = function () {
	var $fun_type_3, $env_3, $pc_3;
	$pc_3 = 5;
	$env_3 = {
		'CM': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'this_prop': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'printContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 0,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 0
						},
						'level': 0
					}
				},
				'makeFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'isFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'unFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_prototype_type'
		},
		'ret_prop': {
			'type_name': 'PRIM',
			'level': 5
		},
		'original_pc_level': 5
	};
	$fun_type_3 = {
		'type_name': 'FUN',
		'this_type': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'printContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 0,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 0
						},
						'level': 0
					}
				},
				'makeFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'isFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'unFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_prototype_type'
		},
		'parameter_types': [],
		'context_level': 5,
		'ret_type': {
			'type_name': 'PRIM',
			'level': 5
		},
		'level': 0
	};
	this.favorite = null;
};
CM.proto_contact.unFavorite = function () {
	var $fun_type_4, $env_4, $pc_4;
	$pc_4 = 5;
	$env_4 = {
		'CM': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'this_prop': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'printContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 0,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 0
						},
						'level': 0
					}
				},
				'makeFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'isFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'unFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_prototype_type'
		},
		'ret_prop': {
			'type_name': 'PRIM',
			'level': 5
		},
		'original_pc_level': 5
	};
	$fun_type_4 = {
		'type_name': 'FUN',
		'this_type': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'printContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 0,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 0
						},
						'level': 0
					}
				},
				'makeFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'isFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'unFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_prototype_type'
		},
		'parameter_types': [],
		'context_level': 5,
		'ret_type': {
			'type_name': 'PRIM',
			'level': 5
		},
		'level': 0
	};
	delete this.favorite;
	return true;
};
CM.proto_contact.isFavorite = function () {
	var $fun_type_5, $env_5, $pc_5;
	$pc_5 = 5;
	$env_5 = {
		'CM': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'this_prop': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'printContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 0,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 0
						},
						'level': 0
					}
				},
				'makeFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'isFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'unFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_prototype_type'
		},
		'ret_prop': {
			'type_name': 'PRIM',
			'level': 5
		},
		'original_pc_level': 5
	};
	$fun_type_5 = {
		'type_name': 'FUN',
		'this_type': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'printContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 0,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 0
						},
						'level': 0
					}
				},
				'makeFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'isFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				},
				'unFavorite': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [],
						'context_level': 5,
						'ret_type': {
							'type_name': 'PRIM',
							'level': 5
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_prototype_type'
		},
		'parameter_types': [],
		'context_level': 5,
		'ret_type': {
			'type_name': 'PRIM',
			'level': 5
		},
		'level': 0
	};
	return 'favorite' in this;
};
CM.createContact = function (fst_name, lst_name, email) {
	var $fun_type_6, $env_6, $pc_6;
	$pc_6 = 0;
	$env_6 = {
		'CM': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'fst_name': {
			'type_name': 'PRIM',
			'level': 0
		},
		'lst_name': {
			'type_name': 'PRIM',
			'level': 0
		},
		'email': {
			'type_name': 'PRIM',
			'level': 5
		},
		'contact': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'my_proto': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_type'
		},
		'this_prop': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'ret_prop': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'my_proto': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_type'
		},
		'original_pc_level': 0
	};
	$fun_type_6 = {
		'type_name': 'FUN',
		'this_type': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'parameter_types': [
			{
				'type_name': 'PRIM',
				'level': 0
			},
			{
				'type_name': 'PRIM',
				'level': 0
			},
			{
				'type_name': 'PRIM',
				'level': 5
			}
		],
		'context_level': 0,
		'ret_type': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'my_proto': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_type'
		},
		'level': 0,
		'var_types': {'contact': {
				'type_name': 'OBJ',
				'type_var': '__k',
				'row_type': {
					'fst': {
						'level': 0,
						'type': {
							'type_name': 'PRIM',
							'level': 0
						}
					},
					'lst': {
						'level': 0,
						'type': {
							'type_name': 'PRIM',
							'level': 0
						}
					},
					'email': {
						'level': 0,
						'type': {
							'type_name': 'PRIM',
							'level': 5
						}
					},
					'id': {
						'level': 0,
						'type': {
							'type_name': 'PRIM',
							'level': 5
						}
					},
					'favorite': {
						'level': 5,
						'type': {
							'type_name': 'PRIM',
							'level': 5
						}
					},
					'my_proto': {
						'level': 0,
						'type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'printContact': {
									'level': 0,
									'type': {
										'type_name': 'FUN',
										'this_type': {
											'type_name': 'VAR',
											'var_name': '__k'
										},
										'parameter_types': [],
										'context_level': 0,
										'ret_type': {
											'type_name': 'PRIM',
											'level': 0
										},
										'level': 0
									}
								},
								'makeFavorite': {
									'level': 0,
									'type': {
										'type_name': 'FUN',
										'this_type': {
											'type_name': 'VAR',
											'var_name': '__k'
										},
										'parameter_types': [],
										'context_level': 5,
										'ret_type': {
											'type_name': 'PRIM',
											'level': 5
										},
										'level': 0
									}
								},
								'isFavorite': {
									'level': 0,
									'type': {
										'type_name': 'FUN',
										'this_type': {
											'type_name': 'VAR',
											'var_name': '__k'
										},
										'parameter_types': [],
										'context_level': 5,
										'ret_type': {
											'type_name': 'PRIM',
											'level': 5
										},
										'level': 0
									}
								},
								'unFavorite': {
									'level': 0,
									'type': {
										'type_name': 'FUN',
										'this_type': {
											'type_name': 'VAR',
											'var_name': '__k'
										},
										'parameter_types': [],
										'context_level': 5,
										'ret_type': {
											'type_name': 'PRIM',
											'level': 5
										},
										'level': 0
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_prototype_type'
						}
					}
				},
				'star_level': null,
				'star_type': null,
				'level': 0,
				'my_type_name': '**contact_type'
			}}
	};
	var contact;
	contact = {};
	contact.__proto__ = CM.proto_contact;
	contact.fst = fst_name;
	contact.lst = lst_name;
	contact.email = email;
	return contact;
};
CM.storeContact = function (contact, i) {
	var $fun_type_7, $env_7, $pc_7, $type_2, $x_2, $pc_8, $type_1, $x_1;
	$pc_7 = 0;
	$env_7 = {
		'CM': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'contact': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'my_proto': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_type'
		},
		'i': {
			'type_name': 'PRIM',
			'level': 0
		},
		'this_prop': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'ret_prop': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'my_proto': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_type'
		},
		'original_pc_level': 0
	};
	$fun_type_7 = {
		'type_name': 'FUN',
		'this_type': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'parameter_types': [
			{
				'type_name': 'OBJ',
				'type_var': '__k',
				'row_type': {
					'fst': {
						'level': 0,
						'type': {
							'type_name': 'PRIM',
							'level': 0
						}
					},
					'lst': {
						'level': 0,
						'type': {
							'type_name': 'PRIM',
							'level': 0
						}
					},
					'email': {
						'level': 0,
						'type': {
							'type_name': 'PRIM',
							'level': 5
						}
					},
					'id': {
						'level': 0,
						'type': {
							'type_name': 'PRIM',
							'level': 5
						}
					},
					'favorite': {
						'level': 5,
						'type': {
							'type_name': 'PRIM',
							'level': 5
						}
					},
					'my_proto': {
						'level': 0,
						'type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'printContact': {
									'level': 0,
									'type': {
										'type_name': 'FUN',
										'this_type': {
											'type_name': 'VAR',
											'var_name': '__k'
										},
										'parameter_types': [],
										'context_level': 0,
										'ret_type': {
											'type_name': 'PRIM',
											'level': 0
										},
										'level': 0
									}
								},
								'makeFavorite': {
									'level': 0,
									'type': {
										'type_name': 'FUN',
										'this_type': {
											'type_name': 'VAR',
											'var_name': '__k'
										},
										'parameter_types': [],
										'context_level': 5,
										'ret_type': {
											'type_name': 'PRIM',
											'level': 5
										},
										'level': 0
									}
								},
								'isFavorite': {
									'level': 0,
									'type': {
										'type_name': 'FUN',
										'this_type': {
											'type_name': 'VAR',
											'var_name': '__k'
										},
										'parameter_types': [],
										'context_level': 5,
										'ret_type': {
											'type_name': 'PRIM',
											'level': 5
										},
										'level': 0
									}
								},
								'unFavorite': {
									'level': 0,
									'type': {
										'type_name': 'FUN',
										'this_type': {
											'type_name': 'VAR',
											'var_name': '__k'
										},
										'parameter_types': [],
										'context_level': 5,
										'ret_type': {
											'type_name': 'PRIM',
											'level': 5
										},
										'level': 0
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_prototype_type'
						}
					}
				},
				'star_level': null,
				'star_type': null,
				'level': 0,
				'my_type_name': '**contact_type'
			},
			{
				'type_name': 'PRIM',
				'level': 0
			}
		],
		'context_level': 0,
		'ret_type': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'my_proto': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_type'
		},
		'level': 0
	};
	var list, key;
	list = this.contact_list;
	key = contact.lst + i;
	$x_1 = key in list;
	$type_1 = sec_types.buildPrimType(lat.lub($pc_7, $env_7.list.level, $env_7.key.level, sec_types.getLevelProtoChainProp($env_7.list, key)));
	$pc_8 = lat.lub($type_1.level, $pc_7);
	if ($x_1) {
		$x_3 = i + 1;
		$type_4 = sec_types.lubType($env_7.i, sec_types.buildPrimType(lat.bot));
		$type_3 = sec_types.getTypeProtoChainProp($env_7.CM, 'storeContact');
		$level_1 = lat.lub($pc_8, $env_7.CM.level, sec_types.buildPrimType(lat.bot).level, $type_3.level);
		if ($type_3.parameter_types.length === 2 && sec_types.isSubType($env_7.CM, $type_3.this_type) && lat.leq($level_1, $type_3.context_level) && (sec_types.isSubType($env_7.contact, $type_3.parameter_types[0]) && sec_types.isSubType($type_4, $type_3.parameter_types[1]))) {
			$x_2 = CM['storeContact'](contact, $x_3);
			$type_2 = $type_3.ret_type;
			$type_2.level = lat.lub($type_2.level, $level_1);
		} else {
			throw new Error('Illegal Runtime Operation');
		}
	} else {
		if (sec_types.isSubType($env_7.contact, sec_types.getTypeObjProp($env_7.list, key)) && lat.leq(lat.lub($pc_8, $env_7.list.level, $env_7.key.level), sec_types.getLevelObjProp($env_7.list, key))) {
			list[key] = contact;
		} else {
			throw new Error('Illegal Runtime Operation');
		}
	}
};
CM.getContact = function (lst_name, i) {
	var $fun_type_8, $env_8, $pc_9, $type_8, $x_7, $type_7, $x_6, $type_6, $x_5;
	$pc_9 = 0;
	$env_8 = {
		'CM': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'lst_name': {
			'type_name': 'PRIM',
			'level': 0
		},
		'i': {
			'type_name': 'PRIM',
			'level': 0
		},
		'this_prop': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'ret_prop': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'my_proto': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_type'
		},
		'original_pc_level': 0
	};
	$fun_type_8 = {
		'type_name': 'FUN',
		'this_type': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'proto_contact': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				},
				'contact_list': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {},
						'star_level': 0,
						'star_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'createContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 5
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0,
						'var_types': {'contact': {
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							}}
					}
				},
				'storeContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'OBJ',
								'type_var': '__k',
								'row_type': {
									'fst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'lst': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 0
										}
									},
									'email': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'id': {
										'level': 0,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'favorite': {
										'level': 5,
										'type': {
											'type_name': 'PRIM',
											'level': 5
										}
									},
									'my_proto': {
										'level': 0,
										'type': {
											'type_name': 'OBJ',
											'type_var': '__k',
											'row_type': {
												'fst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'lst': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 0
													}
												},
												'email': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'id': {
													'level': 0,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'favorite': {
													'level': 5,
													'type': {
														'type_name': 'PRIM',
														'level': 5
													}
												},
												'printContact': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 0,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 0
														},
														'level': 0
													}
												},
												'makeFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'isFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												},
												'unFavorite': {
													'level': 0,
													'type': {
														'type_name': 'FUN',
														'this_type': {
															'type_name': 'VAR',
															'var_name': '__k'
														},
														'parameter_types': [],
														'context_level': 5,
														'ret_type': {
															'type_name': 'PRIM',
															'level': 5
														},
														'level': 0
													}
												}
											},
											'star_level': null,
											'star_type': null,
											'level': 0,
											'my_type_name': '**contact_prototype_type'
										}
									}
								},
								'star_level': null,
								'star_type': null,
								'level': 0,
								'my_type_name': '**contact_type'
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				},
				'getContact': {
					'level': 0,
					'type': {
						'type_name': 'FUN',
						'this_type': {
							'type_name': 'VAR',
							'var_name': '__k'
						},
						'parameter_types': [
							{
								'type_name': 'PRIM',
								'level': 0
							},
							{
								'type_name': 'PRIM',
								'level': 0
							}
						],
						'context_level': 0,
						'ret_type': {
							'type_name': 'OBJ',
							'type_var': '__k',
							'row_type': {
								'fst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'lst': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 0
									}
								},
								'email': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'id': {
									'level': 0,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'favorite': {
									'level': 5,
									'type': {
										'type_name': 'PRIM',
										'level': 5
									}
								},
								'my_proto': {
									'level': 0,
									'type': {
										'type_name': 'OBJ',
										'type_var': '__k',
										'row_type': {
											'fst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'lst': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 0
												}
											},
											'email': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'id': {
												'level': 0,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'favorite': {
												'level': 5,
												'type': {
													'type_name': 'PRIM',
													'level': 5
												}
											},
											'printContact': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 0,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 0
													},
													'level': 0
												}
											},
											'makeFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'isFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											},
											'unFavorite': {
												'level': 0,
												'type': {
													'type_name': 'FUN',
													'this_type': {
														'type_name': 'VAR',
														'var_name': '__k'
													},
													'parameter_types': [],
													'context_level': 5,
													'ret_type': {
														'type_name': 'PRIM',
														'level': 5
													},
													'level': 0
												}
											}
										},
										'star_level': null,
										'star_type': null,
										'level': 0,
										'my_type_name': '**contact_prototype_type'
									}
								}
							},
							'star_level': null,
							'star_type': null,
							'level': 0,
							'my_type_name': '**contact_type'
						},
						'level': 0
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0
		},
		'parameter_types': [
			{
				'type_name': 'PRIM',
				'level': 0
			},
			{
				'type_name': 'PRIM',
				'level': 0
			}
		],
		'context_level': 0,
		'ret_type': {
			'type_name': 'OBJ',
			'type_var': '__k',
			'row_type': {
				'fst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'lst': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 0
					}
				},
				'email': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'id': {
					'level': 0,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'favorite': {
					'level': 5,
					'type': {
						'type_name': 'PRIM',
						'level': 5
					}
				},
				'my_proto': {
					'level': 0,
					'type': {
						'type_name': 'OBJ',
						'type_var': '__k',
						'row_type': {
							'fst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'lst': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 0
								}
							},
							'email': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'id': {
								'level': 0,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'favorite': {
								'level': 5,
								'type': {
									'type_name': 'PRIM',
									'level': 5
								}
							},
							'printContact': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 0,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 0
									},
									'level': 0
								}
							},
							'makeFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'isFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							},
							'unFavorite': {
								'level': 0,
								'type': {
									'type_name': 'FUN',
									'this_type': {
										'type_name': 'VAR',
										'var_name': '__k'
									},
									'parameter_types': [],
									'context_level': 5,
									'ret_type': {
										'type_name': 'PRIM',
										'level': 5
									},
									'level': 0
								}
							}
						},
						'star_level': null,
						'star_type': null,
						'level': 0,
						'my_type_name': '**contact_prototype_type'
					}
				}
			},
			'star_level': null,
			'star_type': null,
			'level': 0,
			'my_type_name': '**contact_type'
		},
		'level': 0
	};
	$x_5 = this['contact_list'];
	$type_6 = sec_types.getTypeProtoChainProp($env_8.this_prop, 'contact_list');
	$type_6.level = lat.lub($type_6.level, $env_8.this_prop.level, sec_types.buildPrimType(lat.bot).level);
	$x_6 = lst_name + i;
	$type_7 = sec_types.lubType($env_8.lst_name, $env_8.i);
	$x_7 = $x_5[$x_6];
	$type_8 = sec_types.getTypeProtoChainProp($type_6, $x_6);
	$type_8.level = lat.lub($type_8.level, $type_6.level, $type_7.level);
	if ($fun_type_8 && (sec_types.isSubType($type_8, $fun_type_8.ret_type) && (lat.leq($pc_9, $fun_type_8.ret_type.level) && lat.leq($pc_9, $fun_type_8.context_level)))) {
		return $x_7;
	} else {
		throw new Error('Illegal Runtime Operation');
	}
};

