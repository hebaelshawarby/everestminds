/* *
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var jwt = require('jsonwebtoken')
var https = require('https')
var passport = require('passport')
var validator = require('validator')
/* *
 * Create a token based on the passed user
 * @param user
 */
function createToken (user) {
  return jwt.sign({
      user: user
    },
    sails.config.jwtSettings.secret,
    {
      algorithm: sails.config.jwtSettings.algorithm,
      expiresIn: sails.config.jwtSettings.expiresIn,
      issuer: sails.config.jwtSettings.issuer,
      audience: sails.config.jwtSettings.audience
    }
  )
}

function authenticateLogin (user, req, res, newWindow, verify) {
  console.log('auth login')
  if (!user)
    res.json(500, {error: "User not created", loggedIn: false})
  else {
    /*  Hide info
     user.bank_id = null
     user.card_id = null
     user.register_ip = null*/

    // req.session.user = user
    //  Admin Type
    // req.session.sd_admin = user.isAdmin()

    // req.session.authenticated = true

    // req.session.currUserPhoto = user.profile_pic()
    // console.log(req.session.currUserPhoto)

    // req.session.fbaccesstoken = user.fb_access_token

    var url
    if(!UserService.reqFromMobile(req)){
      if (req.session.redirect) {
        url = req.session.redirect
        req.session.redirect = undefined
      } else url = '/'
    }

    var token = createToken({id: user.id})

    if (!UserService.reqFromMobile(req))
      res.cookie('e_m_t', token, {
        secure: req.connection.encrypted,
        httpOnly: true
      })

    UserService.updateUserInfoCookie(res, user)

    if (verify)
      return res.redirect('/')
    else if (newWindow && !UserService.reqFromMobile(req))
      res.render('after-auth', {data: {loggedIn: true, id: user.id, fb_id: user.fb, redirect: url, user: user}})
    else res.ok({
        loggedIn: true,
        id: user.id,
        fb_id: user.fb,
        redirect: url,
        user: user,
        token: UserService.reqFromMobile(req) ? token : token
      })

    // return res.json({loggedIn:true,id:user.id, fb_id : user.fb , redirect :  "/" , user:user })

  }
}

function checkReferral (req, user, callback) {
  if (req.signedCookies.m_referred_by) {
    User.findOne({where: {invitation_code: req.signedCookies.m_referred_by}, select:['id']}).exec(function (err, inviting_user) {
      if(err)
        Reporting.logError(err, __filename, user)

      if(!inviting_user)
        return callback(user)

      if(!err) {
        user.invited_by = inviting_user.id
      }

      callback(user)
    })
  } else callback(user)
}

function register (req, res, user) {
  // console.log(profile)

  var user_to_create = user
  var ip = req.connection.remoteAddress

  try {
    ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress

  }
  catch (e) {
  }

  if (ip === undefined)
    ip = "192.168.1.0"

  user_to_create.register_ip = ip
  // user_to_create.email_verified = profile._json.verified
  //  console.log("registrar on the way")
  checkReferral(req, user_to_create, function (newUser) {

    User.create(newUser).exec(function cru (err, user) {

      if (err) {
        Reporting.logError(err, __filename, req.user)
        return res.negotiate(err)
      }

      else {
        // User Registration
        var socialPlatform = user.fb? 'facebook' : user.linkedin_id ? 'linkedin' : user.twitter_id ? 'twitter' : 'google'
        Analytics.track('server:user registered with ' + socialPlatform, 'action', 'user', user.email, user.id, 'server', null, function (result) {})

        if(newUser.invited_by)
          Analytics.track('server:user joined invitation', 'action', 'user', newUser.email, newUser.id, 'server', null, function (result) {})

        authenticateLogin(user, req, res, true, false)

      }
    })
  })

}



function registerFromForm (req, res, user) {

  checkReferral(req, user, function (user_to_create) {
    User.create(user_to_create, function userCreated (err, newUser) {
      if (err) {

        Reporting.logError(err, __filename, user)
        // console.log("err.invalidAttributes: ", err.invalidAttributes)

        //  If this is a uniqueness error about the email attribute,
        //  send back an easily parseable status code.
        if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
          && err.invalidAttributes.email[0].rule === 'unique') {
          return res.json(409, {error: 'Email address in use'})
        }

        //  Otherwise, send back something reasonable as our error response.

        return res.negotiate(err)
      }

      Analytics.track('server:user registered with normal', 'action', 'user', newUser.email, newUser.id, 'server', null, function (result) {})

      if(newUser.invited_by)
        Analytics.track('server:user joined invitation', 'action', 'user', newUser.email, newUser.id, 'server', null, function (result) {})

      EmailService.sendVerificationEmail(newUser.email, UtilityService.constructEmailVerificationLink(newUser), sails.config.appName)

        //  Log user in
      return authenticateLogin(newUser, req, res, false, false)


    })
  })

}

