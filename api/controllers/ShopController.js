/**
 * ShopController
 *
 * @description :: Server-side logic for managing shops
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var validator = require('validator')

 function productVariation(req,res,product,color,size,material,price,quantity){

 	var variation={
 		color:color,
 		size:size,
 		material:material,
 		price:price,
 		quantity:1
 	}

 	var i;
 	var isFound=0;
 	var temp=product.product_variation;
 	if(temp){
 		for( i=0;i<product.product_variation.length;i++){
 			if(product.product_variation[i].color==variation.color &&
 				product.product_variation[i].size==variation.size && 
 				product.product_variation[i].material==variation.material){
 				if( quantity!==undefined)
 					variation.quantity= quantity;
 				else
 					variation.quantity= parseInt(product.product_variation[i].quantity)+1;
 				if( price!==undefined)
 					variation.price= price;
 				else
 					variation.price=product.product_variation[i].price
 				isFound=1;
 				temp[i]=variation;
 				break;
 			}	
 		}
 	}
 	else{
 		isFound=0;
 		if( quantity!==undefined)
 			variation.quantity= quantity;
 	}

 	if(isFound){
 		Product.update({id:product.id},{product_variation:temp}).exec(function(err,result){
 			if(err)
 				return res.negotiate(err)
 			return res.json(result);	
 		})
 	}
 	else{

 		if(!temp)
 			temp=[];
 		temp.push(variation);
 		Product.update({id:product.id},{product_variation:temp}).exec(function(err,result){
 			if(err)
 				return res.negotiate(err)
 			res.json(result)
 		})
 	}




 }
 module.exports = {
	/**
	 * A User can create only one shop
	 */
	 createShop: function(req, res, next){
	 	var user_id=req.user.id,
	 	name=req.param('name'),
	 	description=req.param('description'),
	 	location=req.param('location'),
	 	email=req.param('email'),
	 	telephone=req.param('telephone');

	 	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
	 		if(err){
	 			Reporting.logError(err, __filename, req.user)
	 			return res.negotiate(err)
	 		}

	 		if(user.shop.length>0)
	 			return res.badRequest("sorry you already have a shop")

	 		if(!name|| !description|| !validator.isEmail(email)
	 			|| !location || !telephone)
	 			return res.badRequest('Please complete missing fields')

	 		var shopObject={
	 			name:name,
	 			description:description,
	 			location:location,
	 			email:email,
	 			telephone:telephone
	 		}
	 		Shop.create(shopObject).then(function(shop){
	 			user.shop.add(shop.id)
	 			user.save(function(err) {
	 				if(err){
	 					Reporting.logError(err, __filename, req.user)	
	 					return res.negotiate(err);
	 				}

	 			})
	 			res.json(shop)
	 		}).catch(function(err){
	 			Reporting.logError(err, __filename, req.user)
	 			return next(err);
	 		})
	 	})
	 },
/* *
 * User can update his shop
 * 
 */ 
 updateShop:function(req,res,next){

 	var user_id=req.user.id
 	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
 		if(err){
 			Reporting.logError(err, __filename, req.user)
 			return res.serverError(err)
 		}
 		if(user.shop.length==0)
 			return res.badRequest()
 		if(!user)
 			return res.badRequest()

 		Shop.update({id:user.shop[0].id},req.params.all()).exec(function(err,shop){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				res.negotiate(err)
 			}	
 			res.json(shop)
 		})


 	})



 },
/* *
 * User can delete his shop
 * 
 */    
 deleteShop: function(req, res, next){
 	var user_id=req.user.id
 	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
 		if(err){
 			Reporting.logError(err, __filename, req.user)
 			res.negotiate(err)
 		}
 		if(!user)
 			return res.badRequest()
 		if(user.shop.length==0){
 			return res.notFound()

 		}
 		Shop.destroy( {id:user.shop[0].id }).exec( function(){
 			res.send('deleted');
 		});

 	})

 },
/* *
 * User can create or update the shop policy which is payment methods, refund,
 * exchange , and shipment. The default policy is "not yet specified"
 */    
 createAndUpdatePolicy:function(req,res,next){
 	var user_id=req.user.id;
 	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
 		if(err){
 			Reporting.logError(err, __filename, req.user)
 			return res.serverError(err)
 		}
 		if(user.shop.length==0)
 			return res.badRequest()
 		var details={};
 		var paymentMethod=req.body.paymentMethod;
 		var refund=req.body.refund;
 		var exchange=req.body.exchange;
 		var shippment=req.body.shippment;
 		details["paymentMethod"]=paymentMethod;
 		details["refund"]=refund;
 		details["exchange"]=exchange;
 		details["shippment"]=shippment;
 		Shop.update({id:user.shop[0].id},{policy:details}).then(function(shop){
 			res.ok(shop[0])

 		})
 		.catch(function(err){
 			Reporting.logError(err, __filename, req.user)
 			res.serverError(err)
 		})

 	})
 },

