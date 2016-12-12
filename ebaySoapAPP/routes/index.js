var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var ejs = require("ejs");
var check = require('./cc_check');
var uuid = require('node-uuid');
var crypto = require('crypto');


const winston = require('winston');

var logger = require('../logger/logger');

var soap = require('soap');
	var baseURL = "http://localhost:8080/ebaySoap/services";
	var option = {
				ignoredNamespaces : true	
	};

var url = baseURL+"/Services?wsdl";



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('signin');
	logger.log('info','inside / routing get method!');
});

router.get('/cart', function(req, res, next) {
	logger.log('info','inside cart page get method!');
	if(req.session.user){
		res.render('cart');
		}
		else{
			res.redirect('signin');
		}	
});

router.get('/profile', function(req, res, next) {
	res.render('profile');
	logger.log('info','inside /profile routing get method!');
});


router.post('/getbought', function(req, res, next) {
	logger.log('info','inside getbought page post method!');
	
	var query = "select * from ebay.order_details where user_id = '"+req.session.user.user_id+"'";
	
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
				logger.log('info','purchase history retrival is successful');
				
				console.log(results);				
				res.send({bought : results});							
			} else {
				logger.log('info','bought history query was failed');
			}
		}
	},query); 
	
	
});


router.post('/delet_cartitem', function(req, res, next) {
	logger.log('info','inside /delet_cartitem page post method!');
	
	var del_obj = req.body.obj;
	console.log(req.body.obj);
	var query = "delete from ebay.cart where user_id = '"+req.session.user.user_id+"' and item = '"+del_obj.item+"'";
	
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.affectedRows === 1) {
				logger.log('info','Item deletion was successful');
											
				res.send({success : 200});							
			} else {
				logger.log('info','Item deletion was failed');
				res.send({success : 401});	
			}
		}
	},query); 
	
	
});

router.post('/getuserinfo', function(req, res, next) {
	logger.log('info','inside getuserinfo page post method!');
	if(req.session.user){
	var query = "select * from ebay.users where user_id = '"+req.session.user.user_id+"'";
	
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
				logger.log('info','user information retrival is successful');
										
				res.send({info : results});							
			} else {
				logger.log('info','user information query was failed');
			}
		}
	},query); 
	}else{
		res.send({info : "redirect"});
	}
});


router.post('/getSold', function(req, res, next) {
	logger.log('info','inside getSold page post method!');
	
	var query = "select * from ebay.sell where seller_id= '"+req.session.user.user_id+"'";
	
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
				logger.log('info','selling history retrival is successful');
				
				console.log(results);				
				res.send({sold : results});							
			} else {
				logger.log('info','selling history query was failed');
			}
		}
	},query); 
	
});


router.post('/gotoCheckout', function(req, res, next) {
	logger.log('info','inside gotocheckout page post method!');
	res.send({success : 200});
	
});

router.get('/checkout', function(req, res, next) {
	logger.log('info','inside gotocheckout page post method!');
	if(req.session.user){
		res.render('checkout');
		}
		else{
			res.redirect('signin');
		}
});


router.post('/boughtPage', function(req, res, next) {
	logger.log('info','inside boughtPage page post method!');
	var cc = req.body.cc;
	var exp_month = req.body.exp_month;
	var exp_year = req.body.exp_year;
	var cvv = req.body.cvv;
	
	var checkout_cart = [];
	checkout_cart = req.body.cart;
	var cart_total = req.body.total;
	
	var size = 0,i=0,count=0,qty=0,cart_item= 0;
	var new_qty = 0;
	
	for (var x in checkout_cart){
		size++;
	}
	console.log(checkout_cart);
	
//	console.log(cc + " " + exp_month + " "+ exp_year + " "+ cvv);
	
	check.Tocheck(cc,exp_month, exp_year,cvv,function(answer,message){
		logger.log('info','credit card validation is successful!');
			
		if(answer){	
			var transection_id = uuid.v1();
			console.log("CC check is OK");
			
			//insert into transection databases		
			var query = "INSERT INTO transection SET ?";
			
			var JSON_query = {
					"total" : cart_total,
					"user_id" : req.session.user.user_id,	
					"id" : transection_id
			};
			
			mysql.fetchData(function(err, results) {
				if (err) {
					throw err;
				} else {
					if (results.affectedRows === 1) {
						logger.log('info','inserted details into transection databases');
					
					} 
				}
			}, query,JSON_query); 
			
			//insert detailed item lists into order_details table
			
			for (i=0;i<size;i++){
			
				var query = "INSERT INTO order_details SET ?";
				
				var JSON_query = {
						"seller_id" : checkout_cart[i].seller_id,
						"item" : checkout_cart[i].item,	
						"transection_id" : transection_id,
						"qty" : checkout_cart[i].qty,
						"item_id" : checkout_cart[i].item_id,
						"user_id" : req.session.user.user_id,
						"price" : checkout_cart[i].price
				};
				
				mysql.fetchData(function(err, results) {
					if (err) {
						throw err;
					} else {
						if (results.affectedRows === 1) {
							
							logger.log('info','inserted items into bought_detail database');
							console.log("i : "+i+" "+count);
							//update qty in sell table
							qty = checkout_cart[count].qty;
							cart_item = checkout_cart[count++].item_id;
							var query = "UPDATE sell SET ebay.sell.qty = ebay.sell.qty -"+qty +" where item_id = '"+cart_item+"'";
							
							mysql.fetchData(function(err, results) {
								if (err) {
									throw err;
								} else {
									if (results.affectedRows === 1) {							
										logger.log('info','deleted items from sell database');									
																				
									} else{
										logger.log('info','counld not delete records from sell table!');
									}
								}
							}, query); 
						} 
					}
				}, query,JSON_query); 				
							
			}	
				
		//delete the user cart!
			var query = "DELETE from cart where user_id = '"+req.session.user.user_id+"'";
			
			mysql.fetchData(function(err, results) {
				if (err) {
					throw err;
				} else {
					if (results.affectedRows === 1) {
						logger.log('info','deleted entries from cart database');					
					} 
				}
			}, query); 
			res.send({"message" : 200});
		}else{
			logger.log('error','credit card details were incorrect!');
			res.send({"message" : message});
		}
		});	
});


