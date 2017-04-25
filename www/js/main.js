 
var initialize = function() {
    console.log("app initialized!");
    app.run(['exerciseService', 'workoutService', 
        function(exerciseService, workoutService) {
	    // create database if does not exist
	    exerciseService.initializeDB();
	    // insert base data just for sampling application
	    workoutService.createBaseData();
        }
    ]);
}

document.addEventListener("deviceready", initialize, false);
