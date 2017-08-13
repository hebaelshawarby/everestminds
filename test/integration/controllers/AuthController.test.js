/**
 * Created by ahmedhany on 7/28/16.
 */

var request = require('supertest');

describe('AuthController', function() {

  describe('#login()', function() {
    it('should return 200', function (done) {
      request(sails.hooks.http.app)
        .post('/auth/process')
        .send({ email: 'hoda4a@gmail.com', password: 'hodaibrahim' })
        .expect(200, done)
    });
  });

  

  // describe('#loginFacebook()', function() {
  //   it('should return 200', function (done) {
  //     request(sails.hooks.http.app)
  //       .post('/auth/facebook?access_token=' + sails.config.testing.facebook_access_token)
  //       .set('mobile', 'true')
  //       .expect(200, done)
  //   });
  // });

  // describe('#verifyEmail()', function() {
  //   it('should return 200', function (done) {
  //     request(sails.hooks.http.app)
  //       .post('/user/verify/T8tspDY1yjgeE7iDjsHXXbG6kI30r3tk')
  //       .expect(200, done)
  //   });
  // });

  // describe('#sendVerificationEmail()', function() {
  //   it('should return 200', function (done) {
  //     request(sails.hooks.http.app)
  //       .post('/user/verify/resend')
  //       .set('Authorization', 'JWT ' + sails.config.testing.token)
  //       .set('mobile', 'true')
  //       .expect(200, done)
  //   });
  // });

  // describe('#verifyMobileRegisterExistingAccount()', function() {
  //   it('should return 409', function (done) {
  //     request(sails.hooks.http.app)
  //       .post('/auth/verifyMobileRegister')
  //       .send({ email: 'ahmad.abdelrahman2012@gmail.com', phone: '01001475618' })
  //       .expect(409, done)
  //   });
  // });

  // describe('#verifyMobileRegisterValidAccount()', function() {
  //   it('should return 200', function (done) {
  //     request(sails.hooks.http.app)
  //       .post('/auth/verifyMobileRegister')
  //       .send({ email: 'test@test.com', phone: '01001111111' })
  //       .expect(200, done)
  //   });
  // });

  // describe('#getCountries()', function() {
  //   it('should return 200', function (done) {
  //     request(sails.hooks.http.app)
  //       .post('/auth/getCountries')
  //       .expect(200, done)
  //   });
  // });

});
