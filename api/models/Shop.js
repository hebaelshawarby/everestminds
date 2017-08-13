/**
 * Shop.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
name:{
      type: 'string',
      required: true,
      unique:'true'
    },
    description:{
      type: 'text',
      required: true
    },
    location:{
      type: 'text',
      required: true
    },
     email:{
      type: 'string',
      required: true,
      unique:true,
      email: true
    },
      telephone:{
      type: 'integer',
      required: true
    },

      policy:{
        type:'json',
        defaultsTo:'Not Yet Specified'
      },
      renewel_options:{
        type:'string'
      },

     events: {
      collection: 'event',
      via: 'shops',
      dominant: true
    },
    subscribed_users: {
      collection: 'user',
      via: 'subscribed_shops'
    },
      reviews: {
      collection: 'review',
      via: 'shop'
    },
     reports: {
      collection: 'report',
      via: 'shop'
    },
     videos: {
      collection: 'media',
      via: 'shop'
    },
    products: {
      collection: 'product',
        via: 'shop'
      },
     owner:{
      model:'user',
      unique: true
    }

  }
};

