/**
 * Created by ahmedhany on 5/11/16.
 */

var request = require('supertest');

describe('UserController', function() {

  // describe('#openInvitepage()', function() {
  //   it('should return 200', function (done) {
  //     request(sails.hooks.http.app)
  //       .post('/invite/friends/545')
  //       .set('Authorization', 'JWT ' + sails.config.testing.token)
  //       .set('mobile', 'true')
  //       .expect(200, done)
  //   });
  // });

  // describe('#profile()', function() {
  //   it('should return 200', function (done) {
  //     request(sails.hooks.http.app)
  //       .get('/user/profile/1797fba0-27e1-11e6-bfc2-410640cad993')
  //       .set('Authorization', 'JWT ' + sails.config.testing.token)
  //       .set('mobile', 'true')
  //       .expect(200, done)
  //   });
  // });
/*
  describe('#manageProfile()', function() {
    it('should return 200', function (done) {
      request(sails.hooks.http.app)
        .get('/user/account')
        .set('Authorization', 'JWT ' + sails.config.testing.token)
        .set('mobile', 'true')
        .expect(200, done)
    });
  });
*/
  describe('#updateProfileinfo()', function() {
    it('should return 200', function (done) {
      request(sails.hooks.http.app)
        .post('/user/updateProfileinfo/')
        .set('Authorization', 'JWT ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyfSwiaWF0IjoxNTAyNjI5MjA0LCJleHAiOjE1MDM4Mzg4MDQsImF1ZCI6Int7TElWRSBET01BSU59fSIsImlzcyI6Int7TElWRSBET01BSU59fSJ9.FRKh2iH1tUKYz81yLB7iCeDthpa9KWOG_najKCv8vDo')
        .set('mobile', 'true')
        .send({ user: {
          address: 'Building 7, square 1163, Ministries square, Sheraton',
          city: 'Cairo',
          area: 'Masaken Sheraton'
        } })
        .expect(200, done)
    });
  });

  // describe('#score()', function() {
  //   it('should return 200', function (done) {
  //     request(sails.hooks.http.app)
  //       .post('/user/score/')
  //       .set('Authorization', 'JWT ' + sails.config.testing.token)
  //       .set('mobile', 'true')
  //       .expect(200, done)
  //   });
  // });

  // describe('#getCities()', function() {
  //   it('should return 200', function (done) {
  //     request(sails.hooks.http.app)
  //       .post('/user/getCities/')
  //       .set('Authorization', 'JWT ' + sails.config.testing.token)
  //       .send({ country: 'EG' })
  //       .set('mobile', 'true')
  //       .expect(200, done)
  //   });
  // });

  // describe('#getUserGlobals()', function() {
  //   it('should return 200', function (done) {
  //     request(sails.hooks.http.app)
  //       .post('/user/getUserGlobals/')
  //       .set('Authorization', 'JWT ' + sails.config.testing.token)
  //       .set('mobile', 'true')
  //       .expect(200, done)
  //   });
  // });

})