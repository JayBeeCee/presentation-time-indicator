// holds counter controlls for clients (ip based?)
CounterController = new Mongo.Collection("counterController");
// holds active clients
ActiveClients = new Mongo.Collection("activeClients");

// ActiveClients.allow({
//    update: function () {
//        return true;
//   }
// });
CounterController.allow({
   update: function () {
       return true;
  }
});
