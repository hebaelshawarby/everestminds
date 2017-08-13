var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt-nodejs')
var FacebookStrategy = require('passport-facebook').Strategy
// var TwitterStrategy = require('passport-twitter').Strategy
// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
// var FacebookTokenStrategy = require('passport-facebook-token'); // USE FOR MOBILE APP
// var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// helper functions
function findById (id, fn) {
  // console.log(id)
  User.findOne({id: id}).exec(function (err, user) {
    if (err) {
      return fn(err, null)
    } else {
      return fn(null, user)
    }
  })
}

function findByEmail (u, fn) {
  User.findOne({
    email: u
  }, function (err, user) {
    //  Error handling
    if (err) {
      return fn(null, null)
      //  The User was found successfully!
    } else {
      return fn(null, user)
    }
  })
}

module.exports = {
  passportResponse: function (req, accessToken, refreshToken, profile, done)
  {
    console.log(profile)
    var attrsToUpdate;
    var attrsToUpdateUnverified;

    switch (profile.provider) {
      case 'facebook':
        attrsToUpdate = {fb: profile.id, email_verified: true, fb_access_token: accessToken}
        attrsToUpdateUnverified = {fb: profile.id, fb_access_token: accessToken}
        break;
      case 'google':
        attrsToUpdate = {google_id: profile.id, email_verified: true}
        attrsToUpdateUnverified = {google_id: profile.id}
        break;
      case 'linkedin':
        attrsToUpdate = {linkedin_id: profile.id, email_verified: true}
        attrsToUpdateUnverified = {linkedin_id: profile.id}
        break;
    }

    if (!req.user) {
      User.update({email: profile.emails[0].value}, attrsToUpdate)
        .exec(function (err, updated) {
          if (err)
            return done(err, null)

          if (updated.length > 0) {
            // User Login
            Analytics.track('server:user logged in with ' + profile.provider, 'action', 'user', updated[0].email, updated[0].id, 'server', null, function (result) {})
            return done(null, {user: updated[0], accessToken: accessToken})
            // req.session.fbaccesstoken = accessToken
            // authenticateLogin(updated[0], req, res)

          } else {
            User.update({fb: profile.id}, attrsToUpdateUnverified)
              .exec(function (err, updated) {
                if (err)
                  return done(err, null)

                if (updated.length > 0) {
                  // User Login
                  Analytics.track('server:user logged in with ' + profile.provider, 'action', 'user', updated[0].email, updated[0].id, 'server', null, function (result) {})
                  return done(null, {user: updated[0], accessToken: accessToken})
                  // req.session.fbaccesstoken = accessToken
                  // authenticateLogin(updated[0], req, res)

                } else {
                  profile.signupAccessToken = accessToken;
                  return done(null, profile)
                }

              })
          }

        })

    } else {
      UserService.getCurrUserInfo(req, function (err, user) {
        User.update({id: req.user.id}, user.email == profile.emails[0].value ? attrsToUpdate : attrsToUpdateUnverified)
          .exec(function (err, updated) {
            if (err)
              return done(err, null)

            if (updated.length > 0) {
              // User Login
              Analytics.track('server:user added ' + profile.provider, 'action', 'user', user.email, user.id, 'server', null, function (result) {})
              return done(null, {user: updated[0], accessToken: accessToken})
              // req.session.fbaccesstoken = accessToken
              // authenticateLogin(updated[0], req, res)

            } else {
              profile.signupAccessToken = accessToken;
              return done(null, profile)
            }

          })
      })

    }
  }
}
//  Passport session setup.
//  To support persistent login sessions, Passport needs to be able to
//  serialize users into and deserialize users out of the session. Typically,
//  this will be as simple as storing the user ID when serializing, and finding
//  the user by ID when deserializing.
passport.serializeUser(function (data, done) {
  done(null, data.user.id)
})

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user)
  })
})

