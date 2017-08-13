/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
	 * A shop can add product variations such as color,size,material
	 * and its quantity and the price. He can add the same variation which
	 * will result in adding the quantity automatically 
	 */
	shopAddProductVariation:function(req,res,next){
		var user_id=req.user.id;
		var product_id=req.param('product')
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
			if(!user)
				return res.forbidden()
			if(user.shop.length>0){
				Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
				if(err){
					Reporting.logError(err, __filename, req.user)
					return res.negotiate(err)
				}
				if(!shop)
					return res.badRequest()
			

				Product.findOne({id:product_id}).exec(function(err,product){
				if(err){
					Reporting.logError(err, __filename, req.user)
					return res.negotiate(err)
				}
				if(!product)
					return res.badRequest()
				if(HelperService.containsObject(product.id,shop.products))
				productVariation(req,res,product,color,size,material,price,quantity)
				else
					return res.forbidden('This is not a product in your shop')

				})

			})
			}
			else
				return res.badRequest();
		})
	},
	/**
	 * A shop can update product variations by looking for color,size,material
	 * and updating its quantity and the price.
	 *  
	 */
	shopUpdateProductVariation:function(req,res,next){
		var user_id=req.user.id;
		var product_id=req.param('product')
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
			if(!user)
				return res.forbidden()
			if(user.shop.length>0){
				Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
				if(err){
					Reporting.logError(err, __filename, req.user)
					return res.negotiate(err)
				}
				if(!shop)
					return res.badRequest()
				if(HelperService.containsObject(product_id,shop.products)){
				Product.findOne({id:product_id}).exec(function(err,product){
				if(err){
					Reporting.logError(err, __filename, req.user)
					return res.negotiate(err)
				}
				if(!product)
					return res.badRequest()

             var variation={
					color:color,
					size:size,
					material:material
					
				}	
				var i;
				var isFound=0;
				var temp=product.product_variation;
				for( i=0;i<product.product_variation.length;i++){
					if(product.product_variation[i].color==variation.color &&
					 product.product_variation[i].size==variation.size && 
					 product.product_variation[i].material==variation.material){
					 	if( quantity!==undefined)
						variation.quantity= quantity;
					else
						variation.quantity=product.product_variation[i].quantity
						if(price!==undefined)
						variation.price=price
					else
						variation.price=product.product_variation[i].price

						isFound=1;
						temp[i]=variation;
						break;
					}	
						}
				if(isFound){
					Product.update({id:product.id},{product_variation:temp}).exec(function(err,result){
					if(err){
						Reporting.logError(err, __filename, req.user)
						return res.negotiate(err)
					}
					return res.json(result);	
				})
					}	
				else
				{
					return res.notFound('sorry there is no product with the following criteria')
				}		
				})
			}
			else
				return res.forbidden('This is not a product in your shop')
			})
			}
			else
				return res.badRequest();
						})
	},
	/**
	 * A shop can delete a product if only it is in his shop
	 *  
	 */
    deleteProduct: function(req,res,next){
	var user_id=req.user.id
	var product_id=req.param('product');
	   	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
	   		if(err){
	   			Reporting.logError(err, __filename, req.user)
	   			return res.negotiate(err)
	   		}
	   		if(!user)
	   			return res.badRequest()

	   		if(user.shop.length==0){
	   			return res.badRequest();
	   		}

	   		Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
	   			if(err){
	   				Reporting.logError(err, __filename, req.user)
	   			return	res.negotiate(err)
	   			}
	   			if(!shop)
	   				return res.badRequest()
	   			if(HelperService.containsObject(product_id,shop.products)){
	   			Product.destroy({id:product_id}).exec(function(err,product){
	   			if(err){
	   				Reporting.logError(err, __filename, req.user)
	   				return res.negotiate(err)
	   			}
	   			res.ok("product deleted")
	   			

	   		})
	   		}
	   		else
	   			res.forbidden('this product is not in your shop')

	   		})

	   	})
 

},

	/**
	 * A shop can delete product variations by looking for color,size,material
	 * and then deleting this entire variation
	 *  
	 */
	shopDeleteProductVariation:function(req,res,next){
		var user_id=req.user.id;
		var product_id=req.param('product')
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
			if(!user)
				return res.forbidden()
			if(user.shop.length>0){
				Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
				if(err){
					Reporting.logError(err, __filename, req.user)
					return res.negotiate(err)
				}
				if(!shop)
					return res.badRequest()
				if(HelperService.containsObject(product_id,shop.products)){

				Product.findOne({id:product_id}).exec(function(err,product){
				if(err){
					Reporting.logError(err, __filename, req.user)
					return res.negotiate(err)
				}
				if(!product)
					return res.badRequest()

             var variation={
					color:color,
					size:size,
					material:material
					
				}	
				var i;
				var isFound=0;
				var temp=product.product_variation;
				for( i=0;i<product.product_variation.length;i++){
					if(product.product_variation[i].color==variation.color &&
					 product.product_variation[i].size==variation.size && 
					 product.product_variation[i].material==variation.material){
					 
						isFound=1;
						temp.splice(i,1)
						break;
					}	
						}
				if(isFound){
					Product.update({id:product.id},{product_variation:temp}).exec(function(err,result){
					if(err){
						Reporting.logError(err, __filename, req.user)
						return res.negotiate(err)
					}
					return res.json(result);	
				})
					}	
				else
				{
					return res.notFound('sorry there is no product with the following criteria')
				}		
				})
		}
		else
			return res.forbidden('This is not a product in your shop')

			})
			}
			else
				return res.badRequest();
		})

	},

	

	 featureProduct:function(req,res,next){
	 	var user_id=req.user.id;
	 	var product_id=req.param('product');
	 	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
	 		if(err)
	 			return res.negotiate(err)
	 		if(!user)
	 			return res.badRequest()

	 		if(user.shop.length==0)
	 			return res.badRequest()
	 		Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
	 			if(err)
	 				return res.negotiate(err)
	 			if(!shop)
	 				return res.badRequest()
	 			Product.update({id:product_id},{feature:true}).exec(function(err,featureProduct){
	 				if(err)
	 					return res.negotiate(err)
	 				res.json(featureProduct)
	 			})


	 		})

	 	})
	 },

	 addProductKeywords: function(req,res,next){
	var user_id=req.user.id;
	var keyword=req.param('keyword')
	var list=[];
	var requestedProduct=req.param('id');

	   	User.findOne({id:user_id}).populate('shop').exec(function(err,user){
	   		if(err){
	   			return res.negotiate(err)
	   		}

	   		if(user.shop.length==0){
	   			return res.badRequest();
	   		}

	   		Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
	   			if(err){
	   			return	res.negotiate(err)
	   			}
	   			if(!shop)
	   				return res.notFound('there is no shop')


	   		Product.findOne({id:requestedProduct}).exec(function(err,product){
	   			if(err)
	   				return res.negotiate(err)

	   			if(HelperService.containsObject(product.id,shop.products)){
	   				list=product.keywords
	   				list.push(keyword)
	   				Product.update({id:product.id},{keywords:list}).exec(function(err,updatedProduct){
	   					if(err)
	   						return res.negotiate(err)
	   					else
	   						return res.ok(updatedProduct)
	   				})

	   			}

	   			else
	   				return res.badRequest("This product is not in your shop")




	   		})	

	   			
	   		})

	   	})   	


},
	    /**
	 * shopOwner can add product discount  
	 */
	 addProductDiscount:function(req, res, next){
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
      if(err){
      	Reporting.logError(err, __filename, req.user)
 			return res.serverError(err)
    }
    if(product){
    var discount = req.param('discount')
         Product.update({id:product.id}, {discount:discount}).exec(function(err,productz){
          res.ok(" discount is updated")
return res.ok(productz.discount);
         })
         
     } 
    
    if(!product){
      res.notFound('can not find product');
    }
  })  
        }
    
        if(!user){
          res.notFound('can not find user');
        }


      })

      },
      /**
	 * user can view product discount  
	 */
viewProductDiscount:function(req, res, next){
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
      if(err){
      	Reporting.logError(err, __filename, req.user)
 			return res.serverError(err)
    }
    if(product){
     if(product.discount==0)
      {
        return res.ok("no discounts yet")
      }
     return res.ok(product.discount);
     } 
    
    if(!product){
      res.notFound('can not find product');
    }
  })  
        }
    
        if(!user){
          res.notFound('can not find user');
        }


      })

      }

    
};

