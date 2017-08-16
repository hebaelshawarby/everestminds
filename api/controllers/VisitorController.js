
/**
 * VisitorController
 *
 * @description :: Server-side logic for managing visitors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var moment = require('moment');

 module.exports = {

	/** A visitor can search using keywords.He can search within categories 
	*/ 

	Search:function(req,res,next){
		var searchBy=req.param('searchBy')
		var keyword=req.param('keyword');
		var searchKey=req.param('searchKey')
		if(searchBy=='category'&& keyword!==undefined){
			Product.find({category:searchKey,keywords:{'contains':keyword}}).exec(function(err,products){
				if(err){
					Reporting.logError(err, __filename, req.user)
					return res.negotiate(err)
				}
				if(products.length==0)
					return res.ok('There is no product which have the following keyword')
				res.ok(products)

			})
		}
		else if(searchBy=='category'&& keyword==undefined){
			Product.find({category:searchKey}).exec(function(err,products){
				if(err){
					Reporting.logError(err, __filename, req.user)
					return res.negotiate(err)
				}
				if(products.length==0)
					return res.ok('There is no product in this category')
				res.ok(products)

			})
		}

		else{
			Product.find({keywords:{'contains':keyword}}).exec(function(err,products){
				if(err){
					Reporting.logError(err, __filename, req.user)
					return res.negotiate(err)
				}
				if(products.length==0)
					return res.ok('There is no product which have the following keyword')
				res.ok(products)

			})
		}
	},


/** A visitor can filter the products by discount , ratings , best seller , 
 *  new items or just keywords
 */
 filter: function(req,res,next){
 	var searchBy= req.param('searchBy');
 	var keyword=req.param('keyword');

 	if (searchBy=='discount' && keyword!==undefined){
 		Product.find({keywords:{'contains':keyword},discount:{'!':null}}).exec(function(err,products){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(products.length==0)
 				return res.notFound('There is no product which have the following keyword')
 			
 			res.ok(products)

 		})

 	}
 	else if(searchBy=='discount' && keyword==undefined){
 		Product.find({discount:{'!':null}}).exec(function(err,products){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(products.length==0)
 				return res.ok('There is no product which have the following keyword')
 			res.ok(products)

 		})

 	}

 	else if (searchBy=='newItem'&& keyword==undefined){
 		Product.find().sort({createdAt:'desc'}).exec(function(err,products){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(products.length==0)
 				return res.ok('There is no product')

 			res.ok(products)
 		})
 	}

 	else if (searchBy=='newItem'&& keyword!==undefined){
 		Product.find({keywords:{'contains':keyword}}).sort({createdAt:'desc'}).exec(function(err,products){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(products.length==0)
 				return res.ok('There is no product')

 			res.ok(products)
 		})
 	}
 	else if (searchBy=='ratings'&& keyword==undefined){
 		Product.find().sort({rate:'desc'}).exec(function(err,products){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(products.length==0)
 				return res.ok('There is no product')

 			res.ok(products)
 		})
 	}

 	else if (searchBy=='ratings'&& keyword!==undefined){
 		Product.find({keywords:{'contains':keyword}}).sort({rate:'desc'}).exec(function(err,products){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(products.length==0)
 				return res.ok('There is no product')

 			res.ok(products)
 		})
 	}

 	else if (searchBy=='bestSeller'&& keyword==undefined){

 		Product.find({purchaseNumber:{'!':null}}).sort({purchaseNumber:'desc'}).limit(4).exec(function(err,products){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(products.length==0)
 				return res.ok('There is no product')
 			res.ok(products)

 		}) 
 	}

else if (searchBy=='bestSeller'&& keyword!==undefined){
	
	Product.find({purchaseNumber:{'!':null},keywords:{'contains':keyword}}).sort({purchaseNumber:'desc'}).limit(4).exec(function(err,products){
		if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(products.length==0)
 				return res.ok('There is no product')
 	    res.ok(products)

	})
}

else{
	Product.find({keywords:{'contains':keyword}}).exec(function(err,products){
		if(err){
			Reporting.logError(err, __filename, req.user)
			return res.negotiate(err)
		}
		if(products.length==0)
 				return res.ok('There is no product')
		return res.ok(products)
	})
}

},
	/** A visitor can within each category find all products   
	*/

	productsWithinCategory:function(req,res,next){
		var category=req.param('category')
		Product.find({category:{'contains':category}}).exec(function(err,products){
			if(err){
				Reporting.logError(err, __filename, req.user)
				return res.negotiate(err)
			}
			if(products.length==0)
 				return res.ok('There is no product')
			return res.ok(products)
		})
	},

	bestSeller:function(req,res,next){
	Product.find({purchaseNumber:{'!':null}}).sort({purchaseNumber:'desc'}).limit(4).exec(function(err,products){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(products.length==0)
 				return res.ok('There is no product')
 			res.ok(products)

 		}) 	
	},

	bestRatings:function(req,res,next){
	Product.find().sort({rate:'desc'}).limit(4).exec(function(err,products){
 			if(err){
 				Reporting.logError(err, __filename, req.user)
 				return res.negotiate(err)
 			}
 			if(products.length==0)
 				return res.ok('There is no product')

 			res.ok(products)
 		})
	},


	viewNumberofProduct_Purchase_asVisitor:function(req, res, next){

Product.findOne({id: req.param('product_id')}).exec(function(err,product){
     if(err)
          {
          	Reporting.logError(err, __filename, req.user)
				return res.negotiate(err)
          }
    if(!Product){
          return res.notFound("product not found")
        }

        
   if(!product.purchaseNumber){
           return res.ok('0')
          }
         return res.ok(product.purchaseNumber)
        
         
            });
     

      },



};

