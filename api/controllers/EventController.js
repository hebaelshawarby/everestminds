/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	 view: function(req,res,next){
   Event.findOne({id:req.param('id')}).exec(function(err,event){
      if(err){
      return res.serverError(err)
    }
    if(event){
     return res.ok(event)   
     } 

  })
 //  Event.findOne({id:req.param('id')}).populate('owner').exec(function(err,event){
 //  		if(err){
 //      return res.serverError(err)
 //    }
 //    res.json(event.owner.id)
 //  	})
  }
	
};


