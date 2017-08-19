/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 // function  upload (req, res) {
 //  if(req.method === 'GET')
 //   return res.json({'status':'GET not allowed'});      
  
 //  sails.log.debug('We have entered the uploading process ');
  
 //  req.file('userPhoto').upload({
 //   dirname:'../../assets/images/'},function(err,files){
 //   sails.log.debug('file is :: ', +files);
 //   maxBytes: 10000000;
 //   if (err) return res.serverError(err);        
 //   console.log(files[0].filename);
 //   var title=files[0].filename
 //       Media.create({title:title})
 //            .exec(function(err, media) {
 //                 res.ok('image added ');
 //            });

 //   //  res.json({status:200,file:files});
 //   });
 // }
//list by feature product 
module.exports = {

        addProductImage:function(req, res, next){
var user_id=req.body.user_id
console.log(user_id)
var product_id=req.body.product_id
console.log(product_id)
 User.findOne({id:user_id}).populate('shop').exec(function(err,user){
        if(err)
          return res.serverError(err)
        if(user){
           if(user.shop.length==0){
          return res.badRequest('no shop found');
        }
              Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
          if(err){
          return  res.negotiate(err)
          }
          if(!shop)
            return res.badRequest()
           if(shop){
         

          Product.findOne({id:product_id}).populate('media').exec(function(err,product){
     if(err)
          return res.serverError(err)
        if(product){
          // upload(req,res)
           if(req.method === 'GET')
   return res.json({'status':'GET not allowed'});      
  
  sails.log.debug('We have entered the uploading process ');
  
  req.file('userPhoto').upload({
   dirname:'../../assets/images/ProductImage'},function(err,files){
   sails.log.debug('file is :: ', +files);
   maxBytes: 10000000;
   if (err) return res.serverError(err);        
   //console.log(files[0].filename);
   var title=files[0].filename
   var url=files[0].fd
       Media.create({title:title,url:url})
            .exec(function(err, media) {
               product.media.add(media.id)
           product.save(function(err) {
               if(err)
               return res.negotiate(err);
      })
                // res.ok('image added ');
                res.ok(url);
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
       removeProductImage:function(req, res, next){
var user_id=req.body.user_id
console.log(user_id)
var product_id=req.body.product_id
console.log(product_id)
var image_id=req.body.image_id

 User.findOne({id:user_id}).populate('shop').exec(function(err,user){
        if(err)
          return res.serverError(err)
        if(user){
           if(user.shop.length==0){
          return res.badRequest('no shop found');
        }
              Shop.findOne({id:user.shop[0].id}).populate('products').exec(function(err,shop){
          if(err){
          return  res.negotiate(err)
          }
          if(!shop)
            return res.badRequest()
           if(shop){
         

          Product.findOne({id:product_id}).populate('media').exec(function(err,product){
     if(err)
          return res.serverError(err)
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
       addEventImage:function(req, res, next){
var user_id=req.body.user_id
console.log(user_id)
 var event_id=req.body.event_id
// console.log(product_id)
 User.findOne({id:user_id}).populate('events').exec(function(err,user){
        if(err)
          return res.serverError(err)
        if(user){
           
              Event.findOne({id:event_id}).populate('media').exec(function(err,event){
          if(err){
          return  res.negotiate(err)
          }
          if(!event)
            return res.badRequest('no event found')
           if(event){
         

      
          // upload(req,res)
           if(req.method === 'GET')
   return res.json({'status':'GET not allowed'});      
  
  sails.log.debug('We have entered the uploading process ');
  
  req.file('userPhoto').upload({
   dirname:'../../assets/images/EventImage'},function(err,files){
   sails.log.debug('file is :: ', +files);
   maxBytes: 10000000;
   if (err) return res.serverError(err);        
   console.log(files[0].filename);
   var title=files[0].filename
   var url=files[0].fd
       Media.create({title:title,url:url})
            .exec(function(err, media) {
               event.media.add(media.id)
           event.save(function(err) {
               if(err)
               return res.negotiate(err);
      })
                 res.ok(url);
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
       removeEventImage:function(req, res, next){
var user_id=req.body.user_id
console.log(user_id)
var image_id=req.body.image_id
var event_id=req.body.event_id


 User.findOne({id:user_id}).populate('events').exec(function(err,user){
        if(err)
          return res.serverError(err)
        if(user){
           if(user.shop.length==0){
          return res.badRequest('no event found');
        }
              Event.findOne({id:event_id}).populate('media').exec(function(err,event){
          if(err){
          return  res.negotiate(err)
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
        addShopImage:function(req, res, next){
var user_id=req.body.user_id
console.log(user_id)
// var product_id=req.body.product_id
// console.log(product_id)
 User.findOne({id:user_id}).populate('shop').exec(function(err,user){
        if(err)
          return res.serverError(err)
        if(user){
           if(user.shop.length==0){
          return res.badRequest('no shop found');
        }
              Shop.findOne({id:user.shop[0].id}).populate('media').exec(function(err,shop){
          if(err){
          return  res.negotiate(err)
          }
          if(!shop)
            return res.badRequest()
           if(shop){
         

      
          // upload(req,res)
           if(req.method === 'GET')
   return res.json({'status':'GET not allowed'});      
  
  sails.log.debug('We have entered the uploading process ');
  
  req.file('userPhoto').upload({
   dirname:'../../assets/images/ShopImage'},function(err,files){
   sails.log.debug('file is :: ', +files);
   maxBytes: 10000000;
   if (err) return res.serverError(err);        
   console.log(files[0].filename);
   var title=files[0].filename
   var url=files[0].fd
       Media.create({title:title,url:url})
            .exec(function(err, media) {
               shop.media.add(media.id)
           shop.save(function(err) {
               if(err)
               return res.negotiate(err);
      })
                 res.ok(url);
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
       removeShopImage:function(req, res, next){
var user_id=req.body.user_id
console.log(user_id)
var image_id=req.body.image_id


 User.findOne({id:user_id}).populate('shop').exec(function(err,user){
        if(err)
          return res.serverError(err)
        if(user){
           if(user.shop.length==0){
          return res.badRequest('no shop found');
        }
              Shop.findOne({id:user.shop[0].id}).populate('media').exec(function(err,shop){
          if(err){
          return  res.negotiate(err)
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
        addUserImage:function(req, res, next){
var user_id=req.body.user_id
console.log(user_id)
var product_id=req.body.product_id
console.log(product_id)
 User.findOne({id:user_id}).populate('media').exec(function(err,user){
        if(err)
          return res.serverError(err)
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
   var url=files[0].fd
       Media.create({title:title,url:url})
            .exec(function(err, media) {
               user.media.add(media.id)
           user.save(function(err) {
               if(err)
               return res.negotiate(err);
      })
                 res.ok(url);
            });

   //  res.json({status:200,file:files});
   });
        }
              
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },
       removeUserImage:function(req, res, next){
var user_id=req.body.user_id
console.log(user_id)
var image_id=req.body.image_id

 User.findOne({id:user_id}).populate('media').exec(function(err,user){
        if(err)
          return res.serverError(err)
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

  // uploadImage: function(req, res) {
  //       req.file('image').upload({
  //           adapter: require('skipper-gridfs'),
  //           uri: 'mongodb://localhost:27017/restaurant.images'
  //       }, function (err, uploadedImages) {
  //           if (err) return res.negotiate(err);

  //           var obj = {};
  //           if(req.param('product_id')) {
  //               obj = Product;
  //           } else if(req.param('product_category_id')) {
  //               obj = ProductCategory;
  //           } else {
  //               return res.badRequest({message: 'Parent entity not found'});
  //           }
  //           var id = req.param('product_id') || req.param('product_category_id');

  //           obj.findOne({id: id}).then(function(found) {
  //               if(!found) throw new Error('Related entity not found');
  //               return found;
  //           }).then(function(found) {
  //               for(var i in uploadedImages) {
  //                   if(!found.images) found.images = [];
  //                   found.images.push(uploadedImages[i].fd);
  //               }
  //               obj.update({id: id}, {images: found.images}).exec(function(err, updated) {
  //                   return res.ok({
  //                       files: uploadedImages,
  //                       textParams: req.params.all()
  //                   });
  //               })
  //           }).catch(function(error){
  //               console.error(error);
  //               return res.badRequest({message: error.message});
  //           });

  //       });
  //   },
//     viewImage: function(req, res) {
//         var blobAdapter = require('skipper-gridfs')({
//             uri: 'mongodb://localhost:27017/restaurant.images'
//         });

//         var fd = req.param('id'); // value of fd comes here from get request
//         blobAdapter.read(fd, function(error , file) {
//             if(error) {
//                 res.json(error);
//             } else {
//                 res.contentType('image/jpeg');
//                 res.send(new Buffer(file));
//             }
//         });
//     },
//     delete: function(req, res) {
//         var blobAdapter = require('skipper-gridfs')({
//             uri: 'mongodb://localhost:27017/restaurant.images'
//         });

//         var fd = req.param('id'); // value of fd comes here from get request
//         blobAdapter.rm(fd, function(error , file) {
//             if(error) {
//                 res.json(error);
//             } else {
//                 var Promise = require('q');
//                 // remove relations
//                 Promise.all([
//                     Product.findOne({images: fd}),
//                     ProductCategory.findOne({images: fd})
//                 ])
//                 .spread(function(product, product_category){
//                     if(product) {
//                         var i = product.images.indexOf(fd);
//                         if (i > -1) {
//                             product.images.splice(i, 1);
//                         }
//                         Product.update({images: fd}, {images: product.images}).exec(function(err, updated) {
//                             if(err) throw new Error(err);
//                             return res.ok({
//                                 removed_image: fd,
//                                 product_updated: updated[0].id
//                             });
//                         });
//                     } else if(product_category) {
//                         var i = product_category.images.indexOf(fd);
//                         if (i > -1) {
//                             product_category.images.splice(i, 1);
//                         }
//                         ProductCategory.update({images: fd}, {images: product_category.images}).exec(function(err, updated) {
//                             if(err) throw new Error(err);
//                             return res.ok({
//                                 removed_image: fd,
//                                 product_category_updated: updated[0].id
//                             });
//                         });
//                     } else {
//                         return res.ok({
//                             removed_image: fd
//                         });
//                     }
//                 })
//                 .catch(function(error){
//                     console.error(error);
//                     return res.badRequest({message: error});
//                 });

//             }
//         });
// }
};