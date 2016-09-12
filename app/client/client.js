Meteor.startup(function() {
  // start Counter
  setInterval(counter, 1000);
  //alert configuration
  sAlert.config({
    effect: 'stackslide',
    position: 'top-right',
    timeout: 4000,
    html: true,
    onRouteClose: false,
    stack: true,
    offset: 30, // in px - will be added to first alert (bottom or top - depends of the position in config)
    beep: false,
    onClose: _.noop //
  });

});

// variables
var start, diff, pause, timePassed, pausedTime=0;
var slaveClient = false;
var presentationTime = 60*20; // default = 20 minutes
minutes = presentationTime/60;
Session.set('overtimeFlag', false)
Session.set('minutes', minutes);
Session.set('seconds', 0);
Session.set('startTime', "-1");

function counter () {
  // Counter started and not paused
  if(Session.get('startFlag')===true  &&  Session.get('pauseFlag')===false  &&  Session.get('startTime')!==-1){
    //PRESENTATION_TIME = Session.get('presentationTime');
    // get the number of seconds that have elapsed since
    // the counter started
    timePassed = (((Date.now() - Session.get('startTime')) / 1000) | 0);
    //add paused time to presentation time
    presentationTime = presentationTime + pausedTime;
    //diff = time passed
    diff = (presentationTime) - timePassed;

    // truncates the float
    minutes = (diff / 60) | 0;
    seconds = (diff % 60) | 0;
    pausedTime = 0;

    if (diff <= 0) {
        // add one second so that the countdown starts at the full duration
        // example 05:00 not 04:59
        start = Date.now() + 1000;
    }
    // save minutes and seconds in Session variable to display on screen
    // only do this for master client
    // slaveClient will use time from server
    if(slaveClient === false){
      // times up -> overtimeFlag will be set once
      if(Session.get('overtimeFlag') === false){
        seconds < 0 ? Session.set('overtimeFlag', true) : Session.set('overtimeFlag', false);
      }
      Session.set('minutes', minutes);
      Session.set('seconds', seconds);
    }

    // Counter stopped
  } else if(Session.get('startFlag')===false  &&  Session.get('pauseFlag')===false){
    presentationTime = Session.get('presentationTime');
    minutes = presentationTime/60;
    Session.set('minutes', minutes);
    Session.set('seconds', 0);
    Session.set('overtimeFlag', false);
    minutes = 0;
    seconds = 0;
    diff = 0;
    $('body').addClass('bg-color-grey').removeClass('bg-color-red').removeClass('bg-color-yellow').removeClass('bg-color-black');

    //counter paused
  } else if(Session.get('pauseFlag')===true) {
    pausedTime = (((Date.now() - Session.get('startTime')) / 1000) | 0) - timePassed + 1;
  }
}

// check Status of service to display correct button-style
Template.counter.helpers({
  paused: function(){
    if(Session.get('pauseFlag') === true){
      return "PAUSED";
    } else {
      return "Remaining presentation time in minutes:";
    }
  },
  seconds: function() {
    seconds = Session.get('seconds');
    // set prefixes
    if(Session.get('overtimeFlag')){
      return seconds*-1 < 10 ?  "0" + seconds*-1 : seconds*-1;
    } else {
      return seconds < 10 ? "0" + seconds : seconds;
    }
  },
  minutes: function (){
    var minutes = Session.get('minutes');

    // set background-color depending on minutes and overtime
    if(Session.get('overtimeFlag')){
      $('body').addClass('bg-color-red').removeClass('bg-color-yellow');
    } else if (minutes < 5){
      $('body').addClass('bg-color-yellow').removeClass('bg-color-red');
    } else{
      $('body').addClass('bg-color-black').removeClass('bg-color-yellow').removeClass('bg-color-red').removeClass('bg-color-grey');
    }

    //set prefixes
    if(Session.get('overtimeFlag')){
      //return minutes*-1 < 10 ?  minutes*-1 : minutes*-1;
      return minutes*-1
    } else {
      //return minutes < 10 ? "0" + minutes : minutes;
      return minutes;
    }
  },
  sign: function(){
    // display algebraic sign
    return Session.get('overtimeFlag') ? "-" : "";
  },
  fontColor: function(){
    // change font-color depending on remaining time
    return Session.get('minutes') < 5 ? "font-black" : "font-white";
  },
  controller: function(){
    var clientIpAddr = headers.getClientIP();
    //read room from URL (data from router)
    var roomName = this.toString();
    Session.set('clientIp',clientIpAddr);
    //return ActiveClients.findOne({clientIp: clientIpAddr})
    //var controller = ActiveClients.findOne({clientIp: clientIpAddr});
    var controller = CounterController.findOne({room: roomName});
    Session.set('startFlag', controller.startFlag);
    Session.set('pauseFlag', controller.pauseFlag);
    Session.set('startTime', controller.startTime);
    Session.set('presentationTime', controller.presentationTime);

    //Meteor.call("updateClientCounter", clientIpAddr, Session.get('minutes'), Session.get('seconds'), Session.get('overtimeFlag'), function(){})
    if(clientIpAddr === controller.masterIp || controller.masterIp === "-1"){
      Meteor.call("updateCounterController", clientIpAddr, roomName, Session.get('minutes'), Session.get('seconds'), Session.get('overtimeFlag'), function(){})
    }
    //if slave client -> set flag to true
    if(clientIpAddr !== controller.masterIp && controller.masterIp !== "-1"){
      Session.set('minutes', controller.currentMin);
      Session.set('seconds', controller.currentSec);
      Session.set('overtimeFlag', controller.overtime);
      slaveClient = true;
    }

    return "";
  }
});

Template.LayoutBase.helpers({
  clientIp: function(){
    return Session.get('clientIp');
  }
});

// spinner
Meteor.Spinner.options = {
    lines: 10, // The number of lines to draw
    length: 5, // The length of each line
    width: 4, // The line thickness
    radius: 8, // The radius of the inner circle
    corners: 0.7, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb
    speed: 0.5, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

Template.spinnerCube.onRendered( function(){
  //display loading spinnerCube after 100ms (prevents flashing appearance)
  setTimeout(function(){
    $('#loadingHider').removeClass('hidden').addClass('show');
  }, 100);
})
