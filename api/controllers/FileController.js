

/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 ////GINAAA's work///////
module.exports = {
   /**
   * shopowner can add his product's image  
   */
        addProductImage:function(req, res, next){
    var user_id=req.user.id;
    var product_id=req.param('product_id');
// var user_id=req.body.user_id
// console.log(user_id)
// var product_id=req.body.product_id
// console.log(product_id)
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
              Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
          if(err){
         Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
          if(!shop)
            return res.badRequest()
           if(shop){
         

          Product.findOne({id:product_id}).populate('media').exec(function(err,product){
     if(err)
          {
            Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
        if(product){
          // upload(req,res)
           if(req.method === 'GET')
   return res.json({'status':'GET not allowed'});      
  
  sails.log.debug('We have entered the uploading process ');
  
  req.file('userPhoto').upload({
   dirname:'../../assets/images/'},function(err,files){
   sails.log.debug('file is :: ', +files);
   maxBytes: 10000000;
   if (err) return res.serverError(err);        
   console.log(files[0].filename);
   var title=files[0].filename
       Media.create({title:title})
            .exec(function(err, media) {
               product.media.add(media.id)
           product.save(function(err) {
               if(err)
               return res.negotiate(err);
      })
                 res.ok('image added ');
            });

   //  res.json({status:200,file:files});
   });
          }
         if(!product){
          res.ok("product not found")
        }

            });
     
     
       }
     
     });
     }
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },
       /**
   * shopowner can remove his product's image  
   */
       removeProductImage:function(req, res, next){
// var user_id=req.body.user_id
// console.log(user_id)
// var product_id=req.body.product_id
// console.log(product_id)
// var image_id=req.body.image_id
var user_id=req.user.id;
var product_id=req.param('product_id');
var image_id=req.param('image_id')
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
              Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
          if(err){
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
          if(!shop)
            return res.badRequest()
           if(shop){
         

          Product.findOne({id:product_id}).populate('media').exec(function(err,product){
     if(err)
         {
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
         }
        if(product){
          // upload(req,res)
          Media.destroy( {id:image_id }).exec( function(){
      res.send('deleted');
    });
          }
         if(!product){
          res.ok("product not found")
        }

            });
     
     
       }
     
     });
     }
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },
       /**
   * user can remove his event's image  
   */
       addEventImage:function(req, res, next){
// var user_id=req.body.user_id
// console.log(user_id)
//  var event_id=req.body.event_id
// // console.log(product_id)
var user_id=req.user.id;
var event_id=req.param('event_id');
 User.findOne({id:user_id}).populate('events').exec(function(err,user){
        if(err)
          {
            Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
        if(user){
           
              Event.findOne({id:event_id}).populate('media').exec(function(err,event){
          if(err){
         Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
          if(!event)
            return res.badRequest('no event found')
           if(event){
         

      
          // upload(req,res)
           if(req.method === 'GET')
   return res.json({'status':'GET not allowed'});      
  
  sails.log.debug('We have entered the uploading process ');
  
  req.file('userPhoto').upload({
   dirname:'../../assets/images/'},function(err,files){
   sails.log.debug('file is :: ', +files);
   maxBytes: 10000000;
   if (err) return res.serverError(err);        
   console.log(files[0].filename);
   var title=files[0].filename
       Media.create({title:title})
            .exec(function(err, media) {
               event.media.add(media.id)
           event.save(function(err) {
               if(err)
               return res.negotiate(err);
      })
                 res.ok('image added ');
            });

   });
  
       }
     
     });
     }
    
        if(!user){
          res.ok('can not find user');
        }

      })

      },
       /**
   * user can remove his event's image  
   */
       removeEventImage:function(req, res, next){
// var user_id=req.body.user_id
// console.log(user_id)
// var image_id=req.body.image_id
// var event_id=req.body.event_id
var user_id=req.user.id;
var image_id=req.param('image_id');
var event_id=req.param('event_id');
 User.findOne({id:user_id}).populate('events').exec(function(err,user){
        if(err)
         {
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
         }
        if(user){
           if(user.shop.length==0){
          return res.badRequest('no event found');
        }
              Event.findOne({id:event_id}).populate('media').exec(function(err,event){
          if(err){
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
          if(!event)
            return res.badRequest('no event found')
           if(event){
         
Media.destroy( {id:image_id}).exec( function(){
      res.send('deleted');
    });
     
       }
    
     });
     }
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },
       /**
   * shopowner can add his shop's image  
   */
        addShopImage:function(req, res, next){
// var user_id=req.body.user_id
// console.log(user_id)
// var product_id=req.body.product_id
// console.log(product_id)
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
              Shop.findOne({id:user.shop[0].id}).populate('media').exec(function(err,shop){
          if(err){
         Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
          if(!shop)
            return res.badRequest()
           if(shop){
         

      
          // upload(req,res)
           if(req.method === 'GET')
   return res.json({'status':'GET not allowed'});      
  
  sails.log.debug('We have entered the uploading process ');
  
  req.file('userPhoto').upload({
   dirname:'../../assets/images/'},function(err,files){
   sails.log.debug('file is :: ', +files);
   maxBytes: 10000000;
   if (err) return res.serverError(err);        
   console.log(files[0].filename);
   var title=files[0].filename
       Media.create({title:title})
            .exec(function(err, media) {
               shop.media.add(media.id)
           shop.save(function(err) {
               if(err)
               return res.negotiate(err);
      })
                 res.ok('image added ');
            });

   //  res.json({status:200,file:files});
   });
       }
     
     });
     }
    
        if(!user){
          res.ok('can not find user');
        }

      })

      },
      /**
   * shopowner can remove his shop's image  
   */
       removeShopImage:function(req, res, next){
// var user_id=req.body.user_id
// console.log(user_id)
// var image_id=req.body.image_id
var user_id=req.user.id;
var image_id=req.param('image_id');


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
              Shop.findOne({id:user.shop[0].id}).populate('media').exec(function(err,shop){
          if(err){
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
          if(!shop)
            return res.badRequest()
           if(shop){
         
Media.destroy( {id:image_id}).exec( function(){
      res.send('deleted');
    });
     
       }
    
     });
     }
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },
      /**
   * user can add his image  
   */
        addUserImage:function(req, res, next){
// var user_id=req.body.user_id
// console.log(user_id)
// var product_id=req.body.product_id
// console.log(product_id)
var user_id=req.user.id;
var product_id=req.param('product_id');
 User.findOne({id:user_id}).populate('media').exec(function(err,user){
        if(err)
          {
            Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
          }
        if(user){
           if(req.method === 'GET')
   return res.json({'status':'GET not allowed'});      
  
  sails.log.debug('We have entered the uploading process ');
  
  req.file('userPhoto').upload({
   dirname:'../../assets/images/'},function(err,files){
   sails.log.debug('file is :: ', +files);
   maxBytes: 10000000;
   if (err) return res.serverError(err);        
   console.log(files[0].filename);
   var title=files[0].filename
       Media.create({title:title})
            .exec(function(err, media) {
               user.media.add(media.id)
           user.save(function(err) {
               if(err)
               return res.negotiate(err);
      })
                 res.ok('image added ');
            });

   //  res.json({status:200,file:files});
   });
        }
              
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },
      /**
   * user can remove his image  
   */
       removeUserImage:function(req, res, next){
// var user_id=req.body.user_id
// console.log(user_id)
// var image_id=req.body.image_id
var user_id=req.user.id;
var image_id=req.param('image_id');

 User.findOne({id:user_id}).populate('media').exec(function(err,user){
        if(err)
         {
          Reporting.logError(err, __filename, req.user)
      return res.serverError(err)
         }
        if(user){
           Media.destroy( {id:image_id}).exec( function(){
      res.send('deleted');
    });
        }
              
    
        if(!user){
          res.ok('can not find user');
        }


      })

      }

};

