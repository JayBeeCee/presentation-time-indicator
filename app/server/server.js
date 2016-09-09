//publish collections to clients
Meteor.publish("counterController", function(roomName) {
  return CounterController.find({room: roomName});
});


//variables
var PRESENTATION_TIME = 60*20; // 20 minutes
//var testusers = Meteor.settings.private.users;


 // Startup
 Meteor.startup(function(){
   if(CounterController.find().count() === 0){
     CounterController.insert({
        room: "zuse",
        masterIp: "-1",
        startFlag: false,
        pauseFlag: false,
        startTime: "-1",
        presentationTime: PRESENTATION_TIME,
        currentMin: "-1",
        currentSec: "-1",
        overtime: "-1"
      });
      CounterController.insert({
         room: "turing",
         masterIp: "-1",
         startFlag: false,
         pauseFlag: false,
         startTime: "-1",
         presentationTime: PRESENTATION_TIME,
         currentMin: "-1",
         currentSec: "-1",
         overtime: "-1"
       });
    }
   Meteor.call("checkMasterAvailable");
 });

Meteor.methods({
  checkMasterAvailable: function(){
    Meteor.setInterval(function() {
      //get collection
      var counters = CounterController.find().fetch();
      // get connections
      var users = UserStatus.connections.find().fetch();

      _.each(counters, function(counter){
        var masterActive = false;
        // check if masterClient is connected
        _.each(users, function(user){
          if(user.ipAddr === counter.masterIp){
            masterActive = true;
          }
        },this);
        // in case "master" is not active anymore, set masterIp to default to find new "master"
        if( masterActive === false ){
          CounterController.update({_id: counter._id},{$set: {masterIp: "-1"}});
        }
      }, this);
    }, 1000*10);
  },
  // updateActiveClients: function() {
  //   //get all active clients
  //   var users = UserStatus.connections.find().fetch();
  //   _.each(users, function(user){
  //       if(! ActiveClients.findOne( {clientIp: user.ipAddr})){
  //         ActiveClients.insert({
  //           _id: user._id,
  //           clientIp: user.ipAddr,
  //           startFlag: false,
  //           pauseFlag: false,
  //           startTime: -1,
  //           presentationTime: PRESENTATION_TIME,
  //           currentMin: "-1",
  //           currentSec: "-1",
  //           overtime: "-1"
  //         });
  //       } else if ( ActiveClients.findOne(
  //         {$and: [
  //            {clientIp: user.ipAddr},
  //            {startTime: "-1"}
  //          ]})){
  //         //delete duplicate entry
  //         ActiveClients.remove({clientIp: user.ipAddr});
  //         ActiveClients.insert({
  //           _id: user._id,
  //           clientIp: user.ipAddr,
  //           startFlag: false,
  //           pauseFlag: false,
  //           startTime: -1,
  //           presentationTime: PRESENTATION_TIME,
  //           currentMin: "-1",
  //           currentSec: "-1",
  //           overtime: "-1"
  //         });
  //       }
  //   },this);
  //   return users;
  // },
  // updateClientCounter: function(clientIp, minutes, seconds, overtime){
  //   var client = ActiveClients.findOne( {clientIp: clientIp});
  //   ActiveClients.update({_id: client._id},{$set: {currentMin: minutes, currentSec: seconds, overtime: overtime}})
  // },
  updateCounterController: function(clientIp, roomName, minutes, seconds, overtime){
    //get collection
    var counter = CounterController.findOne({room: roomName});

    //set new "master" client
    if(counter.masterIp === "-1"){
      CounterController.update({_id: counter._id},{$set: {masterIp: clientIp}});
    }

    // only let the "master" client sync the time with the server
    if(counter.masterIp === clientIp){
      CounterController.update({_id: counter._id},{$set: {currentMin: minutes, currentSec: seconds, overtime: overtime}});
    }
  }
});
