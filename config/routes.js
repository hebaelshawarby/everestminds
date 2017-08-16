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
  'GET /productsWithinCategory':'VisitorController.productsWithinCategory',
  'GET /purchaseNumber':'VisitorController.viewNumberofProduct_Purchase_asVisitor',
  'GET /bestSeller':'VisitorController.bestSeller',
  'GET /bestRatings':'VisitorController.bestRatings',
  'GET /viewEvent':'EventController.viewEvent',
  'GET /viewEvents':'EventController.viewEvents',
  'GET /viewLatestEvents':'EventController.viewLatestEvents',



  'POST /product/shopAddProductVariation':'ProductController.shopAddProductVariation',
  'POST /product/shopUpdateProductVariation':'ProductController.shopUpdateProductVariation',
  'POST /product/deleteProduct':'ProductController.deleteProduct',
  'POST /product/shopDeleteProductVariation':'ProductController.shopDeleteProductVariation',
  'POST /product/featureProduct':'ProductController.featureProduct',
  'POST /product/addProductKeywords':'ProductController.addProductKeywords',
  'POST /product/addProductDiscount':'ProductController.addProductDiscount',
  'POST /product/viewProductDiscount':'ProductController.viewProductDiscount',


 
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
  "POST /user/logout/":"UserController.logout",
  "POST /user/buyProduct":"UserController.buyProduct",
  "GET /user/userViewOrders":"UserController.userViewOrders",
  "POST /user/rateProduct":"UserController.rateProduct",
  "POST /user/subscribeToShop":"UserController.subscribeToShop",
  "GET /user/productsOfSubscribedShops":"UserController.productsOfSubscribedShops",
  "POST /user/createReportProduct":"UserController.createReportProduct",
  "POST /user/createReportShop":"UserController.createReportShop",
  "POST /user/createReview":"UserController.createReview",
  "DELETE /user/deleteReport":"UserController.deleteReport",
  "DELETE /user/deleteReview":"UserController.deleteReview",
  "POST /user/createEvent":"UserController.createEvent",
  "GET /user/viewReviews_asShopOwner":"UserController.viewReviews_asShopOwner",
  "POST /user/addProducttoFavList":"UserController.addProducttoFavList",

  "POST /file/addProductImage":"FileController.addProductImage",
  "DELETE /file/removeProductImage":"FileController.removeProductImage",
  "POST /file/addEventImage":"FileController.addEventImage",
  "DELETE/file/removeEventImage":"FileController.removeEventImage",
  "POST /file/addShopImage":"FileController.addShopImage",
  "POST /file/removeShopImage":"FileController.removeShopImage",
  "POST /file/addUserImage":"FileController.addUserImage",
  "POST /file/removeUserImage":"FileController.removeUserImage",
 
  "POST /shop/createShop":"ShopController.createShop",
  "PUT /shop/updateShop":"ShopController.updateShop", 
  "DELETE /shop/deleteShop":"ShopController.deleteShop",
  "POST /shop/createAndUpdatePolicy":"ShopController.createAndUpdatePolicy",
  "POST /shop/deletePolicy":"ShopController.deletePolicy",
  "POST /shop/shopCreateProduct":"ShopController.shopCreateProduct",
  "POST /shop/shopSpecifyOrderStatus":"ShopController.shopSpecifyOrderStatus",
  "GET /shop/shopViewOrders":"ShopController.shopViewOrders",
  "GET /shop/viewProducts_asShopOwner":"ShopController.viewProducts_asShopOwner",
  "GET /shop/viewSoldProducts_asShopOwner":"ShopController.viewSoldProducts_asShopOwner",
  "POST /shop/chooseRenewelOptions_asShopOwner":"ShopController.chooseRenewelOptions_asShopOwner",
  "POST /shop/chooseDateandTime_asCustomer":"ShopController.chooseDateandTime_asCustomer",
  "GET /shop/viewReports_asCustomer":"ShopController.viewReports_asCustomer", 
  

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
