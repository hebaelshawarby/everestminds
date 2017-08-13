/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var lookup = require("country-data").lookup;
var bcrypt = require("bcrypt-nodejs");
var uuid = require('node-uuid');

module.exports = {

  attributes: {
    uuid: {type: "string", unique: true},
    last_name: "string",
    first_name: "string",
    fb: {type: "string", unique: true},
    fb_access_token: "string",
    // google_id: {type: "string", unique: true},
    // linkedin_id: {type: "string", unique: true},
    email: {type: "email", unique: true},
    phone: {type: "string", unique: true},
    avatarFd: "string",
    invited_by: {
      model: "User"
    },
    residency_country: "string",
    nationality: "string",
    city: 'string',
    area: 'string',
    address:'text',
    currency: "string",
    birthdate: "datetime",
    invitation_code: {
      type: "string"
    },
    last_logged_in: "datetime",
    password: {
      type: 'string',
      required: true,
      minLength: 6
    },
    verification_text: "string",
    email_verified: {
      type: "boolean",
      defaultsTo: false
    },
    reset_token: "string",
    reset_token_expires: "datetime",

    // Security
    register_ip: "string",
    address: "text",
     products_rate: {
      collection: 'product',
      via: 'raters'
    },
    products_order: {
       collection: 'product',
      via: 'owner'
    },
    subscribed_shops: {
      collection: 'shop',
      via: 'subscribed_users',
      dominant: true
    },
     events: {
      collection: 'event',
      via: 'owner'
    },
     reviews: {
      collection: 'review',
      via: 'owner'
    },
     reports: {
      collection: 'report',
      via: 'owner'
    },
     videos: {
      collection: 'media',
      via: 'owner'
    },
     shop: {
      collection:'shop',
      via: 'owner'
    },


      facebook_pic: function () {
        return 'https://graph.facebook.com/' + this.fb + '/picture?type=large';
      },
      // Functions
      name: function () {
        return this.first_name + " " + this.last_name;
      },

      avatar_url: function () {
        return require('util').format('%s/user/avatar/%s', sails.config.appUrl, this.id);
      },
      profile_pic: function () {
        if (this.avatarFd) {
          return this.avatar_url();
        } else if (this.fb) {
          return this.facebook_pic();
        } else {
          var gravatar = require('gravatar');
          var secureUrl = gravatar.url(this.email, {s: '100', r: 'x', d: 'retro'}, true);

          return secureUrl;
        }
      },
      profile_url: function () {
        return "/user/profile/" + this.uuid;
      },

      // Utils
      toJSON: function () {
        var obj = this.toObject();
        //delete obj.password;
        if (typeof (this.name) === "function") {
          obj.name = this.name();
          obj.profile_pic = this.profile_pic();
          obj.profile_url = this.profile_url();

          //Hide info
          obj.password = obj.password ? true : false
          obj.register_ip = null;
          delete obj.fb_access_token
          delete obj.verification_text
        }

        return obj;
      },
      isAdmin: function () {
        console.log(this.fb);
        return this.fb == 568017393 || this.fb == 505083270 || this.fb == 516590111 || this.fb == 10156019321705112 || this.fb == 10156189674150112;
      },

    },
    beforeCreate: function (user, next) {
      // console.log("Creating User");
      // Generate a v1 (time-based) id
      user.uuid = uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'

      if (user.facebooklocation) {
        try {
          // console.log(user.facebooklocation);
          user.nationality = lookup.countries({name: user.facebooklocation.name.split(",")[1].trim()})[0].alpha2;
          user.residency_country = user.nationality;
          //  console.log(user);
        }
        catch (e) {
          console.log("didnt find user location setting to default" + e);
          user.nationality = "EG";
          user.residency_country = "EG";
        }

      }
      else {
        if(!user.nationality)
          user.nationality = "EG";

        if(!user.residency_country)
          user.residency_country = "EG";
      }

      if (user.password) {
        console.log("Hashing password");
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
              console.log("Error setting password" + err);
              next(err);
            } else {
              user.password = hash;
              console.log(user);
              next();
            }
          });
        });
      } else next();

    },
    afterCreate: function (user, next) {
      //Money.registerUser(user,function(succ){
      //  console.log("New user created Mangopay:"+succ);
      //});
      if (user.email_verified)
      EmailService.sendRegistrationEmail(user);
    next();
  }


};
