/**
 * Created by ahmedhany on 5/18/16.
 */
var moment = require('moment')
var request = require('request')

var base_url = 'https://onesignal.com/api/v1'

module.exports = {

  pushNotification: function (player_ids, message, url, app_id, restKey) {
    request(
      { method: 'POST'
        , uri: base_url + '/notifications',
        headers: {
          "authorization": "Basic " + restKey,
          "content-type": "application/json"
        },
        json: true
        , body:
      {
        'app_id': app_id,
        'contents': {"en": message},
        'include_player_ids': player_ids,
        'data':{'url': url}
      }
      }
      , function (error, response, body) {
        // var res = JSON.parse(body)
        // console.log(error)
        // console.log(response)
        console.log(body)
        /*
         if(response.statusCode == 200){
         console.log('Shipment Added')
         // console.log(body)

         } else {
         console.log('error: '+ response.statusCode)
         // console.log(body)
         }
         */
      }
    )

  }

};
