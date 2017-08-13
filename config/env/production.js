/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: process.env.production ? 'liveSQL' : process.env.STAGE ? 'stageSQL' : 'localSQL'

  },
  // blueprints: {},
  'facebookAuth': {
    'clientID': '1399664113475095', // your App ID
    'clientSecret': 'eb8bb016f184b49b93f0511394b4ed53', // your App Secret
    'callbackURL': '/auth/facebookCallback'
  },
  'linkedinAuth': {
    'clientID': '', // your App ID
    'clientSecret': '', // your App Secret
    'callbackURL': '/auth/linkedinCallback'
  },
  'twitterAuth': {
    'consumerKey': '',
    'consumerSecret': '',
    'callbackURL': '{{LIVE DOMAIN}}/auth/twitterCallback'
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
  appUrl: '{{LIVE DOMAIN}}',
  logoUrl: 'http://everestminds.com/assets/img/logo_condensed.png',
  appName: '',
  appDesc: 'Everest Minds knows no challenge',
  twilio: {
    sid: '',
    auth_token: '',
    number: ''
  },

  testing:{
    token: '',
    facebook_access_token: ''
  },
  rollbar: {
    key: '',
    staging_branch: '',
    live_branch: 'master'
  },
  onesignal:{
    app_id: '',
    restKey: ''
  },
  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: process.env.stage? 1337 : 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
