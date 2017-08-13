describe('UserModel', function() {

  describe('#find()', function() {
    it('should check find function', function (done) {
      User.find()
        .then(function(results) {
          // some tests
          console.log('Number of users found: ' + results.length)
          done();
        })
        .catch(done);
    });
  });

});