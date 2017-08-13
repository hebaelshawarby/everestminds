// Integrate any third party tracking services (intercom.io is the best)

module.exports = {

    track: function (desc, type, category, user_email, user_id, platform, extra, callback) {
        // if(sails.config.environment === 'production' && !process.env.stage)
            // heap.track(desc, type, category, user_email, user_id, platform,callback);
        // route.track(desc,user_email,callback);
        // IntercomService.track(desc, type, category, user_email, user_id, platform, extra, callback)
        console.log(desc)
    },

    identify: function (user_email, user_id, prop, callback) {

        // heap.identify(user_email, user_id, prop, callback);
        // IntercomService.identify(user_email, user_id, prop, callback)

    }

};
