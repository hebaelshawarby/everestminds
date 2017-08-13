/**
 * Event.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
 start_Date:{
      type: 'string',
      required: true
    },
     end_Date:{
      type: 'string',
      required: true
    },
    description:{
      type: 'string',
      required: true
    },
     shops: {
      collection: 'shop',
      via: 'events'
    },
     reviews: {
      collection: 'review',
      via: 'event'
    },
     reports: {
      collection: 'report',
      via: 'event'
    },
     videos: {
      collection: 'media',
      via: 'event'
    },
     owner: {
      model: 'user'
    }
  }
};

