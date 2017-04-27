var express = require('express');
var router = express.Router();
var cyclists = require('./../model/Cyclist.js')

//get all the cyclists
router.get('/cyclists', function (req, res, next) {  
    cyclists.find({}).exec(function (err, cyclist) {
      if (err) throw err;
      res.json(cyclist);
    }); 
});
//get cyclist
router.get('/cyclists/:member_id', function (req, res, next) {  
  cyclists.findOne({'member.member_id': req.params.member_id }).exec(function (err, data) {
    console.log(req.params.member_id);
    if (err)  throw err;
    res.json({data});
  });
});
//get all the clubs for a cyclist based on location
router.get('/cyclists/club/:latitude/:longitude', function (req, res, next) {
  //cyclists.createIndex({'location': '2dsphere'});
  //console.log(req);
  var query = [
        {"$group" : {
            _id:"$member.clubs.name",
            //cname:{ $addToSet: "$member.clubs.name"},
          }
        }
    ];
    cyclists.aggregate(query)   
        .exec((err, clubs) => {
            if(err) throw err;
            let clubnames =[];
            //res.json(clubs)
            for(let clubn of clubs)
              for(let club of clubn._id)
               if(club) clubnames.push(club)  
             var club_names = Array.from(new Set(clubnames))
             res.json(club_names)
        });
});

//create new cyclist
router.post('/cyclist/newCyclist', function (req, res, next) {
  var cyclist = new cyclists({
   member: {
      name: req.body.name,          
      phone: req.body.phone,
      member_id: req.body.member_id,
      img: req.body.img,
      location: {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        city: req.body.city,
        state: req.body.state
      }
    },
    clubs: {
      name: null,
      location: {
        latitude: 0,
        longitude: 0,
        city: null,
        state: null
      },
      img: null,
      events: [{
        name: null,
        start_location: {
          latitude: 0,
          longitude: 0
        },
        end_location: {
          latitude: 0,
          longitude: 0
        },
        date: null,
        owner: {
          memeber_id: null,
          member_name: null
        },
        status: null,
        flag: {
          isSet: false
        }
      }],
      announcements: [
        {
          title: null,
          date: null,
          message: null
        }
      ]
    },
    messages: [
      {
        conversation_id: null,
        recipient: {
          memeber_id: null
        },
        message: null,
        sentAt: null
      }
    ]
  });
  

  cyclists.save(function (err, cyclist) {
    if (err) throw err;
    res.json(cyclist);
  });

});

//create a new event
router.post('/cyclist/clubs/events/:member_id', function (req, res, next) {  
  let event = {
    name: req.body.name,
    start_location: {
      latitude: req.body.start_location.latitude,
      longitude: req.body.start_location.longitude
    },
    end_location: {
      latitude: req.body.end_location.latitude,
      longitude: req.body.end_location.longitude
    },
    date: req.body.date,
    owner: {
      member_id: req.body.member_id,
      member_name: req.body.member_name
    }
  }
  cyclists.findOneAndUpdate({ 'member.member_id': req.body.member_id, 'member.clubs.name': req.body.club_name },
  { '$push': { 'member.clubs.$.events': event } }, function (err, cyclist) {
      if (err) {
      throw err;
    } else {
      res.json({success: true});
    }
  });
});
//create new club for a user
router.post('/cyclist/newClub/:member_id', function (req, res, next) {
  var club = {
    name: req.body.name,
    img: req.body.img,
    location: {
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
      city: req.body.city,
      state: req.body.state
    }
  };
  cyclists.findOneAndUpdate({ 'member.member_id': req.body.member_id },
      {'$push': {'member.clubs': club } }, function (err, data) {
    if (err) {
      throw err;      
    } else {
     res.json({success: true});
    }
  });
});

//delete club using clubId
router.get('/cyclist/delete/club/:name', function (req, res, next) {
    cyclists.update({ 'member.clubs.name': req.params.name }, { '$unset': { 'member.clubs': 1 } }, function (err, updated) {
    if (err) throw err;
    console.log('Club successfully deleted!');
    res.json({success: true});
  });
});

//delete cyclist
router.get('/cyclist/delete/member/:member_id', function (req, res, next) {
  cyclists.findOneAndRemove({ 'member.member_id': req.params.member_id }, function (err) {
    if (err) throw err;
    console.log('member successfully deleted!');
    res.json({success: true});
  });
});

