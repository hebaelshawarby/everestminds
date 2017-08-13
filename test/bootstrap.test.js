var sails = require('sails');

before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(180000);

  sails.lift({
    environment: 'development'

    // configuration for testing purposes
  }, function(err, server) {
    if (err) {
      console.log("Error occurred lifting Sails app: ", err);
      return done(err)
    }
    console.log('Lifted Successfully')
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  console.log('Lowering Sails')
  // here you can clear fixtures, etc.
  sails.lower(done);
});