function sendVerificationEmail (req, res, user) {
  //var protocol = req.connection.encrypted ? "https:// " : "http://"
  if (!user)
    User.findOne({id: req.user.id}, function (err, user) {
      if (err) return res.negotiate(err)
      if (!user) return res.notFound("User not found")
      EmailService.sendVerificationEmail(user.email, UtilityService.constructEmailVerificationLink(user), sails.config.appName)
      res.ok({msg: 'Verification email has been sent to your inbox'})
    })
  else{
    EmailService.sendVerificationEmail(user.email, UtilityService.constructEmailVerificationLink(user), sails.config.appName)
    res.ok({msg: 'Verification email has been sent to your inbox'})
  }

}

function passportResponse (req, res, err, info) {
  if (err) return res.negotiate(err)

  if (info.accessToken) {
    return authenticateLogin(info.user, req, res, true, false)
  } else {
    var user;
    switch(info.provider) {
      case 'facebook':
        user = {
          first_name: info.name.givenName,
          last_name: info.name.familyName,
          fb: info.id,
          email: info.emails[0].value,
          birthdate: info._json ? info._json.birthday : '',
          facebooklocation: info._json ? info._json.location : '',
          email_verified: true,
          fb_access_token: info.signupAccessToken
        }
        break;
      case 'linkedin':
        user = {
          first_name: info.name.givenName,
          last_name: info.name.familyName,
          linkedin_id: info.id,
          email: info.emails[0].value,
          email_verified: true
        }
        break;
      case 'google':
        user = {
          first_name: info.name.givenName,
          last_name: info.name.familyName,
          google_id: info.id,
          email: info.emails[0].value,
          email_verified: true
        }
        break;
      case 'twitter':
        user = {
          first_name: info.displayName,
          twitter_id: info.id,
          email_verified: false
        }
        break;
    }
    if(!req.session.redirect)
      req.session.redirect = '/verifymobile'

    register(req, res, user)
  }
}

