/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  'POST /signup':'AuthController.signup',
  'POST /search':'VisitorController.Search',
  'POST /filter':'VisitorController.filter',
  'POST /productsWithinCategory':'VisitorController.productsWithinCategory',
  'POST /purchaseNumber':'VisitorController.viewNumberofProduct_Purchase_asVisitor',

  'POST /shopAddProductVariation':'ProductController.shopAddProductVariation',
  'POST /shopUpdateProductVariation':'ProductController.shopUpdateProductVariation',
  'POST /deleteProduct':'ProductController.deleteProduct',
  'POST /shopDeleteProductVariation':'ProductController.shopDeleteProductVariation',
  'POST /featureProduct':'ProductController.featureProduct',
  'POST /addProductKeywords':'ProductController.addProductKeywords',
  'POST /addProductDiscount':'ProductController.addProductDiscount',
  'POST /viewProductDiscount':'ProductController.viewProductDiscount',


 
  '/': {
    view: 'homepage'
  },
      'GET /show' : {view: 'image'},
  // 'GET /login':
  // {
  //   controller : "Auth",
  //   action : 'loginView'
  // },
  'POST /login':'AuthController.process',
  'GET /verifymobile':
  {
    view : 'user/verifymobile-afterlogin'
  },
  "/user/logout/":"UserController.logout",
  "/user/buyProduct":"UserController.buyProduct",
  "/user/userViewOrders":"UserController.userViewOrders",
  "/user/rateProduct":"UserController.rateProduct",
  "/user/subscribeToShop":"UserController.subscribeToShop",
  "/user/productsOfSubscribedShops":"UserController.productsOfSubscribedShops",
  "/user/createReportProduct":"UserController.createReportProduct",
  "/user/createReportShop":"UserController.createReportShop",
  "/user/createReview":"UserController.createReview",
  "/user/deleteReport":"UserController.deleteReport",
  "/user/deleteReview":"UserController.deleteReview",
  "/user/createEvent":"UserController.createEvent",
  "/user/viewReviews_asShopOwner":"UserController.viewReviews_asShopOwner",
  "/user/addProducttoFavList":"UserController.addProducttoFavList",

  "/file/addProductImage":"UserController.addProductImage",
  "/file/removeProductImage":"UserController.removeProductImage",
  "/file/addEventImage":"UserController.addEventImage",
  "/file/removeEventImage":"UserController.removeEventImage",
  "/file/addShopImage":"UserController.addShopImage",
  "/file/removeShopImage":"UserController.removeShopImage",
  "/file/addUserImage":"UserController.removeShopImage",
  "/file/removeUserImage":"UserController.removeShopImage",
 
  "/shop/createShop":"UserController.logout",
  "/shop/updateShop":"UserController.updateShop", 
  "/shop/deleteShop":"UserController.deleteShop",
  "/shop/createAndUpdatePolicy":"UserController.createAndUpdatePolicy",
  "/shop/deletePolicy":"UserController.deletePolicy",
  "/shop/shopCreateProduct":"UserController.shopCreateProduct",
  "/shop/shopSpecifyOrderStatus":"UserController.shopSpecifyOrderStatus",
  "/shop/shopViewOrders":"UserController.shopViewOrders",
  "/shop/viewProducts_asShopOwner":"UserController.viewProducts_asShopOwner",
  "/shop/viewSoldProducts_asShopOwner":"UserController.viewSoldProducts_asShopOwner",
  "/shop/chooseRenewelOptions_asShopOwner":"UserController.chooseRenewelOptions_asShopOwner",
  "/shop/chooseDateandTime_asCustomer":"UserController.chooseDateandTime_asCustomer",
  "/shop/viewReports_asCustomer":"UserController.viewReports_asCustomer", 
  

  "/user/updateProfileinfo/:userid":"UserController.updateProfileinfo",
  "/user/updatePassword/:userid":"UserController.updatePassword",
  "/user/verify/:verification_text":"AuthController.verifyEmail",
  //'GET /signup': "AuthController.signupView",
  '/auth/facebook/:invitationcode': "AuthController.facebook",
  '/auth/twitter/:invitationcode': "AuthController.twitter",
  'POST /user/avatar': "UserController.uploadAvatar",
  'GET /user/avatar/:id': "UserController.avatar",

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
