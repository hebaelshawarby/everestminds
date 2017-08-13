/**
 * Review.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  description:{
      type: 'text',
      required: true
    },
     owner: {
      model: 'user'
    },
    shop: {
      model: 'shop'
    },
     product: {
      model: 'product'
    },
    event: {
      model: 'event'
    }
  }
};

