/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  var liftingPhrase;

  if(sails.config.environment == 'production')
    liftingPhrase = 'Lifting in production mode';
  else liftingPhrase = 'Lifting in development mode';

  if(process.env.production)
    liftingPhrase += ' on Production Server';
  else if(process.env.stage)
    liftingPhrase += ' on Staging Server';
  else liftingPhrase += ' on Local Server';

  Reporting.log(liftingPhrase);

  cb();
};
