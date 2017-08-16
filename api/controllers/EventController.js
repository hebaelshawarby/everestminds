/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
   viewEvent: function(req,res,next){
   Event.findOne({id:req.param('id')}).exec(function(err,event){
    if(err){
      return res.serverError(err)
    }
    if(!event){
     return res.notFound('no event')   
     } 
     res.ok(event)

  })

  },

  viewEvents:function(req,res,next){
    Event.find().exec(function(err,events){
    if(err){
      return res.serverError(err)
    }
    if(!events){
     return res.notFound('no event')   
     } 
     res.ok(events)
    })
  },
  
  viewLatestEvents:function(req,res,next){
    Event.find().sort({start_Date:'desc'}).limit(3).exec(function(err,events){
      if(err){
      return res.serverError(err)
    }
    if(!events){
     return res.notFound('no event')   
     } 
     res.ok(events)
    
    })
  }
  
};


