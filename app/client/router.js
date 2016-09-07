Router.configure({
  layoutTemplate: 'LayoutBase'
});

 var OnBeforeActions;
 var OnAfterActions;
// var RouterHelpers;

//  OnBeforeActions = {
//   /* requires logged in user to show requested route */
//   userRequired: function() {
//     if(!Meteor.userId()) {
//       this.redirect('/');
//       this.next();
//     }
//     else  {
//       this.render('userNavigation', { to: 'userNavigation' });
//       this.next();
//     }
//   },
//   /* redirect to home site if user not already logged in */
//   alreadyLoggedIn: function() {
//     if(Meteor.userId()) {
//       this.redirect('/');
//       this.next();
//     }
//     else
//       this.next();
//   },
//   adminRoleRequired: function() {
//     if( Roles.userIsInRole(Meteor.userId(), 'admin') === false){
//       this.redirect('/');
//       this.next();
//     } else {
//       this.next();
//     }
//   }
// };
//
// OnAfterActions = {
// }

/**
 * default route
 */
Router.route('/', {
  name: 'counter',
  template: 'counter',
  //onBeforeAction: [OnBeforeActions.userRequired],
  subscriptions: function(){
    return [
      //Meteor.subscribe('activeClients'),
      Meteor.subscribe('counterController')
    ];
  },
  action: function() {
    if(this.ready()){
        this.render();
    } else {
      this.render('spinnerCube');
    }
  }
});

/**
 * routes for adminpanel
 */
 Router.route('/adminpanel', {
   name: 'adminpanel',
   template: 'adminpanel',
   subscriptions: function(){
     return [
       //Meteor.subscribe('activeClients'),
       Meteor.subscribe('counterController')
     ];
   },
   action: function() {
     if(this.ready()){
        this.render();
     } else {
        this.render('spinnerCube');
     }
   }
 });

/**
 * general routes
 */
 Router.route('/impressum', function() {
   this.render('impressum');
 });
