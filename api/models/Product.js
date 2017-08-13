/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
   name:{
      type: 'string',
      required: true
    },
    
     discount:{
      type: 'integer',
     
    },
     description:{
      type: 'text',
      required: true
    },
     keywords:{
      type: 'array',
      required: true
    },
     
    rate:{
      type:'float'
    },
     url:{
      type: 'string'
      
    },
    feature:{
      type:'boolean',
      defaultsTo:'false'

    },

     product_variation:{
        type:'array'
      },
     category:{
      type: 'string',
      required:true
    },
  purchaseNumber:{
    type:'integer'
  },
    raters: {
      collection: 'user',
      via: 'products_rate'
    },
     reviews: {
      collection: 'review',
      via: 'product'
    },
     reports: {
      collection: 'report',
      via: 'product'
    },
     videos: {
      collection: 'media',
      via: 'product'
    },
    shop: {
      model: 'shop'
    },
     owner:{
      collection: 'user',
      via: 'products_order'
      // through: 'productorder'
    }
  }
};
          
