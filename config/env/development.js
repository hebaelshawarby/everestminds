/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: process.env.production ? 'liveSQL' : process.env.STAGE ? 'stageSQL' : 'localSQL'

  },
  // blueprints: {},
  'facebookAuth': {
    'clientID': '1399664113475095', // your App ID
    'clientSecret': 'eb8bb016f184b49b93f0511394b4ed53', // your App Secret
    'callbackURL': "http://localhost:1337/auth/facebook/callback",
  },
  'linkedinAuth': {
    'clientID': '', // your App ID
    'clientSecret': '', // your App Secret
    'callbackURL': '/auth/linkedinCallback'
  },
  'twitterAuth': {
    'consumerKey': '',
    'consumerSecret': '',
    'callbackURL': 'http://localhost:1337/auth/twitterCallback'
  },
  'googleAuth': {
    'clientID': '',
    'clientSecret': '',
    'callbackURL': '/auth/googleCallback'
  },
  googleRecaptcha:{
    site_key: '6Lf21RcUAAAAAFWt_qt0Q7T2T6WPLfaLrGg71hjW',
    secret_key: '6Lf21RcUAAAAADjY8oBTtwJ-j_x0V7zWyMSLEbie'
  },
  appUrl: 'http://localhost:1337',
  logoUrl: 'http://everestminds.com/assets/img/logo_condensed.png',
  appName: 'Everest Minds',
  appDesc: 'Everest Minds knows no challenge',
  twilio: {
    sid: '',
    auth_token: '',
    number: ''
  },
  rollbar: {
    key: ''
  },
  onesignal:{
    app_id: '',
    restKey: ''
  }

};
