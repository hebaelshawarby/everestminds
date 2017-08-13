var passport = require('passport');

module.exports = function(req, res, next) {
//TODO: Check if Admin
  //  return res.forbidden('You are not permitted to perform this action.');

    passport.authenticate('jwt', function (error, user, info) {
        if (error) return res.serverError(error);
        if (!user){
            req.session.redirect = req.url;
            return res.redirect("/login");
        }
        //return res.unauthorized(null, info && info.code, info && info.message);
        console.log(user);

        if ((new User._model(user)).isAdmin())
            return next();
        return res.json({
            succ: false,
            error : "Not Allowed",
            message : "You do not have permission to perform this action"
        });

        next();
    })(req, res);
  //next();
};