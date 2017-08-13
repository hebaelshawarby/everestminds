/**
 * Created by ahmedhany on 2/25/16.
 */

/**
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
        if (error) return res.serverError(error);
        /*if (!user){
            req.session.redirect = req.url;
            return res.redirect("/login");
        }*/
            //return res.unauthorized(null, info && info.code, info && info.message);
        console.log("the user")
        console.log(user);
        req.user = user;
        req.sd_admin = (new User._model(user)).isAdmin();

        next();
    })(req, res);
};