router.get('/home', function(req, res, next) {
	logger.log('info','inside home page get method!');
	if(req.session.user){
	res.render('home',{username : req.session.user.username});
	}
	else{
		res.render('home',{username : 'Guest'});
	}
});

router.post('/home', function(req, res, next) {
	logger.log('info','inside /home post method!');
	if(req.session.user){
		var JSON_obj = {
				"entry" : "signout",
				"name" : req.session.user.username
		}
	res.send(JSON_obj);
	}
	else{
		var JSON_obj = {
				"entry" : "signin",
				"name" : "Guest"
		};
		res.send(JSON_obj);
	}
});


router.post('/getCart', function(req, res, next) {
	logger.log('info','inside /getCart post method!');
	var query = "select ebay.sell.item,ebay.sell.item_id,ebay.cart.qty,ebay.sell.price,ebay.cart.seller_id from ebay.sell,ebay.users,ebay.cart where ebay.users.user_id=ebay.cart.user_id and ebay.sell.item_id = ebay.cart.id and ebay.cart.user_id ='"+req.session.user.user_id+"'";
	var total_price = 0;
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
				logger.log('info','getcart retrival is successful');
				
				for(var i=0;i<results.length;i++){
					total_price += (Number(results[i].price)*Number(results[i].qty));	
					
				}				
				
				JSON_obj = {
						"cart" : results,
						"price" : total_price
				}
				
				res.send(JSON_obj);							
			} else {
				logger.log('info','getcart query was failed');
			}
		}
	},query); 
	
});


router.post('/bid', function(req, res, next) {
	
	logger.log('info','inside /bid post');
		
		if(req.session.user){	
			
			var bid_item = req.body.obj;
			var bid = req.body.bid_price;
			var user = req.session.user.user_id;
			
			console.log("bid amount is : "+ bid);		
			var query = "INSERT INTO bids SET ?	";
			
			var JSON_query = {
					"user_id" : req.session.user.user_id,
					"user" : req.session.user.username,
					"item" : bid_item.item,
					"price" : bid,
					"item_id" : bid_item.item_id
				};
			
			mysql.fetchData(function(err, results) {
				if (err) {
					throw err;
				} else {
					if (results.affectedRows === 1) {
						logger.log('info', 'bid inserted into bid table');	
						res.send({success : 200});
					} 
				}
			}, query,JSON_query);		
								
		}else{		
			res.send({success : 401});
		}
	});






router.post('/cart', function(req, res, next) {
	
	logger.log('info','inside /cart post');
	
	if(req.session.user){	
		
		var cart_item = req.body.obj;
		var qty = req.body.qty;
		var user = req.session.user.user_id;
		console.log("username in cart is "+req.session.user.username);
		console.log("item in cart is "+cart_item.item_id);
		
		var query = "select * from cart where cart.id = '"+cart_item.item_id+"' and cart.user_id = '"+req.session.user.user_id+"'";
		
		mysql.fetchData(function(err, results) {
			if (err) {
				throw err;
			} else {
				
				if (results.length > 0) {

					logger.log('info','Selected Item exists in cart already!');
					var current_qty = results[0].qty;
					var new_qty = qty + current_qty;
					var query = "update cart SET cart.qty ='"+ new_qty+"' where cart.id = '"+cart_item.item_id+"'";
					
					mysql.fetchData(function(err, answer) {
						if (err) {
							throw err;
						} else {
							if (answer.length == null) {
								logger.log('info','selected quantity was updated into cart');
								res.send({success : 200});
							}else{
								console.log("no records!");
							} 
						}
					}, query); 			
			
				} else {
					console.log("no entries found in DB!");
					var query = "INSERT INTO cart SET ?	";
					
					var JSON_query = {
							"id" : cart_item.item_id,
							"item" : cart_item.item,
							"qty" : qty,
							"user_id" : user,
							"seller_name" : cart_item.seller,
							"seller_id" : cart_item.seller_id
						};
					
					mysql.fetchData(function(err, results) {
						if (err) {
							throw err;
						} else {
							if (results.affectedRows === 1) {
								logger.log('info','selected quantity was added into cart');	
								res.send({success : 200});
							} 
						}
					}, query,JSON_query); 
				}
			}
		}, query); 		
		
							
	}else{		
		res.send({success : 401});
	}
});