module.exports = {

  process: function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) return res.negotiate(err)
      if (!user) {
        console.log("Could not authenticate")
        console.log(info)
        return res.forbidden({error: "Unauthorized User"})
      }

      // User Login
      Analytics.track('server:user logged in with normal', 'action', 'user', user.email, user.id, 'server', null, function (result) {})

      return authenticateLogin(user, req, res, false, false)
    })(req, res, next)
  },
  facebook: function (req, res, next) {
    console.log("Facebook login triggered")
    if(UserService.reqFromMobile(req)) {
      passport.authenticate('facebook-token', {scope: ['email', 'public_profile', 'user_birthday', 'user_location', 'user_friends']}, function (err, info) {
        passportResponse(req, res, err, info)
      })(req, res, next)
      /* PassportService.passportResponse(req, req.param('accessToken'), req.param('refreshToken'), req.param('profile'), function (err, info) {
        passportResponse(req, res, err, info)
      })*/
    } else {
      passport.authenticate('facebook', {scope: ['email', 'public_profile', 'user_birthday', 'user_location', 'user_friends'], session: false})(req, res, next)
    }
  },
  facebookCallback: function (req, res, next) {
    if(!req.user) {
      passport.authenticate('facebook',
        {
          failureRedirect: '/login'
        }, function (err, info) {
          passportResponse(req, res, err, info)
        }
        //  You could put your own behavior in here, fx: you could force auth again...
      )(req, res, next)
    } else {
      passport.authorize('facebook', {
        failureRedirect: '/login'
      }, function (err, info) {
        if (err) return res.negotiate(err)
        console.log('custom callback for login')
        passportResponse(req, res, err, info)
        // res.render('after-auth', {data: {loggedIn: true, redirect: req.url}})
      })(req, res, next)
    }
    console.log("Facebook callback triggered")
  },
  linkedin: function (req, res, next) {
    console.log("Linkedin login triggered")
    if(UserService.reqFromMobile(req)) {
      PassportService.passportResponse(req, req.param('accessToken'), req.param('refreshToken'), req.param('profile'), function (err, info) {
       passportResponse(req, res, err, info)
       })
    } else {
      passport.authenticate('linkedin', {scope: ['r_basicprofile', 'r_emailaddress'], session: false})(req, res, next)
    }
  },
  linkedinCallback: function (req, res, next) {
    if(!req.user) {
      passport.authenticate('linkedin',
        {
          failureRedirect: '/login'
        }, function (err, info) {
          passportResponse(req, res, err, info)
        }
        //  You could put your own behavior in here, fx: you could force auth again...
      )(req, res, next)
    } else {
      passport.authorize('linkedin', {
        failureRedirect: '/login'
      }, function (err, info) {
        if (err) return res.negotiate(err)
        console.log('custom callback for login')
        passportResponse(req, res, err, info)
        // res.render('after-auth', {data: {loggedIn: true, redirect: req.url}})
      })(req, res, next)
    }
    console.log("Linkedin callback triggered")
  },/*
  /*
  'connect/facebook': function (req, res, next) {
    console.log("Facebook connect triggered")
    if(UserService.reqFromMobile(req)) {
      passport.authorize('facebook-token', {scope: ['email', 'public_profile', 'user_birthday', 'user_location', 'user_friends']})(req, res, next)

    } else {
      passport.authorize('facebook', {scope: ['email', 'public_profile', 'user_birthday', 'user_location', 'user_friends']})(req, res, next)
    }
  },*/
  twitter: function (req, res, next) {
    // console.log("Twitter login triggered")
    passport.authenticate('twitter', {session: false})(req, res, next)
  },
  twitterCallback: function (req, res, next) {
    // console.log("Twitter callback triggered")
    if(!req.user) {
      passport.authenticate('twitter',
        {
          failureRedirect: '/login'// ,
          // successRedirect: '/'
        }, function (err, info) {
          passportResponse(req, res, err, info)
        }
        //  You could put your own behavior in here, fx: you could force auth again...
      )(req, res, next)
    } else {
      passport.authorize('twitter', {
        failureRedirect: req.url
      }, function (err, info) {
        if (err) return res.negotiate(err)
        console.log('custom callback for login')
        passportResponse(req, res, err, info)
        // res.render('after-auth', {data: {loggedIn: true, redirect: req.url}})
      })(req, res, next)
    }

  },/*
  'connect/twitter': function (req, res, next) {
    console.log("Twitter connect triggered")
    passport.authorize('twitter')(req, res, next)
  },*/
  google: function (req, res, next) {
    // console.log("Google login triggered")
    if(UserService.reqFromMobile(req)) {
      PassportService.passportResponse(req, req.param('accessToken'), req.param('refreshToken'), req.param('profile'), function (err, info) {
        passportResponse(req, res, err, info)
      })
    } else {
      passport.authenticate('google', {scope: ['email', 'profile'], session: false}, function (err, info) {
        passportResponse(req, res, err, info)

      })(req, res, next)
    }
  },
  googleCallback: function (req, res, next) {
    if(!req.user) {
      passport.authenticate('google',
        {
          failureRedirect: '/login'// ,
          // successRedirect: '/'
        }, function (err, info) {
          passportResponse(req, res, err, info)
        }
        //  You could put your own behavior in here, fx: you could force auth again...
      )(req, res, next)
    } else {
      passport.authorize('google', {
        failureRedirect: req.url
      }, function (err, info) {
        if (err) return res.negotiate(err)
        console.log('custom callback for login')
        passportResponse(req, res, err, info)
        // res.render('after-auth', {data: {loggedIn: true, redirect: req.url}})
      })(req, res, next)
    }
  },/*
  'connect/google': function (req, res, next) {
    console.log("Google connect triggered")
    if(UserService.reqFromMobile(req)) {
      PassportService.passportResponse(req, req.param('accessToken'), req.param('refreshToken'), req.param('profile'), function (err, info) {
        passportResponse(req, res, err, info)
      })
    } else {
      passport.authorize('google', {scope: ['email', 'profile']}, function (err, info) {
        if (err) return res.negotiate(err)
        passportResponse(req, res, err, info)
        // res.render('after-auth', {data: {loggedIn: true, redirect: req.url}})
      })(req, res, next)
    }
  },*/


  logout: function (req, res) {
    req.logout()
    res.send('logout successful')
  },
  signup: function (req, res) {
    // console.log('Recaptcha: ' + req.param('captcha'))
    if(!req.param('first_name')
      || !req.param('last_name')
      || !validator.isEmail(req.param('email'))
      || !req.param('password')
      || !req.param('phone')
      )
      return res.badRequest('Please complete missing fields')

    var user = {
      first_name: req.param('first_name'),
      last_name: req.param('last_name'),
      email: req.param('email'),
      password: req.param('password'),
      phone: req.param('phone'),
      last_logged_in: new Date(),
      verification_text: require("randomstring").generate(),
      residency_country: req.param('residency_country'),
      onesignal_id: req.param('onesignal_id')
    }

    // The following code block was used to verify request comes from real mobile device verified before
    // As sessions do not work with mobile requests, we try to use database to store codes until it's verified

    // (replacing captcha method in the web)
    // if(UserService.reqFromMobile(req)) {
    //   NonUserMobileVerificationService.getCode(req.param('phone'), function (err, result) {
    //     if (err) {
    //       console.log(err)
    //       res.negotiate(err)
    //     } else {
    //       if (!result || result.Items.length === 0)
    //         return res.badRequest('Please request a code to verify')
    //
    //       // if (moment().diff(moment(result.Items[0].TimeStamp), 'minutes') > 15) {
    //         // return res.badRequest('Code expired, Please request another code to verify')
    //       // }
    //
    //       if (!result.Items[0].Verified) {
    //         return res.badRequest('Phone unverified, please verify mobile number first')
    //       }
    //
    //       registerFromForm(req, res, user)
    //     }
    //
    //   })
    // } else {
      https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + sails.config.googleRecaptcha.secret_key + "&response=" + req.param('captcha'), function (response) {
        var data = "";
        response.on('data', function (chunk) {
          data += chunk.toString();
        });
        response.on('end', function () {
          try {
            var parsedData = JSON.parse(data);
            //console.log(parsedData);
            // if (parsedData.success) {
              registerFromForm(req, res, user)
            // } else return res.badRequest("Recaptcha Validation Failed.")
          } catch (e) {
            return res.negotiate(e)
          }
        });
      });
    // }
  },
  verifyEmail: function (req, res) {
    if (req.param("verification_text") == "resend") {
      sendVerificationEmail(req, res, null)
    } else {
      User.update({verification_text: req.param("verification_text")}, {email_verified: true}).exec(function (err, user) {
        if (err) {
          Reporting.logError(err, __filename, req.user)
          return res.negotiate(err)
        }
        if (user.length == 0) {
          return res.notFound("User not found")
        }
        else {
          Analytics.track('server:user verified email', 'action', 'user', user[0].email, user[0].id, 'server', null, function (result) {})
          EmailService.sendRegistrationEmail(user[0].email, user[0].name(), user[0].profile_pic(), sails.config.appName)

          if(req.user)
            UserService.updateUserInfoCookie(res, user[0])

          res.ok({msg: 'Your email is verified successfully'}, 'user/verifyEmail')
          // req.session.redirect = "/user/account"
          // authenticateLogin(user[0], req, res, false, true)
        }
      })
    }
  },

  // Check if user is signing up with already used email address or phone number (for mobile sign up)
  verifyMobileRegister: function (req, res){
    User.findOne({
      or : [
        {email:req.param('email')},
        { phone: req.param('phone') }
      ],
      select : ['id']
    }).exec(function (err, user){
      if(err) return res.negotiate(err)
      if(!user) return res.ok()

      return res.json(409, {error: 'Email address or phone number already in use'})
    })
  },

  signupView: function (req, res) {
    res.ok({

    }, 'signup')
  },

  getCountries: function (req, res) {
    res.ok(require("country-data").countries.all)
  },

  loginView: function (req, res) {
    res.view('user/login')
  },

  deepLinking: function (req, res) {
    res.json({
      "applinks": {
        "apps": [],
        "details": [
          {
            "appID": "{{iOS App ID in App Store}}",
            "paths": [

            ]
          }
        ]
      }
    })
  }
}

/* *
 * Sails controllers expose some logic automatically via blueprints.
 *
 * Blueprints are enabled for all controllers by default, and they can be turned on or off
 * app-wide in `config/controllers.js`. The settings below are overrides provided specifically
 * for AuthController.
 *
 * NOTE:
 * REST and CRUD shortcut blueprints are only enabled if a matching model file
 * (`models/Auth.js`) exists.
 *
 * NOTE:
 * You may also override the logic and leave the routes intact by creating your own
 * custom middleware for AuthController's `find`, `create`, `update`, and/or
 * `destroy` actions.
 */

module.exports.blueprints = {

  //  Expose a route for every method,
  //  e.g.
  //  `/auth/foo` =&gt `foo: function (req, res) {}`
  actions: true,

  //  Expose a RESTful API, e.g.
  //  `post /auth` =&gt `create: function (req, res) {}`
  rest: true,

  //  Expose simple CRUD shortcuts, e.g.
  //  `/auth/create` =&gt `create: function (req, res) {}`
  //  (useful for prototyping)
  // shortcuts: true

}
