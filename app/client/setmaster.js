Template.setmaster.onRendered(function() {
  $('body').addClass('bg-color-white');
});



Template.setmaster.helpers({
  master: function() {
    //get counterController collection for room
    var roomName = this.toString();
    console.log(roomName);
    var counter = CounterController.findOne({room: roomName});
    var newMasterIp = headers.getClientIP();

    console.log(counter._id);
    //console.log(UserStatus.connections.find().fetch())

    //set masterIP if not set already
    if(counter.masterIP !== newMasterIp){
      CounterController.update({_id: counter._id},{$set: {masterIp: newMasterIp}});
    }
    return "This client with IP: " + newMasterIp + " is now master.";
  }
});
