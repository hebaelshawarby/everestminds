/* *
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt-nodejs')
var moment = require('moment')
var util = require('util');
var _ = require('underscore')
var multer=require('multer')
var mime=require('mime')
var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./assets/images')
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+"."+mime.extension(file.mimetype))
  }
});

var upload= multer({dest: __dirname+'/public/uploads/',storage:storage})
function updateUserPassword (password, user_id, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, null, function (err, hash) {
      User.update({id: user_id}, {password: hash}).exec(function (err, users) {
        if (err || users.length == 0) {
          Reporting.logError(err, __filename, req.user)
          callback(err, null)
        } else {
          Analytics.track('server:user edited profile', 'action', 'user', users[0].email, users[0].id, 'server', null, function (result) {
          })
          callback(null, users[0])
          //  res.json(users[0].toJSON())
        }
      })
    })
  })
}

function compareMobileCode (req, res, code, savedCode, phone) {
  if (code == savedCode) {
    if(!req.user)
      return res.ok({msg: 'Mobile Verified Successfully'})
    User.update({id: req.user.id}, {phone: phone}).exec(function (err, users) {
      if (err) return res.badRequest('This mobile number already exists and used by another user!')
      if (users.length == 0) {
        Reporting.logError(err, __filename, req.user)
        return res.badRequest("Error saving your mobile number, please try again.")
      }
      else {
        Analytics.track('server:user verified mobile', 'action', 'user', users[0].email, users[0].id, 'server', null, function (result) {
        })
        UserService.updateUserInfoCookie(res, users[0])
        res.ok(users[0].toJSON())
      }
    })
  } else {
    console.log("No Match")
    return res.badRequest("Mobile verification code entered does not match")
  }
}


module.exports = {

  /* *
   * User logout
   *
   * (GET /user/logout/)
   */
  logout: function (req, res) {
    res.clearCookie('e_m_t')
    UserService.deleteUserInfoCookie(res)
    req.session.user = undefined
    req.session.authenticated = false
    req.logout()
    res.json({})
  },

  /* *
   * View user account page
   *
   * (GET /user/account/)
   */
  account: function(req, res){
    res.ok({title: 'Account Settings'}, 'user/account/account')
  },

  /* *
   * Update user account info
   *
   * (POST /user/updateProfileinfo/)
   */
  updateProfileinfo: function (req, res) {
    var usr = req.param("user")
    // console.log(usr)

    if(usr.work_email == '')
        usr.work_email = null;

    if (!usr.updated_location)
      usr.updated_location = true

    var toCompareEmail = usr.email

    UserService.getCurrUserInfo(req, function (err, user) {
      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")

      toCompareEmail = user.email

      User.update({id: req.user.id}, usr).exec(function (err, users) {
        if (err || users.length == 0) {
          Reporting.logError(err, __filename, req.user)
          res.negotiate(err)
        }
        else {
          if(users[0].email != toCompareEmail){
            User.update({id: req.user.id}, {email_verified: false}).exec(function (err, users) {
              if(err) Reporting.logError(err, __filename, req.user)
              if(!err && users && users.length > 0){
                EmailService.sendVerificationEmail(users[0], UtilityService.constructEmailVerificationLink(users[0]), sails.config.appName)

              }
            })
          }
          Analytics.track('server:user edited profile', 'action', 'user', users[0].email, users[0].id, 'server', null, function (result) {
          })
          UserService.updateUserInfoCookie(res, users[0])
          res.ok(users[0].toJSON())
        }
      })

    })

  },

  /* *
   * Update user password
   *
   * (POST /user/updatePassword/)
   */
  updatePassword: function (req, res) {
    // var user = UserService.getCurrUserInfo(req)
    console.log(req.param("reset_token"))
    var query = req.user ? {where:{id: req.user.id}, select:['password']} : {where:{reset_token: req.param("reset_token"), reset_token_expires:{ '>' : moment().toISOString()}}, select:['password']}
    User.findOne(query, function (err, user) {
      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")

      if (req.user) {
        if (user.password) {
          //  Load the bcrypt module
          var currPassord = req.param("currPassword")
          console.log(currPassord)
          bcrypt.compare(currPassord, user.password, function (err, result) {
            //  res === false

            if (err || !result) {
              Reporting.logError(err, __filename, req.user)
              return res.forbidden("Wrong current password")
            } else {
              //  res === true
              //  Store new password in database
              bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.param('newPassword'), salt, null, function (err, hash) {
                  if (err || !hash) return res.negotiate(err)
                  User.update({id: req.user.id}, {password: hash}).exec(function (err, users) {
                    if (err || users.length == 0) {
                      Reporting.logError(err, __filename, req.user)
                      res.negotiate(err)
                    }
                    else {
                      Analytics.track('Profile update', 'action', 'user', users[0].email, users[0].id, 'server', null, function (result) {
                      })
                      UserService.updateUserInfoCookie(res, users[0])
                      res.ok(users[0].toJSON())
                    }
                  })
                })
              })

            }

          })
        } else {
          //  res === true
          //  Store new password in database
          updateUserPassword(req.param('newPassword'), req.user.id, function (err, user) {
            if (err || !user) return res.negotiate(err)
            UserService.updateUserInfoCookie(res, user)
            return res.ok(user.toJSON())
          })
        }
      } else if (req.param('user_id') && _.isNumber(parseInt(req.param('user_id')))) {
        console.log('updatinggg')
        updateUserPassword(req.param('newPassword'), req.param('user_id'), function (err, user) {
          if (err || !user) return res.negotiate(err)
          return res.ok()
        })
      } else return res.badRequest()
    })

  },

  /* *
   * Request an email to be sent for performing password reset
   *
   * (POST /user/resetpassreq/)
   */
  resetpassreq: function (req, res) {

    var email = req.param('email')
    var resetToken = require("randomstring").generate()

    User.update({email: email}, {
      reset_token: resetToken,
      reset_token_expires: moment().add(1, 'h').toString()
    }).exec(function (err, user) {

      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")

      var protocol = req.connection.encrypted ? "https://" : "http://"

      var path = '/user/reset/' + resetToken

      EmailService.sendResetPassEmail(email, protocol + req.headers.host + path)

      return res.ok({succ: true})

    })
  },

  resetpass: function (req, res) {

    User.findOne({where: {reset_token: req.param("reset_token")}, select:['id', 'reset_token_expires']}).exec(function (err, user) {
      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")

      if (moment() < moment(user.reset_token_expires)) {

        return res.ok({user_id: user.id})
      } else {
        return res.forbidden("Expired reset token")
      }

    })

  },

  // MobileVerification and NonUserMobileVerification services use noSQL database
  // for storing mobile verification codes temporarily until verified.
  // This done for mobile requests as sessions do not persist

  /* *
   * Construct and send random code to user mobile to verify
   *
   * (POST /user/sendMobileCode/)
   */
  sendMobileCode: function (req, res) {
    var phone = req.param("phone")
    var code = Math.floor((Math.random() * 999999) + 111111)
    /* code = "1234"req.session.tempMobile = {code: code, number:phone}res.json({ succ: true })*/
    EmailService.sendSMS(phone, "Your " + sails.config.appName + " verification code is: " + code,
      function (data) {
        console.log(data)
        if (data)
          return res.serverError('Sending SMS error')

        // As sessions do not work with mobile requests, we try to use database to store codes until it's verified
        // if(req.headers["mobile"]){
        //   if(req.user)
        //     MobileVerificationService.addCode(req.user.id, code, phone)
        //   else
        //     NonUserMobileVerificationService.addCode(code, phone)
        // } else
          req.session.tempMobile = {code: code, number: phone}

        res.ok({succ: data == null})
      })
  },

  /* *
   * Verify mobile code sent to user
   *
   * (POST /user/verifyMobileCode/)
   */
  verifyMobileCode: function (req, res) {
    var code = req.param('code')
    var phone = req.param('phone')

    if(req.session.tempMobile)
      return compareMobileCode(req, res, code, req.session.tempMobile.code, req.session.tempMobile.number)

    // As sessions do not work with mobile requests, we try to use database to store codes until it's verified
    // If user is verifying from signup form before being saved to database, req will not have user param

    // if(req.user) {
    //   MobileVerificationService.getUserCode(req.user.id, function (err, result) {
    //     if (err) {
    //       Reporting.logError(err, __filename, req.user)
    //       res.negotiate(err)
    //     } else {
    //       if (!result || result.Items.length === 0)
    //         return res.badRequest('Please request a code to verify')
    //
    //       if (moment().diff(moment(result.Items[0].TimeStamp), 'minutes') > 15) {
    //         return res.badRequest('Code expired, Please request another code to verify')
    //       }
    //
    //       compareMobileCode(req, res, code, result.Items[0].Code, result.Items[0].Phone)
    //     }
    //
    //   })
    // } else {
    //   NonUserMobileVerificationService.getCode(phone, function (err, result) {
    //     if (err) {
    //       Reporting.logError(err, __filename, req.user)
    //       res.negotiate(err)
    //     } else {
    //       if (!result || result.Items.length === 0)
    //         return res.badRequest('Please request a code to verify')
    //
    //       if (moment().diff(moment(result.Items[0].TimeStamp), 'minutes') > 15) {
    //         return res.badRequest('Code expired, Please request another code to verify')
    //       }
    //
    //       if(result.Items[0].Code == code) {
    //         NonUserMobileVerificationService.addVerifiedCode(code, phone, function (err, data) {
    //           if (err) {
    //             Reporting.logError(err, __filename, req.user)
    //             return res.negotiate(err)
    //           }
    //
    //           return res.json(200, 'Match Success')
    //         })
    //       } else {
    //         return res.badRequest("Mobile verification code entered does not match")
    //       }
    //     }
    //
    //   })
    // }

  },

  /* *
   * Upload avatar for currently logged-in user
   *
   * (POST /user/avatar)
   */
  uploadAvatar: function (req, res) {
    // console.log(req)
    req.file('avatar').upload({

      // Images should be uploaded to cloud storage to be secured from accidential deletion
      // Next code uses AWS S3

      // dirname: require('path').resolve(sails.config.appPath, '/images/avatars'),
      //  don't allow the total upload size to exceed ~2MB
      // adapter: require('skipper-better-s3'),
      // endpoint: sails.config.aws.s3endpoint,
      // key: sails.config.aws.accessKeyId,
      // secret: sails.config.aws.secretAccessKey,
      // bucket: '{{S3 BUCKET NAME}}',
      // region: sails.config.aws.region,  // Optional - default is 'us-standard'
    maxBytes: 2000000,
      // s3params:
      // {
      //   signatureVersion: 'v4',
      //   ACL: 'public-read'
      // }
    }, function whenDone (err, uploadedFiles) {
      if (err) {
        return res.negotiate(err)
      }

      //  If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0) {
        return res.badRequest('No file was uploaded')
      }

      var newAvatarUrl = require('util').format('%s/user/avatar/%s', sails.config.appUrl, req.user.id)
      //  Save the "fd" and the url where the avatar for a user can be accessed
      User.update({id: req.user.id}, {

          //  Generate a unique URL where the avatar can be downloaded.
          // avatarUrl: newAvatarUrl,

          //  Grab the first file and use it's `fd` (file descriptor)
          avatarFd: uploadedFiles[0].fd
        })
        .exec(function (err, users) {
          if (err) return res.negotiate(err)
          if(!users || users.length == 0) return res.notFound("User not Found")

          UserService.updateUserInfoCookie(res, users[0])
          // req.session.currUserPhoto = newAvatarUrl
          return res.ok(newAvatarUrl)
        })
    })
  },

  /* *
   * Download avatar of the user with the specified id
   *
   * (GET /user/avatar/:id)
   */
  avatar: function (req, res) {

    req.validate({
      id: 'string'
    })

    User.findOne({where: {id: req.param('id')}, select:['avatarFd']}).exec(function (err, user) {
      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")

      //  User has no avatar image uploaded.
      //  (should have never have hit this endpoint and used the default image)
      if (!user.avatarFd) {
        return res.notFound('No avatar image found')
      }

      var SkipperS3 = require('skipper-disk')
      var fileAdapter = SkipperS3({
        // endpoint: sails.config.aws.s3endpoint,
        // key: sails.config.aws.accessKeyId,
        // secret: sails.config.aws.secretAccessKey,
        // bucket: '{{S3 BUCKET NAME}}',
        // region: sails.config.aws.region,  // Optional - default is 'us-standard'
      })

      //  Stream the file down
      fileAdapter.read(user.avatarFd)
        .on('error', function (err) {
          return res.serverError(err)
        })
        .pipe(res)
    })
  },

  getCities: function (req, res) {
    if(!req.param('country'))
      return res.ok([])

    if(req.param('country') == 'EG')
      return res.ok(['Cairo', 'Alexandria'])

    var countryName = require("country-data").lookup.countries({alpha2: req.param('country')})[0]

    res.ok(require("countries-cities").getCities(countryName.name))
  },


  /** A user can buy a product by specifying the id of the product 
   * and its variation.If there is enough quantity from the criteria ,
   * the user will be able to buy it. The order will be created and the shop
   * will need to then specify the status of the order
   */  
   buyProduct:function(req, res, next){

    var user_id=req.user.id;
    var product_id=req.param('product')
    User.findOne({id:user_id}).populate('products_order').exec(function(err,user){
      if(err){
        Reporting.logError(err, __filename, req.user)
        return res.negotiate(err)
      }
      if(!user){
        return res.notFound('can not find user');
      }

      var userVariation={
        color:req.param('color'),
        size:req.param('size'),
        material:req.param('material')
      }

      Product.findOne({id:product_id}).populate('owner').exec(function(err,product){
        if(err){
          Reporting.logError(err, __filename, req.user)
          return res.negotiate(err)
        }
        if(!product)
          return res.notFound()
        var i=0;
        var isFound=0;
        var newQuantity;
        var result;
        var purchaseNo;
        var temp=product.product_variation;
        for(i=0;i<product.product_variation.length;i++){
          if(product.product_variation[i].color==userVariation.color &&
            product.product_variation[i].size==userVariation.size && 
            product.product_variation[i].material==userVariation.material){

            if(product.product_variation[i].quantity>0)
            {   
              if(product.discount){
                var discount= parseInt(product.discount)/100
                var price=product.product_variation[i].price
                result=price-(discount*price)
                
              }
              else
              {
                result=product.product_variation[i].price;
              }

              newQuantity=product.product_variation[i].quantity-1;
              temp[i].quantity=newQuantity;
              purchaseNo=product.purchaseNumber+1;

              isFound=1;
              break;
            }
            else
              return res.json('there is no quantity for the following criteria')
          }

        }


        if(isFound){
          Product.update({id:product.id},{product_variation:temp,purchaseNumber:purchaseNo}).exec(function(err,pro){
            if(err)
              return res.negotiate(err)
            
          })
          var order={
            owner:user.id,
            product:product.id,
            payment_method:req.param('payment_method')
          }
          Productorder.create(order).then(function(err,proOrder){
            product.owner.add(user_id)
            product.save(function(err) {
             if(err){
              Reporting.logError(err, __filename, req.user)
              return res.negotiate(err);
            }

            res.json(proOrder)
          })
          })

        }
        else
          return res.notFound('there is no product with these variation')

      })
    })
  },

 /** A user can see all his orders
   */ 
  userViewOrders:function(req,res,next){
    var user_id=req.user.id;
    User.findOne({id:user_id}).exec(function(err,user){
      if(err){
        Reporting.logError(err, __filename, req.user)
        return res.negotiate(err)
      }
      if(!user)
        return res.badRequest();
      Productorder.find({owner:user.id}).exec(function(err,orders){
        if(err){
        Reporting.logError(err, __filename, req.user)
        return res.negotiate(err)
      }
      if(orders.length==0)
        res.ok('there are no orders for you yet')
      res.ok(orders)

      })
    })
  },

  /** A user can rate any product. The rate which will appear on the product 
   *  will be the average ratings of all the customers who rated that product
   */  

   rateProduct:function(req, res, next){

     var rate = req.param('rate');
     var product_id=req.param('product')
     var user_id=req.user.id;
     var average;
     User.findOne({id:user_id}).populate('products_rate').exec(function(err,user){
      if(err){
        Reporting.logError(err, __filename, req.user)
        return res.serverError(err)
      }
      if(user){
       Product.findOne({id: req.param('product')}).populate('raters').exec(function(err,product){
        if(err){
          return res.serverError(err)
        }
        if(product){

          var rating={
            owner:user_id,
            product:product.id,
            rate:rate
          }
          Productrate.create(rating).exec(function(err,productRate){
            if(err){
              Reporting.logError(err, __filename, req.user)
              return res.negotiate(err)
            }
            product.raters.add(user.id)
            product.save(function(err){
              if(err){
                Reporting.logError(err, __filename, req.user)
                return res.negotiate(err)
              }
            })

          })

          var average;
          var sum=0;
          var i;
          var count;
          Productrate.find({id:product_id}).exec(function(err,allRatings){
            if (err){
              Reporting.logError(err, __filename, req.user)
              return res.negotiate(err)
            }
            count=allRatings.length+1;
            for (i=0;i<allRatings.length;i++){
              sum+=allRatings[i].rate;
            }
            sum=sum+parseInt(rate);

            average=sum/count
        // console.log(average+"avg")
        // console.log(sum+"sum")
        // console.log(count+"count")

        product.rate=average;


        product.save(function(err){
          if (err){
            Reporting.logError(err, __filename, req.user)
            return res.negotiate(err)
          }
        })
        res.json(product)

      })
        }

        if(!product){
          res.notFound('can not find product');
        }
      })
     }

     if(!user){
      res.ok('can not find user');
    }
  })

   },

  /** A user can subscribe to a shop  
    */ 
  subscribeToShop:function(req,res,next){
    var user_id=req.user.id;
    var requestedShop=req.param('shop')
    User.findOne({id:user_id}).populate('subscribed_shops').exec(function(err,user){
      if(err){
       Reporting.logError(err, __filename, req.user)
       return res.negotiate(err)
     }
     if(!user)
      return res.badRequest()
    Shop.findOne({id:requestedShop}).exec(function(err,shop){
      if(err){  
       Reporting.logError(err, __filename, req.user)
       return res.negotiate(err)
     }
     if(!shop)
      return res.notFound()
    user.subscribed_shops.add(shop.id)
    user.save(function(err){
      if(err){
       Reporting.logError(err, __filename, req.user)
       return res.negotiate(err)
     }
     res.ok('You have successfully subscribed this shop, products of this shop will appear at your homepage')
    })

  })
  })
  },

