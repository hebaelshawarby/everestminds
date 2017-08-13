/* *
 * Created by ahmedhany on 2/25/16.
 */

/* *
 * isLoggedOut
 * @description :: Policy to prevent logged in users visiting login and signup pages
 */

module.exports = function (req, res, next) {
  if(req.user)
    res.redirect('/')

  next()
}
