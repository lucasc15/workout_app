 
angular.module('workoutApp')
.controller('ExerciseController',
    ['$scope', 'exerciseService',
    function($scope, exerciseService) {

	$scope.selectedExercise = null;
	$scope.hideNewExerciseForm = true;

	$scope.getExerciseTypes = function() {
	    // function to get exercise types for drop down
	    $scope.exercises = exerciseService.getExercises();
	    $scope.selectedExercise = $scope.exercises[0];
	}
		     
	$scope.addExercise = function() {
	    // adds new exercises to the database;
	    if ($scope.selectedExercise != null) {
		errors = exerciseService.addExercise($scope.selectExercise);
	    }
	    $scope.selectedExercise = null;
	    $scope.hideNewExerciseForm();
	}

	$scope.toggleNewExerciseForm = function() {
	    // function to hide new data input form
	    $scope.hideNewExerciseForm = !$scope.hideNewExerciseForm;
	}
	
	// pre-populate list of exercises in drop-down menu
	$scope.getExerciseTypes();

    }
])
.controller('workoutController',
	    ['$scope', 'workoutService', 'exerciseService',
	     function($scope, workoutService, exerciseService){
		 $scope.hideNewExerciseForm = true;
		 $scope.hideCardio = true;
		 $scope.hideWeight = false;
		 
		 $scope.exercises = null;
		 $scope.selectedExercise = null;
		 
		 $scope.getExercises = function() {
		     // function to get exercises from database
		     $scope.exercises = exerciseService.getExercises();
		     $scope.selectedExercise = $scope.exercises[0];
		 }

		 $scope.addWorkoutExercise = function() {
		     // function to add a new exercise to a workout
		     if ($scope.selectedExercise.MajorType == 'Weight') {
			 errors = workoutService.addNewExercise(
			     $scope.selectedExercise.Name,
			     $scope.selectedExercise.Type,
			     $scope.newReps,
			     $scope.newWeight
			 );
		     } else {
			 errors = workoutService.addNewExercise(
			     $scope.selectedExercise.Name,
			     $scope.selectedExercise.Type,
			     $scope.newDistance,
			     $scope.newTime
			 );
		     }
		     $scope.selectedExercise = $scope.exercises[0];
		     $scope.newReps = '';
		     $scope.newWeight = '';
		     $scope.newDistance = '';
		     $scope.newTime = '';
		 }
		 
		 $scope.toggleNewExerciseForm = function() {
		     // function to make input of new data visible or not
		     $scope.hideNewExerciseForm = !$scope.hideNewExerciseForm;
		 }

		 $scope.toggleHideCardio = function() {
		     // toggles visibility of new exercise form between weights and cardio
		     $scope.hideCardio = !$scope.hideCardio;
		     $scope.hideWeight = !$scope.hideWeight;
		 }
	     }
])
.controller('personalDataController',
	    ['$scope', 'personalDataService'],
	    function($scope, personalDataService) {
		$scope.hideNewPersonalDataForm = true;
		$scope.personalData = null;
		
		$scope.getPersonalData = function() {
		    // function to retrieve all the personal data points
		    $scope.personalData = personalDataService.getPersonalData();
		}
		
		$scope.addPersonalData = function() {
		    // function to add a new personal data to the database
		    errors = personalDataService.addPersonalData(
			$scope.newDate, 
	 		$scope.newWeight
		    );
		    $scope.newDate = Date();
		}
	    }
])
.controller('visualizationController',
	    ['$scope', 'workoutService', 'exerciseService', 'personalDataService'],
	    function($scope, workoutService, exerciseService, personalDataService) {
	    }
]);
