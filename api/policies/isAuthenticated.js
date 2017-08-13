/* *
 * Created by ahmedhany on 2/25/16.
 */

/* *
 * isAuthenticated
 * @description :: Policy to inject user in req via JSON Web Token
 */
var passport = require('passport'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt

function cookieExtractor (req) {
  var token = null
  if (req && req.cookies) {
    token = req.cookies.e_m_t
  }
  return token
}

module.exports = function (req, res, next) {
  /* TODO::If you want additional validation here you can check the
   user ID against the database to verify that this user actually
   exists and is active.  For the sake of simplicity, I’m going
   to trust the token and retrieve the user information from the
   token payload and just return it*/
  passport.use(
    new JwtStrategy({
        jwtFromRequest: UserService.reqFromMobile(req) ? ExtractJwt.fromAuthHeader() : cookieExtractor,
        secretOrKey: sails.config.jwtSettings.secret,
        issuer: sails.config.jwtSettings.issuer,
        audience: sails.config.jwtSettings.audience,
        passReqToCallback: false
      },
      function (payload, next) {
        var user = payload.user
        return next(null, user, {})
      }))

  passport.authenticate('jwt', function (error, user, info) {
    if (error) return res.serverError(error)
    if (!user) {
      if (UserService.reqFromMobile(req))
        return res.forbidden('Unauthorized User')
      else {
        UserService.deleteUserInfoCookie(res)
        if(!req.wantsJSON)
          req.session.redirect = req.url
        return res.redirect("/login")
      }

    }
    // return res.unauthorized(null, info && info.code, info && info.message)
    
    req.user = new User._model(user)
    req.sd_admin = (new User._model(user)).isAdmin()

    next()
  })(req, res)
}