//get club
router.get('/cyclists/clubs/:name', function (req, res, next) {
  cyclists.find({ 'member.clubs.name': req.params.name }).exec(function (err, data) {
    if (err) throw err;
    res.json( data);
  });
});
//get clubs for a member
router.get('/cyclists/clubs/member/:member_id', function (req, res, next) {
  cyclists.find({ 'member.member_id': req.params.member_id }, {'member.clubs': 1, '_id': 0}).exec(function (err, data) {
    if (err) throw err;
    res.json(data);
    });
});
//create new announcement 
router.post('/cyclists/clubs/newAnnouncement/', function(req, res, next){
  var announcement = {        
          title: req.body.title,
          date: req.body.date,
          message: req.body.message        
      }

  cyclists.findOneAndUpdate({ 'member.member_id': req.body.member_id, 'member.clubs.name': req.body.club_name}, 
    { '$push': { 'member.clubs.$.announcements' : announcement } }, function (err, data) {
    if (err) {
      throw err;
    } else {
      res.json({success: true});
    }
  });
});



//get events for a given user based on current location
router.get('/cyclists/events/?latitude&longitude', function (req, res, next) {
  cyclists.createIndex({ 'location': '2dsphere' });
  cyclists.find({
    'location': {
      '$near': {
        '$geometry': { type: 'Point', coordinates: [req.params.latitude, req.params.longitude] },
        '$maxDistance': 2000
      }
    }
  }, function (err, events) {
    if (err) {
      throw err;     
    } else {
      res.json({ events: events, success: true });
    }
  }).limit(10);
});

//delete an event for user
// router.get('/cyclist/clubs/events/delete/:name', function (req, res, next) {
//   console.log(req.params.name);
//   cyclists.update({ "$pull": {"member.clubs.events.name": req.params.name}}, function (err) {
//     if (err) throw err;
//     console.log('Event successfully deleted!');
//     res.json({success: true});   
//   });
// });

//get events for a given user
router.get('/cyclists/clubs/events/:member_id', function (req, res, next) {
  cyclists.find({ 'member.member_id': req.params.member_id, }, { 'member.clubs.events': 1, '_id': 0}).exec(function (err, data) {
    if (err) throw err;// res.json('event', { success: false });
    res.json(data);
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////
//get all the messages
router.get('/cyclists/messages/:conversation_id', function (req, res, next) {
  cyclists.find({'member.messages.conversation_id': conversation_id}).exec(function (err, message) {    
    if (err) throw err;
    if(message != null){
       res.json(message);    
    }else{
       res.json({success: false});
    }
  });
});

//create a new message for a user
router.post('/cyclists/messages/newMessage/:memeber_id', function (req, res, next) {
  let message = {   
    conversation_id: req.body.conversation_id,
    recipient: {
      memeber_id: req.body.recipient.member_id,      
    },
    message: req.body.message,
    sentAt:req.body.sentAt
  }
 
  cyclist.findOneAndUpdate({'member.member_id': req.params.member_id ,'member.messages.conversation_id': req.body.conversation_id}, 
        { 'messages': {'$addToset': this.message} }, function (err, cyclist) {
    if (err) {
      res.json({ success: false});
    } else {
      res.json({success : true});
     
    }
  });
});
//searchs clubs by name
router.get('/search/clubs/:name', function(req, res, next) {
    club_name = req.params.name;
    
    cyclists.find({'member.clubs.name':club_name}).exec(function (err, cyclist) {
      if (err) throw err;
      console.log(cyclist.length);
      res.json(cyclist);
    }); 
    // var query = [
    //     {"$match": {"member.clubs.name" : name }},
    //     {"$group" : {
    //         _id:"$member.clubs.name"
    //       }
    //     },
    //     {"$project":{_id:0,
    //                  club_name:"$_id"}
    //                }
    // ];
    // cyclists.aggregate(query)   
    //     .exec((err, clubs) => {
    //         if(err) throw err;

    //         res.setHeader('Content-Type', 'application/json');
    //         res.json(clubs);
    //     });
});
// searchs clubs by number of members
router.get('/search/clubs/numberOfMembers', function(req, res, next) {
    
    var query = [
        
        {"$group" : {
            name:"$member.clubs.name",num_members:{"$sum":1}
          }
        },
        {"$project":{_id:0,
                    club_name:"$name",
                    num_members:"$num_members"}

                  }
    ];
    cyclists.aggregate(query)   
        .exec((err, clubs) => {
            if(err) throw err;

            res.setHeader('Content-Type', 'application/json');
            res.json(clubs);
        });
});


module.exports = router;
