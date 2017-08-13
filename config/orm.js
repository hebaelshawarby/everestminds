/**
 * Created by ahmedhany on 3/3/16.
 */
var delay = 240000
module.exports = {
    orm: {
        _hookTimeout: delay
    }, // I used 60 seconds as my new timeout
    pubsub: {
        _hookTimeout: delay
    },
    grunt:{
        _hookTimeout: delay
    }
};
