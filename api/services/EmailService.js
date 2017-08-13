// Following packages used with microsoft office smptp server according to platform

// var os = require('os');
// if (os.platform() == 'win32') {
//   var chilkat = require('chilkat_node6_win32');
// } else if (os.platform() == 'linux') {
//   if (os.arch() == 'arm') {
//     var chilkat = require('chilkat_node6_arm');
//   } else if (os.arch() == 'x86') {
//     var chilkat = require('chilkat_node6_linux32');
//   } else {
//     var chilkat = require('chilkat_node6_linux64');
//   }
// } else if (os.platform() == 'darwin') {
//   var chilkat = require('chilkat_node5_macosx');
// }

module.exports = {

  sendRegistrationEmail: function (email, name, pic, appName) {

      sails.renderView('email/activation', {
          layout: null,
          name: name,
          pic: pic
        },
        function (err, html) {
          EmailService.sendEmail([email], "Your " + appName + " journey has just started!", html)
        })

  },

  sendVerificationEmail: function (email, verification_link, appName) {

      console.log(verification_link)
      sails.renderView('email/verifyemail', {
          layout: null,
          link: verification_link,
          appName: appName
        },
        function (err, html) {
          if (err) {
            Reporting.logError(err, __filename, null)
          } else {
            EmailService.sendEmail([email], "Your " + appName + " journey is one click away!", html)
          }

        })

  },

  sendResetPassEmail: function (email, reset_link) {

    console.log(reset_link)
    sails.renderView('email/resetpass', {
        layout: null,
        link: reset_link
      },
      function (err, html) {
        if (err) {
          Reporting.logError(err, __filename, null)
        } else {
          EmailService.sendEmail([email], "Reset Password", html)
        }

      })

  },

  sendEmail: function (to, subject, message, callback) {
    var Mailgun = require("mailgun").Mailgun
    console.log("sending email " + subject + " to " + to)
    var fromEmail = 'no-reply@{{DOMAIN}}.com'
    var mg = new Mailgun('')

    var tostr = ""
    for (var i in to)
      tostr += to[i] + ", "
    tostr = tostr.substring(0, tostr.length - 2)
    mg.sendRaw(fromEmail,
      to,
      "From: " + fromEmail +
      "\nTo: " + tostr +
      "\nContent-Type: text/html; charset=utf-8" +
      "\nSubject: " + subject +
      "\n\n" + message
      , function (err) {
        var response = err ? {succ: false, err: err} : {succ: true}
        console.log("sent email:" + JSON.stringify(response))
        if (callback)
          callback(response)
      })
  },

  sendOfficeEmail: function (to, subject, message, callback) {

    //  The mailman object is used for sending and receiving email.
    var mailman = new chilkat.MailMan();

    //  Any string argument automatically begins the 30-day trial.
    var success = mailman.UnlockComponent("30-day trial");
    if (success !== true) {
      console.log(mailman.LastErrorText);
      return;
    }

    //  Set the SMTP server to Office365's SMTP server.
    //  Note: Please be sure to double-check the SMTP settings
    //  with your provider or with the official Office365 documentation
    //  provided by Microsoft.  The required settings could change...
    mailman.SmtpHost = "smtp.office365.com";
    mailman.SmtpPort = 587;
    mailman.StartTLS = true;

    //  Set the SMTP login/password
    mailman.SmtpUsername = "postmaster@sandbox1ffe43ab832c400bb064c223b715e2a0.mailgun.org";
    mailman.SmtpPassword = "4b393fd8e137205f08ffd95b0061db29";

    //  Create a new email object
    var email = new chilkat.Email();

    email.Subject = subject;
    email.Body = message;
    email.From = "{{APP NAME}} <support@{{DOMAIN}}.com>";
    success = email.AddTo("Name", to[0]);

    //  Call SendEmail to connect to the SMTP server and send.
    //  The connection (i.e. session) to the SMTP server remains
    //  open so that subsequent SendEmail calls may use the
    //  same connection.
    success = mailman.SendEmail(email);
    if (success !== true) {
      console.log(mailman.LastErrorText);
      return;
    }

    success = mailman.CloseSmtpConnection();
    if (success !== true) {
      console.log("Connection to SMTP server not closed cleanly.");
    }

    console.log("Mail Sent! " + to);

  },

  // SEND SMS USING TWILIO
  sendSMS: function (to, message, callback) {
    //Initialize a REST client in a single line:
    var client = require('twilio')(sails.config.twilio.sid, sails.config.twilio.auth_token);
    console.log('Sending SMS Body: ')
    console.log(message)
// Use this convenient shorthand to send an SMS:
    client.sendMessage({
      to:to,
      from:sails.config.twilio.number,
      body:message
    }, function(error, message) {
      if (!error) {
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
        console.log('Message sent on:');
        console.log(message.dateCreated);
      } else {
        console.log('Oops! There was an error.');
      }
      callback(error)
    });
  },

  // TODO: SEND SMS USING DIGITS

  /*    MailChimp-Related functions   */

  /*
   * POST subscribe an email to a list.
   */

  subscribeEmail: function (listId, emailId) {
    var mcapi = require("mailchimp-api")
    var response = false
    mc = new mcapi.Mailchimp('7df11c2a20f245c2a740ed3288021cf2-us11')
    //console.log(emailId)
    mc.lists.subscribe({id: listId, email: {'email': emailId}}, function (data) {
        console.log("Successfully Subscribed")
        response = true
      },
      function (error) {
        if (error.error) {
          console.log(error.code + ": " + error.error)
        } else {
          console.log('There was an error subscribing that user')
        }
        var response = error ? {succ: false, err: error} : {succ: true}
      })
    return response
  }
}