/** A user see the products of his subscribed shops 
 */ 
 productsOfSubscribedShops:function(req,res,next){
  var user_id=req.user.id;
  User.findOne({id:user_id}).populate('subscribed_shops').exec(function(err,user){
    if(err){
     Reporting.logError(err, __filename, req.user)
     return res.negotiate(err)
   }
   if(!user)
    return res.badRequest()
  var shops_id=[];
  var i;
  if(user.subscribed_shops.length>0){
    for(i=0;i<user.subscribed_shops.length;i++){
      shops_id.push(user.subscribed_shops[i].id);
    }
  }

  Product.find({shop:shops_id}).exec(function(err,products){
    if(err){  
     Reporting.logError(err, __filename, req.user)
     return res.negotiate(err)
   }
   if(!products)
    return res.notFound()
  res.ok(products)

})
})
},

/** A user can create a report for any product
 */

 createReportProduct: function(req, res, next){
   var user_id=req.user.id;
   var requestedProduct=req.param('product');
   var req_shop;
   User.findOne({id:user_id}).exec(function(err,user){
    if(err){
      Reporting.logError(err, __filename, req.user)
      return res.negotiate(err)
    }

    if(!user)
      return res.badRequest();

    Product.findOne({id:requestedProduct}).populate('shop').exec(function(err,product){
      if(err){
        Reporting.logError(err, __filename, req.user)
        return res.negotiate(err)
      }

      if(!product)
        return res.badRequest();
      var description=req.param('description');
      if(!description)
        return res.badRequest('please complete the missing field')
      var report={
        description:req.param('description'),
        product:requestedProduct
      }

      Report.create(report).exec(function(err,created_report){
        if(err){
          Reporting.logError(err, __filename, req.user)
          return res.negotiate(err)
        }
        user.reports.add(created_report.id)
        user.save(function(err){
          if(err){
            Reporting.logError(err, __filename, req.user)
            return res.negotiate(err)
          }
        })

        res.ok(created_report)

      })
    })
  })


 },
   /** A user can create a report for any product
 */

 createReportShop: function(req, res, next){
   var user_id=req.user.id;
   var requestedShop=req.param('shop');
   User.findOne({id:user_id}).exec(function(err,user){
    if(err){
      Reporting.logError(err, __filename, req.user)
      return res.negotiate(err)
    }

    if(!user)
      return res.badRequest();

    Shop.findOne({id:requestedShop}).exec(function(err,shop){
      if(err){
        Reporting.logError(err, __filename, req.user)
        return res.negotiate(err)
      }

      if(!shop)
        return res.badRequest();
      var description=req.param('description');
      if(!description)
        return res.badRequest('please complete the missing field')
      var report={
        description:req.param('description'),
        shop:requestedShop
      }

      Report.create(report).exec(function(err,created_report){
        if(err){
          Reporting.logError(err, __filename, req.user)
          return res.negotiate(err)
        }
        user.reports.add(created_report.id)
        user.save(function(err){
          if(err){
            Reporting.logError(err, __filename, req.user)
            return res.negotiate(err)
          }
        })

        res.ok(created_report)

      })
    })
  })
   

 },   
 /** A user can create a review for any product   
  */
    createReview: function(req, res, next){
   var user_id=req.user.id;
   var requestedProduct=req.param('product');
   var req_shop;
   User.findOne({id:user_id}).exec(function(err,user){
    if(err){
      Reporting.logError(err, __filename, req.user)
      return res.negotiate(err)
    }

    if(!user)
      return res.badRequest();

    Product.findOne({id:requestedProduct}).populate('shop').exec(function(err,product){
      if(err){
        Reporting.logError(err, __filename, req.user)
        return res.negotiate(err)
      }

      if(!product)
        return res.badRequest();
      var description=req.param('description');
      if(!description)
        return res.badRequest('please complete the missing field')
      var review={
        description:req.param('description'),
        product:requestedProduct
      }

      Review.create(review).exec(function(err,created_review){
        if(err){
          Reporting.logError(err, __filename, req.user)
          return res.negotiate(err)
        }
        user.reviews.add(created_review.id)
        user.save(function(err){
          if(err){
            Reporting.logError(err, __filename, req.user)
            return res.negotiate(err)
          }
        })

        res.ok(created_review)

      })
    })
  })

 },

 /** A user can delete a report   
  */
 deleteReport:function(req,res,next){
  var user_id=req.user.id;
  var requestedReport=req.param('report')
  User.findOne({id:user_id}).populate('reports').exec(function(err,user){
    if(err){
      Reporting.logError(err, __filename, req.user)
      return res.negotiate(err)
    }
    if(!user)
      return res.badRequest()
    if(HelperService.containsObject(requestedReport,user.reports)){
      Report.destroy({id:requestedReport}).exec(function(err){
        if(err){
      Reporting.logError(err, __filename, req.user)
      return res.negotiate(err)
    }
    res.ok('You have successfully deleted the report')
      })
    }
    else
      return res.notFound('the report is not in your report list')

  })
 },

 /** A user can delete a review  
  */
 deleteReview:function(req,res,next){
  var user_id=req.user.id;
  var requestedReview=req.param('review')
  User.findOne({id:user_id}).populate('reviews').exec(function(err,user){
    if(err){
      Reporting.logError(err, __filename, req.user)
      return res.negotiate(err)
    }
    if(!user)
      return res.badRequest()
    if(HelperService.containsObject(requestedReview,user.reviews)){
      Review.destroy({id:requestedReview}).exec(function(err){
        if(err){
      Reporting.logError(err, __filename, req.user)
      return res.negotiate(err)
    }
    res.ok('You have successfully deleted the review')
      })
    }
    else
      return res.notFound('the review is not in your review list')

  })
 },

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *  GINA'S PART
   */   

   /** A user can create an event 
    */
   createEvent: function(req, res, next){
    var user_id=req.user.id;
      User.findOne({id:user_id}).populate('events').exec(function(err,user){
        if(err){
           Reporting.logError(err, __filename, req.user)
          return res.negotiate(err)
        }
         
        
         Event.create(req.params.all())
          .then(function(event){
           user.events.add(event.id)
           user.save(function(err) {
               if(err)
               return res.negotiate(err);
      })
           res.json("successfully created the event")
        }).catch(function(err){
          return next(err);
        })


      })

      },
