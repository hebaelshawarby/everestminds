var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  JwtStrategy = require('passport-jwt').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy;
  // TwitterStrategy = require('passport-twitter').Strategy,
  // GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  // FacebookTokenStrategy = require('passport-facebook-token');

var EXPIRES_IN_SECONDS = 60 * 60 * 24 * 14,
  SECRET = process.env.tokenSecret || "{{APPLICATION SPECIFIC SECRET}}", // secrets should be environment variables
  ALGORITHM = "HS256",
  ISSUER = "{{LIVE DOMAIN}}",
  AUDIENCE = "{{LIVE DOMAIN}}";

module.exports = {
  http: {
    customMiddleware: function (app) {
      app.use(passport.initialize());
      app.use(passport.session());
    }
  },
  jwtSettings: {
    expiresIn: EXPIRES_IN_SECONDS,
    secret: SECRET,
    algorithm: ALGORITHM,
    issuer: ISSUER,
    audience: AUDIENCE
  },
  recaptchaPrivateKey: process.env.recaptchaPrivateKey || "{{GOOGLE RECAPTCHA PRIVATE KEY}}" // secrets should be environment variables
};
