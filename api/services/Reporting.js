var winston = require('winston')
// include and initialize the rollbar library with your access token
var rollbar = require("rollbar");
rollbar.init(sails.config.rollbar.key, {
  environment: process.env.stage ? "staging" : process.env.production ? "production" : "",
  branch: process.env.stage ? sails.config.rollbar.staging_branch : process.env.production ? sails.config.rollbar.live_branch : ""
});

rollbar.handleUncaughtExceptionsAndRejections(sails.config.rollbar.key, {
  environment: process.env.stage ? "staging" : process.env.production ? "production" : "",
  branch: process.env.stage ? sails.config.rollbar.staging_branch : process.env.production ? sails.config.rollbar.live_branch : ""
});

winston.add(winston.transports.File, { filename: 'out.log' });

/*see the documentation for Winston:  https://github.com/flatiron/winston */
var logger = new(winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      handleExceptions: true,
      humanReadableUnhandledException: true,
      level: 'info'
    })
  ],
  exitOnError: false
})

module.exports = {

  error: function (desc, file, type, type_name, category, user_email, user_id, platform) {

    var event_type = 'error';

  },

  logError: function (err, file_path, user) {
    logger.log('info', err, {filename: require('path').basename(file_path), user_id: user ? user.id || user.email : null})

    if(process.env.stage || process.env.production){
      if(user){
        rollbar.handleError(err);
      } else {
        // to specify payload options - like extra data, or the level - use handleErrorWithPayloadData
        // rollbar.handleErrorWithPayloadData(err, {user: user});
      }
    }

  },

  log: function (message) {
    winston.info(new Date().toISOString() + ': ' + message);

  }
};
