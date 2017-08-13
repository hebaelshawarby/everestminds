// /**
//  * Created by ahmedhany on 5/18/16.
//  * Intercom Integration
//  */
// var Intercom = require('intercom.io');
// var moment = require('moment')
//
// module.exports = {
//
//   track: function (desc, type, category, user_email, user_id, platform, extra, callback) {
//
//     // var client = new Intercom.Client(sails.config.intercom.app_id, sails.config.intercom.api_key);
//
//     var options = {
//       apiKey: sails.config.intercom.api_key,
//       appId: sails.config.intercom.app_id
//     };
//
//     var intercom = new Intercom(options);
//
//     // To create a user
// // Every method supports promises or callbacks.
//     intercom.createEvent({
//       'event_name': desc,
//       'created_at': moment().unix(),
//       'user_id': user_id,
//       'email': user_email,
//       'metadata': {
//         'type': type,
//         'category': category,
//         'platform': platform,
//         'extra': extra
//       }
//     }, function(err, res) {
//       if(err){
//         Reporting.logError(err, __filename, {id: user_id, email: user_email})
//       } else {
//
//       }
//     });
//
//   },
//
//   trackF: function (desc, type, category, user_email, user_id, platform, extra, date, callback) {
//
//     // var client = new Intercom.Client(sails.config.intercom.app_id, sails.config.intercom.api_key);
//
//     var options = {
//       apiKey: sails.config.intercom.api_key,
//       appId: sails.config.intercom.app_id
//     };
//
//     var intercom = new Intercom(options);
//
//     // To create a user
// // Every method supports promises or callbacks.
//     intercom.createEvent({
//       'event_name': desc,
//       'created_at': date,
//       'user_id': user_id,
//       'email': user_email,
//       'metadata': {
//         'type': type,
//         'category': category,
//         'platform': platform,
//         'extra': extra
//       }
//     }, function(err, res) {
//       if(err){
//         Reporting.logError(err, __filename, {id: user_id, email: user_email})
//       } else {
//
//       }
//
//     });
//
//   },
//
//   getUsers: function () {
//
//     var options = {
//       apiKey: sails.config.intercom.api_key,
//       appId: sails.config.intercom.app_id
//     };
//
//     var intercom = new Intercom(options);
//     // To get multiple users
//     intercom.getUsers({
//       page: 2,
//       per_page: 45,
//       // tag_id: 7002,
//       segment_id: "573b23ea2689c2c44400001e"
//     }, function (err, res) {
//       if(err){
//         Reporting.logError(err, __filename, null)
//       } else {
//         console.log(res)
//
//       }
//
//     });
//   },
//
//   identify: function (user_email, user_id, properties, callback) {
//
//     var client = new Intercom.Client(sails.config.intercom.app_id, sails.config.intercom.api_key);
//
//     // Create/update a user
//     client.users.create({ email: user_email, user_id: user_id, custom_attributes: properties }, function (r) {
//       // console.log(r);
//       callback(r)
//     });
//
//   }
//
// };
