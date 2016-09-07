//publish collections to clients
Meteor.publish("counterController", function() {
  return CounterController.find();
});
Meteor.publish("activeClients", function() {
  return ActiveClients.find();
});

//variables
var PRESENTATION_TIME = 60*20; // 20 minutes
//var testusers = Meteor.settings.private.users;


 // Startup
 Meteor.startup(function(){
   if (CounterController.find().count() === 0) {
     CounterController.insert({
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
 });

Meteor.methods({
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
  updateCounterController: function(clientIp, minutes, seconds, overtime){
    var counter = CounterController.findOne();
    //set "master" client
    if(counter.masterIp === "-1"){
      CounterController.update({_id: counter._id},{$set: {masterIp: clientIp}})
    }

    // only let the "master" client sync the time with the server
    if(counter.masterIp === clientIp){
      CounterController.update({_id: counter._id},{$set: {currentMin: minutes, currentSec: seconds, overtime: overtime}})
    }
  }
});
