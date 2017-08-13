# starter-app

a [Sails](http://sailsjs.org) application architected by **Everest Minds** for serving *Web* and *Mobile* platforms.

### Before Start, please read the following: ###

* Development and Production environments configuration should be set in config/env before start for all needed variables and third parties keys.
* Email SMPT Server "Key" and "from Email" should be changed in EmailService according to the server used.
* Any variable needed to be replaced by you in backend code is surrounded by {{}} like angular brackets.
* Some keys used by services are hard coded inside the service for hosting it separately as microservice.
* To install any npm module: npm install {{MODULE NAME}} --save
* To uninstall any npm module: npm uninstall {{MODULE NAME}} --save
* Any uploaded files or images should be saved to Cloud Storage not Sails app folder.
* To add more social networks to authentication, uncomment needed modules along with functions using them in:
    * AuthController
    * PassportService
    * user/loginhalt and user/profilestatus views
    * Uncomment Social network id column in User model.
* Main theme style in styles/dependencies/style.css, custom css in styles/custom.css
* Check URLs:
    * http://localhost:1337/login
    * http://localhost:1337/signup
    * http://localhost:1337/user/account

#### Environment Variables needed in the cloud: ####

Staging server: stage = true,
Live Server: production = true

#### Commands to run in project directory on staging server after deployment: ####
**NOTE:** stage=true should be changed to production=true on Production server

```
#!shell

forever stopall
npm install
stage=true forever start app.js
forever stopall
NODE_ENV=production stage=true forever start app.js
```

#### Live server log view: ####

1. Run ```npm i frontail -g``` on server
2. Run ```frontail out.log --ui-highlight -n 2000 &``` inside project directory
3. Visit yourhostlink:9001

## Missing Features: ##

1. Using Refresh tokens in authentication.
2. Using [Digits](https://get.digits.com/) instead of Twilio for mobile verification.
3. Use SCSS to change theme colors easily before start.