/* *
 * User can delete all the policies which will be returned 
 * to the default value
 */ 
 deletePolicy:function(req,res,next){
 	var   ='Not Yet Specified';
 	var user_id=req.user.id
 	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
 		if(err){
 			Reporting.logError(err, __filename, req.user)
 			return res.serverError(err)
 		}
 		if(user.shop.length==0)
 			return res.badRequest()

 		Shop.update({id:user.shop[0].id},{policy:details}).then(function(shop){
 			res.ok(shop[0])

 		})
 		.catch(function(err){
 			Reporting.logError(err, __filename, req.user)
 			res.serverError(err)
 		})

 	})

 },


/* *
 * User can create products using his shop
 * 
 */    
 shopCreateProduct: function(req,res,next){
 	var user_id=req.user.id,
 	name=req.param('name'),
 	description=req.param('description'),
 	keywords=req.param('keywords'),
 	discount=req.param('discount'),
 	category=req.param('category');
 	var color=req.param('color')
 	var size=req.param('size')
 	var material=req.param('material')
 	var quantity=req.param('quantity')
 	var price=req.param('price')
 	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
 		if(err){
 			Reporting.logError(err, __filename, req.user)
 			return res.negotiate(err)
 		}

 		if(user.shop.length==0){
 			return res.badRequest('You do not have a shop');
 		}

 		Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
 			if(err){
 				Reporting.logError(err, __filename, req.user)	
 				return	res.negotiate(err)
 			}
 			if(!shop)
 				return res.notFound()
 			if(!name|| !description|| !keywords || !category)
 				return res.badRequest('Please complete missing fields')
 			var productObject={
 				name:name,
 				description:description,
 				keywords:keywords,
 				category:category,
 				discount:discount
 			}
 			Product.create(productObject).exec(function(err,product){
 				if(err){
 					Reporting.logError(err, __filename, req.user)	
 					res.negotiate(err)
 				}	   			
 				shop.products.add(product.id)
 				shop.save(function(err){
 					if(err){
 						Reporting.logError(err, __filename, req.user)
 						res.negotiate(err)
 					}
 				})
 				productVariation(req,res,product,color,size,material,price,quantity)


 			})

 		})

 	})

 },

/* *
 * Shop can specify the status of his orders whether it is processing or
 * delivered or cancelled
 */ 
 shopSpecifyOrderStatus:function(req,res,next){
 	var user_id=req.user.id;
 	var order=req.param('order')
 	var status=req.param('status')
 	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
 		if(err){
 			Reporting.logError(err, __filename, req.user)
 			return res.negotiate(err)
 		}
 		if(!user)
 			return res.badRequest()

 		if(user.shop.length==0)
 			return res.badRequest()
 		Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(!shop)
 				return res.badRequest()
 			Productorder.find().exec(function(err,orders){
 				if(err){
 					Reporting.logError(err, __filename, req.user)
 					return res.negotiate(err)
 				}
 				var i;
 				var shopOrders=[];


 				for (i=0;i<orders.length;i++){
      					//console.log(shop.products)
      					if(HelperService.containsObject(orders[i].product,shop.products)){
      						shopOrders.push(orders[i])
      					}
      				}

      				if(HelperService.containsObject(order,shopOrders)){
      					Productorder.update({id:order},{status:status}).exec(function(err,statusUpdated){
      						if(err){
      							Reporting.logError(err, __filename, req.user)
      							return res.negotiate(err)
      						}
      						res.ok(statusUpdated)
      					})
      				}
      				else
      					return res.notFound('there is no order with the following id')
      			})

 		})

 	})
 },

/* *
 * Shop can view his orders
 */ 
 shopViewOrders:function(req,res,next){
 	var user_id=req.user.id;
 	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
 		if(err){
 			Reporting.logError(err, __filename, req.user)
 			return res.negotiate(err)
 		}
 		if(!user)
 			return res.badRequest()

 		if(user.shop.length==0)
 			return res.badRequest()
 		Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(!shop)
 				return res.badRequest()
 			Productorder.find().exec(function(err,orders){
 				if(err){
 					Reporting.logError(err, __filename, req.user)
 					return res.negotiate(err)
 				}
 				var i;
 				var shopOrders=[];


 				for (i=0;i<orders.length;i++){
 					if(HelperService.containsObject(orders[i].product,shop.products)){
 						shopOrders.push(orders[i])
 					}
 				}

 				res.ok(shopOrders)


 			})

 		})

 	})
 },

  //// Gina's part///
