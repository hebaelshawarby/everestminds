/**
 * Created by ahmedhany on 8/15/16.
 */
module.exports = function(req, res, next) {


  if(req.query.lang != null){
    res.cookie('m_f_languagePreference', req.query.lang, {
      signed: true,
      httpOnly: true
    })
    req.setLocale(req.query.lang);
  } else if(req.signedCookies.m_f_languagePreference) {
    req.setLocale(req.signedCookies.m_f_languagePreference.toString());
  }
  next();

};