router.get('/item', function(req, res, next) {
	logger.log('info','inside /item get');
	res.render('item');		
});

router.post('/item', function(req, res, next) {
	logger.log('info','inside /item post');
	var id = req.body.id;
	var query = "select * from sell where item_id=?";
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
				
				if(results[0].price_option == "auction"){
					logger.log('info','item catogory is auction!');
					var sell_time = results[0].time;
					var sell_sec = sell_time.getMilliseconds();
					var today = new Date();
					today.setDate(today.getDate() + 4);
					
					console.log("bid expiry :"+today);
					console.log("bid date : "+sell_time);
					
					if (today > sell_time) {
						logger.log('info','Item listing is active');
						res.send({list : results});
					} else {
						logger.log('info','Item listing is expired');						
						res.send({list : "redirect"});
						
					}					
				}else{
					res.send({list : results});
				}
			} else {
				logger.log('info','no items found in items table!');
			}
		}
	}, query,id);
});



router.post('/cataLouge', function(req, res, next) {
	logger.log('info','inside /cataLouge post');
		
	// let's get sell items info from table sell into DB
	if(req.session.user){
	var query = "select * from sell where not seller_id ='"+ req.session.user.user_id+"'";
	}else{
		var query = "select * from sell";
	}
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
				logger.log('info','cataLouge retrival was successful'); 
				res.send({list : results});						
			} else {
				logger.log('info','cataLouge is empty');
			}
		}
	}, query);
	
});


router.get('/signup', function(req, res, next) {
	logger.log('info','inside /signup get');
	res.render('signup', {title : 'Signup'});
});

router.get('/signin', function(req, res, next) {
	logger.log('info','inside /signin get');
	if(req.session.user){
		res.render('home',{"username" : req.session.user.username});
	}
	else{	
		console.log("redirecting to signin..");
		res.render('signin');
		
	}
});

router.post('/logout', function(req, res, next) {
	logger.log('info','inside /logout post');
	req.session.destroy();	
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.send({"statusCode" : 200});
});


router.post('/afterSignIn', function(req, res, next) {
	logger.log('info','inside /afterSignIn post');
	var username = req.body.inputUsername;
	var password = req.body.inputPassword;

	var args = {

		"username" : username,
		"password" : password				
	};

	soap.createClient(url,option, function(err, client) {
		// console.log('err, client', err, client);
		client.authenticate(args, function(err, result) {
			result = JSON.parse(result.authenticateReturn);
			// console.log('result', result);
			    	  if(result.statusCode == 200){

			    	  	req.session.user = {
							"user_id" : result.user_id,
							"username" : result.username
						};


			    		 res.send({"statusCode" : 200});
			    	  }
			    	  else{
			    		  res.send({"statusCode" : 401});
			    	  }
	     		 });
	});	
			
});

router.get('/sell', function(req, res, next) {
	logger.log('info','inside /sell get');
	res.render('sell', {title : 'sell'});
});

