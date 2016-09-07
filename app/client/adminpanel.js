Template.adminpanel.onRendered(function() {
  $('body').addClass('bg-color-white');
});


Template.adminpanel.helpers({
  clients: function() {
    //return ActiveClients.find();
    return CounterController.find();
  },
  status: function(){
    if(this.startFlag && !this.pauseFlag) return "running";
    else if(this.startFlag && this.pauseFlag) return "paused";
    else return "stopped";
  },
  time: function(){
    if(this.overtime !== "-1"){
      var minutes = this.currentMin;
      var seconds = this.currentSec;
      // adding prefixes
      if(this.overtime){
        if(minutes*-1 < 10) minutes = "0" + minutes*-1;
        else minutes = minutes*-1;
        if(seconds*-1 < 10) seconds = "0" + seconds*-1;
        else seconds = seconds*-1;
        return "-" + minutes + ":" + seconds;
      } else {
        if(minutes < 10) minutes = "0" + minutes;
        else minutes = minutes;
        if(seconds < 10) seconds = "0" + seconds;
        else seconds = seconds;
        return minutes + ":" + seconds;
      }
    }
  }
});


Template.adminpanel.events({
  'click #startBtn': function() {
    // set "start" Bool to true
    if(this.startFlag === false){
      // ActiveClients.update({_id: this._id},{$set: {startFlag: true}});
      // ActiveClients.update({_id: this._id},{$set: {startTime: Date.now()}});
      CounterController.update({_id: this._id},{$set: {startFlag: true}});
      CounterController.update({_id: this._id},{$set: {startTime: Date.now()}});
    }
  },
  'click #pauseBtn': function(){
    // set "pause" bool to true
    // counter started?
    if(this.startFlag === false) sAlert.error("Countdown needs to be started first.");
    else if (this.pauseFlag === false){
      //if counter started it may be paused
      // ActiveClients.update({_id: this._id},{$set: {pauseFlag: true}});
      CounterController.update({_id: this._id},{$set: {pauseFlag: true}});
    } else {
      // ActiveClients.update({_id: this._id},{$set: {pauseFlag: false}});
      CounterController.update({_id: this._id},{$set: {pauseFlag: false}});
    }
  },
  'click #stopBtn': function(){
    // reset start and stop bool
    // ActiveClients.update({_id: this._id},{$set: {startFlag: false, pauseFlag: false}});
    CounterController.update({_id: this._id},{$set: {startFlag: false, pauseFlag: false}});
  }
});
