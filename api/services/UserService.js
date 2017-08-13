/**
 * Created by ahmedhany on 2/28/16.
 */

module.exports = {
  updateUserInfoCookie: function (res, user) {
    res.cookie('user', user.toJSON(), {
      secure: res.connection.encrypted ? true : false,
      maxAge: sails.config.jwtSettings.expiresIn * 1000,
      signed: true,
      httpOnly: true
    })
  },
  deleteUserInfoCookie: function (res) {
    res.clearCookie('user')
  },
  getCurrUserInfo: function (req, callback) {
    if (req.signedCookies.user)
      return callback(null, req.signedCookies.user)

    User.findOne({id: req.user.id}, function (err, user) {
      if (err) {
        return callback(err, null)
      } else {
        return callback(null, user)
      }
    })
  },
  getCurrUserCookie: function (req) {
      return req.signedCookies.user
  },
  // helper functions
  findById: function (id, fn) {
    User.findOne({id: id}, function (err, user) {
      if (err) {
        return fn(err, null)
      } else {
        return fn(null, user)
      }
    })
  },

  reqFromMobile: function (req) {
    return req.headers['mobile'];
  },
  reqFromFrontend: function (req) {
    return req.headers['everestminds-frontend'];
  }
}