router.post('/sell', function(req, res, next) {
	logger.log('info','inside /sell post');
	if(!req.session.user){
		json_responses = {"statusCode" : 401};
				res.send(json_responses);
		
	}else{	
	var JSON_query = {

		"item" : req.body.item,
		"desc" : req.body.desc,
		"seller" : req.session.user.username,
		"seller_id" : req.session.user.user_id,
		"price_option" : req.body.price_option,
		"price" : req.body.price,
		"qty" : req.body.qty,
		"duration" : req.body.duration,
		"location" : req.body.location,
	};
	
	var query_string = "INSERT INTO sell SET ?";

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.affectedRows === 1) {
				logger.log('info','items were inserted in sell table successfully');
				
				//now let's make provision for auction
				
				if(req.body.price_option == "auction"){
					logger.log('info','item catogory is auction!');
					
					var millisec_time = 120000;				//for 4 days!	
					
					setTimeout(function () {
						logger.log('info','Bid is expired and now automatic function will perfrom the task to announce winner!'); 

    				
    				//get the highest bidder 

    				var query = "SELECT * from ebay.bids where price = (SELECT MAX(price) FROM ebay.bids)";
    				var winner;
    				var item_id;
						
						mysql.fetchData(function(err, results) {
							if (err) {
								throw err;
							} else {
								if (results.length > 0) {
									logger.log('info','selected highest bidder from bids databases');
									console.log(results);
									var winner = results[0].user_id;
									var item_id = results[0].item_id;
									console.log(winner);	
									console.log(item_id);

			    					var transection_id = uuid.v1();
			    					//update transection table

			    					var query = "INSERT INTO transection SET ?";
						
									var JSON_query = {
											"total" : req.body.price,
											"user_id" : winner ,	
											"id" : transection_id
									};
									
									mysql.fetchData(function(err, results) {
										if (err) {
											throw err;
										} else {
											if (results.affectedRows === 1) {
												logger.log('info','winner of bid transection table is updated');	
												
												//update order_details table

												var query = "INSERT INTO order_details SET ?";
												
												var JSON_query = {
														"seller_id" : req.session.user.user_id,
														"item" : req.body.item,	
														"transection_id" : transection_id,
														"qty" : 1					
												};
												
												mysql.fetchData(function(err, results) {
													if (err) {
														throw err;
													} else {
														if (results.affectedRows === 1) {
															
															logger.log('info','inserted items into order_details database');				
															
															//update qty in sell table
															
															var query = "delete from sell where item_id = '"+item_id+"' AND price_option = 'auction' AND seller_id = '"+req.session.user.user_id+"'";
															
															mysql.fetchData(function(err, results) {
																if (err) {
																	throw err;
																} else {
																	if (results.affectedRows === 1) {							
																		logger.log('info','deleted items from sell database');									
																			
																		//update bids qty as well!..

																		var query = "delete from bids where item_id = '"+item_id+"'";
																					
																					mysql.fetchData(function(err, results) {
																						if (err) {
																							throw err;
																						} else {
																							if (results.length > 0) {							
																								logger.log('info','deleted items from bids database');									
																																		
																							} else{
																								logger.log('info','counld not delete records from sell table!');
																							}
																						}
																					}, query); 
																	} else{
																		logger.log('info','counld not delete records from sell table!');
																	}
																}
															}, query); 
														} 
													}
												}, query,JSON_query); 	
											}else{
												logger.log('info','No bidders for this item!');
											} 
										}
									}, query,JSON_query); 												
											} 
										}
									}, query,JSON_query); 					

					}, millisec_time)}; 
				
				
				var json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);
			} else {
				logger.log('info','items could not be inserted in sell table');
				 json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);
			}
		}
	}, query_string, JSON_query);
	
	}

});

router.post('/signup_scccess', function(req, res, next) {
	logger.log('info','inside /signup_scccess post');
	var first_name = req.body.firstname;
	var last_name = req.body.lastname;
	console.log('last_name', last_name);
	var user_name = req.body.username;
	var get_password = req.body.password;
	var contact = req.body.contact;
	var location = req.body.location;
	// password salt hash
	
	if(req.body.password == null || req.body.password == undefined){
		res.send({"statusCode" : 401});
	}
	// var genRandomString = function(length){
	//     return crypto.randomBytes(Math.ceil(length/2))
	//             .toString('hex') /** convert to hexadecimal format */
	//             .slice(0,length);   /** return required number of characters */
	// };

	// var sha512 = function(password, salt){
	//     var hash = crypto.createHmac('sha512', salt); /**
	// 													 * Hashing algorithm
	// 													 * sha512
	// 													 */
	//     hash.update(password);
	//     var value = hash.digest('hex');
	//     return {
	//         salt:salt,
	//         passwordHash:value
	//     };
	// };
	
	// var hashed_pass;
	// var get_salt="";
	
	// function saltHashPassword(userpassword) {
	//     var salt = genRandomString(16); /** Gives us salt of length 16 */
	//     var passwordData = sha512(userpassword, salt);
	//     hashed_pass = passwordData.passwordHash;
	//     get_salt = salt;
	// }

	
	// saltHashPassword(get_password);
	
	// var query_string = "INSERT INTO users SET ?";

	var args = {

		"f_name" : first_name,
		"l_name" : last_name,
		"username" : user_name,
		"secret" : get_password,
		"contact" : contact,
		"location" : location		
	};

	//soap call

	

	soap.createClient(url,option, function(err, client) {
		// console.log('err, client', err, client);
		client.addUser(args, function(err, result) {
			console.log('err, result', err, result);
			    	  if(result){
			    		 res.send({"statusCode" : 200});
			    	  }
			    	  else{
			    		  res.send({"statusCode" : 401});
			    	  }
	     		 });
	});

	
});
module.exports = router;
