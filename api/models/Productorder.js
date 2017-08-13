/**
 * Productorder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
owner:{
      model:'user'
    },
    product: {
      model: 'product'
    },
    status:{
type: 'string',
    enum: ['processing', 'delivered', 'cancelled']
    },
     payment_method:{
      type:'string',
      enum:['cash on delivery','paying online' ,'paying at the shop']

    },
  }
};