/** A shopOwner can view reviews about his products
  */
      viewReviews_asShopOwner:function(req, res, next){

    var user_id=req.user.id;

      User.findOne({id:user_id}).populate('shop').exec(function(err,user){
        if(err){
            Reporting.logError(err, __filename, req.user)
          return res.negotiate(err)
        }
         
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

          var i =0
          for(i=0;i<shop.products.length;i++){
         
          Product.findOne({id: shop.products[i].id}).exec(function(err,product){
          if(err)
            return res.negotiate(err)
          if(!product)
            return res.ok("no product")
          if(product){
            if(product.reviews.length==0)
              res.ok('no reviews found')

            else {res.ok(product.reviews)}
          }
          
          

        })
}
        })

        }
    
        if(!user){
          res.ok('can not find user');
        }


      })

      },
/** A user can add a product to his favourite list   
  */
      addProducttoFavList:function(req, res, next){

    var user_id=req.user.id;
    var product_id=req.param('product_id');
    
      User.findOne({id:user_id}).exec(function(err,user){
        if(err){
            Reporting.logError(err, __filename, req.user)
          return res.negotiate(err)
        }
          
        if(user){
         
                Product.findOne({id:product_id}).exec(function(err,product){
      if(err){
        Reporting.logError(err, __filename, req.user)
          return res.negotiate(err)
    }
    if(product){
     
       var fav_list = user.fav_list ? user.fav_list : [];
      
      fav_list.push(product)
     
    
     User.update({id:req.param('user_id')}, {fav_list: fav_list})
            .exec(function(err, updatedUser) {
                return res.ok('product added in your wish list');
            });
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



}

