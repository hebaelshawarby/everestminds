/**
 * Created by ahmedhany on 3/1/17.
 */
module.exports = {
  constructEmailVerificationLink: function (user) {
    return sails.config.appUrl + '/user/verify/' + user.verification_text;
  },
  // used for constructing product links (or any similar object) for good SEO
  convertStringToSlug: function(str){
    return str.toLowerCase()
      .replace(/[^\w ]+/g,'')
      .replace(/ +/g,'-');
  },
  // used for extracting object id from above constructed link
  getIdFromSlug: function(slug){
    var id = 0
    if(slug && slug.indexOf('-') != -1){
      var temp = slug.split('-')[slug.split('-').length - 1]
      if(_.isNumber(parseInt(temp)))
        id = temp
    }
    return id
  }
}