/* *
 * Shop owner can view his products
 */ 
  viewProducts_asShopOwner:function(req, res, next){
  var user_id=req.user.id;

 User.findOne({id:user_id}).populate('shop').exec(function(err,user){
        if(err){
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
        }
         
        if(user){
           if(user.shop.length==0){
          return res.badRequest('no shop found');
        }
              Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
          if(err){
        Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
          if(!shop)
            return res.badRequest()
           if(shop){
           // console.log(shop)
           // console.log(shop.products[0])
          //  res.ok(shop.products)
            
           res.ok(shop.products)
     
       }
     
     });
     }
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },
      /* *
 * Shop owner can view his sold Products
 */ 
      viewSoldProducts_asShopOwner:function(req, res, next){
  var user_id=req.user.id;
    
 User.findOne({id:user_id}).populate('shop').exec(function(err,user){
        if(err){
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
        }
         
        if(user){
           if(user.shop.length==0){
          return res.badRequest('no shop found');
        }
              Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
          if(err){
         Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
          if(!shop)
            return res.badRequest()
           if(shop){
                     var i =0
                     var sold =0;
          for(i=0;i<shop.products.length;i++){
         
          Product.findOne({id: shop.products[i].id}).exec(function(err,product){
          if(err){
            Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
            
          if(!product)
            return res.ok("no product")
          if(product){
            if(product.purchaseNumber==null)
              //res.ok('no products sold')
              sold =sold+0
            else {sold = sold+1}
          }
          
          

        })
}
res.ok("number of sold products " + " " +sold);
     
       }
     
     });
     }
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },
      /* *
 * Shop Owner can choose his renewel option for his contract
 */ 
      chooseRenewelOptions_asShopOwner:function(req, res, next){
  var user_id=req.user.id;
       

      User.findOne({id:user_id}).populate('shop').exec(function(err,user){
        if(err)
         {
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
         }
        if(user){
           if(user.shop.length==0){
          return res.badRequest('no shop found');
        }
              Shop.findOne({id:user.shop[0].id}).exec(function(err,shop){
          if(err){
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
          if(!shop)
            return res.badRequest()
           if(shop){
           var chosenValue= req.param('chosenMethod')
        //   if(chosenValue in product.delivery_method.enum){
             
     Shop.update({id:shop_id}, {renewel_options: chosenValue})
            .exec(function(err, updatedUser) {
           return res.ok("you have chosen " +" " + chosenValue)
              
            });
       }
     });
     }
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },

      // need to ask gina
      /* *
 * Customer can choose his delivery Method
 */ 
// chooseDeliveryMethod_asCustomer:function(req, res, next){
//   var user_id=req.user.id;
//     var product_id=req.param('product_id');


//       User.findOne({id:user_id}).exec(function(err,user){
//         if(err)
//           {
//             Reporting.logError(err, __filename, req.user)
//       return res.serverError(err)
//           }
//         if(user){
//             Product.findOne({id:product_id}).exec(function(err,product){
//           if(err)
//             {
//               Reporting.logError(err, __filename, req.user)
//                 return res.serverError(err)
//             }
//           if(!product)
//             return res.ok("no product found")
//           if(product){
//            var chosenValue= req.param('chosenMethod')
       
             
//      Product.update({id:product_id}, {delivery_method: chosenValue})
//             .exec(function(err, updatedUser) {
//            return res.ok("you have chosen " +" " + chosenValue)
              
//             });
      
//           }

//         })
 
//         }
    
//         if(!user){
//           res.ok('can not find user');
//         }


//       })

//       },

// need to ask gina
   /* *
 * Customer can choose the delivery date and time
 */ 
      chooseDateandTime_asCustomer:function(req, res, next){
  var user_id=req.user.id;
    var product_id=req.param('product_id');


      User.findOne({id:user_id}).exec(function(err,user){
        if(err)
         {
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
         }
        if(user){
            Product.findOne({id:product_id}).exec(function(err,product){
          if(err)
           {
            Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
           }
          if(!product)
            return res.ok("no product found")
          if(product){
           var chosenValue= req.param('chosenDateandTime')
       
             
     Product.update({id:product_id}, {delivery_date_and_time: chosenValue})
            .exec(function(err, updatedUser) {
           return res.ok("you have chosen " +" " + chosenValue)
              
            });
      
          }
      
        })
 
        }
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },
         /* *
 * Customer can view reports about certain product
 */ 
      viewReports_asCustomer:function(req, res, next){

  var user_id=req.user.id;

      User.findOne({id:user_id}).exec(function(err,user){
        if(err)
         {
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
         }
        if(user){
         if(user.reports.length==0)
      {
        return res.ok("no reports found")
      }
     return res.ok(user.reports);
     
 
        }
    
        if(!user){
          res.ok('can not find user');
        }


      })

      }


};

