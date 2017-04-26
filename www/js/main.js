 var initialize = function() {
     console.log("app initialized!");
     app.run(function(DB) {
         DB.init();
     });
 }

 document.addEventListener("deviceready", initialize, false);