//  Use the LocalStrategy within Passport.
//  Strategies in passport require a `verify` function, which accept
//  credentials (in this case, a username and password), and invoke a callback
//  with a user object.
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    //  asynchronous verification, for effect...
    process.nextTick(function () {
      //  Find the user by username. If there is no user with the given
      //  username, or the password is not correct, set the user to `false` to
      //  indicate failure and set a flash message. Otherwise, return the
      //  authenticated `user`.
      findByEmail(email, function (err, user) {
        if (err) {
          console.log("Could not find user")
          return done(err, null, null)
        }

        if (!user) {
          return done(null, false, {
            message: 'Unknown user ' + email
          })
        }
        bcrypt.compare(password, user.password, function (err, res) {
          if (!res) {
            console.log("Could not match password")
            return done(null, false, {
              message: 'Invalid Password'
            })
          }

          var returnUser = user
          return done(null, returnUser, {
            message: 'Logged In Successfully'
          })
        })
      })
    })
  }
))

if(sails.config.facebookAuth.clientID) {
  passport.use(new FacebookStrategy({
      clientID: sails.config.facebookAuth.clientID,
      clientSecret: sails.config.facebookAuth.clientSecret,
      callbackURL: sails.config.facebookAuth.callbackURL,
      profileFields: ['id', 'email', 'name', 'verified', 'birthday', 'location'],
      enableProof: true,
      passReqToCallback: true //  allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, module.exports.passportResponse
  ))
}
// passport.use(new FacebookTokenStrategy({
//     clientID: sails.config.facebookAuth.clientID,
//     clientSecret: sails.config.facebookAuth.clientSecret,
//     callbackURL: sails.config.facebookAuth.callbackURL,
//     profileFields: ['id', 'email', 'name', 'verified', 'birthday', 'location'],
//     // enableProof: true,
//     passReqToCallback: true //  allows us to pass in the req from our route (lets us check if a user is logged in or not)
//   }, module.exports.passportResponse
// ));

// passport.use(new TwitterStrategy({
//     consumerKey: sails.config.twitterAuth.consumerKey,
//     consumerSecret: sails.config.twitterAuth.consumerSecret,
//     callbackURL: sails.config.twitterAuth.callbackURL,
//     passReqToCallback: true //  allows us to pass in the req from our route (lets us check if a user is logged in or not)
//   },
//   function (req, token, tokenSecret, profile, done) {
//     // console.log(profile)
//     if (!req.user) {
//       User.findOne({twitter_id: profile.id}, function (err, user) {
//         if (err)
//           return done(err, null)
//
//         if (user) {
//           Analytics.track('server:user logged in with twitter', 'action', 'user', user.email, user.id, 'server', null, function (result) {})
//           return done(null, {user: user, accessToken: token})
//
//         } else {
//           return done(null, profile)
//         }
//
//       })
//     } else {
//       User.update({id: req.user.id}, {twitter_id: profile.id})
//         .exec(function (err, updated) {
//           if (err)
//             return done(err, null)
//
//           if (updated.length > 0) {
//             Analytics.track('server:user added twitter', 'action', 'user', updated[0].email, updated[0].id, 'server', null, function (result) {})
//             return done(null, {user: updated[0], accessToken: token})
//             // req.session.fbaccesstoken = accessToken
//             // authenticateLogin(updated[0], req, res)
//
//           } else {
//             return done(null, profile)
//           }
//
//         })
//     }
//
//   }
// ))
//
// passport.use(new GoogleStrategy({
//     clientID: sails.config.googleAuth.clientID,
//     clientSecret: sails.config.googleAuth.clientSecret,
//     callbackURL: sails.config.googleAuth.callbackURL,
//     enableProof: true,
//     passReqToCallback: true //  allows us to pass in the req from our route (lets us check if a user is logged in or not)
//   }, module.exports.passportResponse
// ))

// passport.use(new LinkedInStrategy({
//     clientID: sails.config.linkedinAuth.clientID,
//     clientSecret: sails.config.linkedinAuth.clientSecret,
//     callbackURL: sails.config.linkedinAuth.callbackURL,
//     scope: ['r_emailaddress', 'r_basicprofile'],
//     passReqToCallback: true,
//     state: true
//   }, module.exports.passportResponse
// ));
