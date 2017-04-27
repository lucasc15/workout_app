var getSQLRowsAsArray = function(result) {
    var arr = [];
    for (var i = 0; i < result.rows.length; i++) {
        arr.push(result.rows.item(i));
    }
    return arr;
}

angular.module('workoutApp')
    .controller('exerciseController', ['$scope', 'exerciseService',
        function($scope, exerciseService) {

            $scope.selectedExerciseType = null;
            $scope.newExerciseName = '';
            $scope.exercises = [];
            $scope.exerciseTypes = [];
            $scope.hideNewExerciseForm = true;

            $scope.getExerciseTypes = function() {
                // get exercise types for dropdown to create new exercises
                exerciseService.getExerciseTypes().then(function(result) {
                    $scope.exerciseTypes = getSQLRowsAsArray(result);
                    $scope.exerciseTypeMap = exerciseService.createExerciseTypeMap($scope.exerciseTypes);
                    $scope.selectedExerciseType = $scope.exerciseTypes[0]
                });
            }

            $scope.getExercises = function() {
                // populate table with current exercises
                exerciseService.getExercises().then(function(result) {
                    $scope.exercises = getSQLRowsAsArray(result);
                });
            }

            $scope.addExercise = function() {
                // adds new exercises to the database;
                if ($scope.selectedExerciseType != null) {
                    exerciseService.addExercise(
                        $scope.selectedExerciseType.id,
                        $scope.newExerciseName
                    );
                    $scope.getExercises();
                }
                // $scope.hideNewExerciseForm();
            }

            $scope.getExerciseBodyPart = function(model) {
                return $scope.exerciseTypeMap[model.exerciseType].part;
            }

            $scope.toggleNewExerciseForm = function() {
                // function to hide new data input form
                $scope.hideNewExerciseForm = !$scope.hideNewExerciseForm;
            }

            // pre-populate list of exercises in drop-down menu
            $scope.getExerciseTypes();
            $scope.getExercises();
        }
    ])
    .controller('workoutController', ['$scope', '$q', 'workoutService', 'exerciseService', 'caloryService', 'personalDataService',
    function($scope, $q, workoutService, exerciseService, caloryService, personalDataService) {
            $scope.hideNewExerciseForm = true;
            $scope.hideCardio = true;
            $scope.hideWeight = false;

            $scope.currentWeight = 150;
            $scope.weightExercises = [];
            $scope.cardioExercises = [];
            $scope.exercises = [];
            $scope.exerciseMap = {};
            $scope.exerciseTypes = [];
            $scope.exeriseTypeMap = {};
            $scope.selectedExercise = null;
	    $scope.errors = "";

            $scope.getWeightExercises = function() {
                // retrieve weight exercises;
                workoutService.getCurrentWeightWorkout().then(function(result) {
                    $scope.weightExercises = getSQLRowsAsArray(result);
		    var exercise;
		    for (var i = 0; i < $scope.weightExercises.length; i++) {
			exercise = $scope.exerciseMap[$scope.weightExercises[i].workout];
			$scope.weightExercises[i]['cals'] = caloryService.calculateWeightCalories(
			    $scope.currentWeight, 
			    $scope.weightExercises[i],
			    $scope.exerciseTypeMap[exercise.exerciseType]
			).toFixed(0);
		    }
                });
            }

            $scope.getCardioExercises = function() {
                // retrieve cardio exercises;
                workoutService.getCurrentCardioWorkout().then(function(result) {
                    $scope.cardioExercises = getSQLRowsAsArray(result);
		    var exercise;
		    for (var i = 0; i < $scope.cardioExercises.length; i++) {
			exercise = $scope.exerciseMap[$scope.cardioExercises[i].workout];
			$scope.cardioExercises[i]['cals'] = caloryService.calculateCardioCalories(
			    $scope.currentWeight,
			    $scope.cardioExercises[i],
			    $scope.exerciseTypeMap[exercise.exerciseType]
			).toFixed(0);
		    }
                });
            }

            $scope.getExercises = function() {
                exerciseService.getExercises().then(function(result) {
                    $scope.exercises = getSQLRowsAsArray(result);
                    $scope.exerciseMap = exerciseService.createExerciseMap($scope.exercises);
		    $scope.selectedExercise = $scope.exercises[0];
                });
            }
	
	    $scope.getExerciseName = function(exercise) {
		return $scope.exerciseMap[exercise.workout].name;
	    }

            $scope.getExerciseTypes = function() {
                // retrieve exercise types
                exerciseService.getExerciseTypes().then(function(result) {
                    $scope.exerciseTypes = getSQLRowsAsArray(result);
                    $scope.exerciseTypeMap = exerciseService.createExerciseTypeMap($scope.exerciseTypes);
                });
            }

            $scope.addWorkoutExercise = function() {
                // function to add a new exercise to a workout
                if ($scope.exerciseTypeMap[$scope.selectedExercise.exerciseType].isWeight) {
		    var newReps = Number($scope.newReps);
		    var newSets = Number($scope.newSets);
		    var newWeight = Number($scope.newWeight);
                    if ((!isNaN(newReps) && newReps != 0) && (!isNaN(newSets) && newSets != 0) && (!isNaN(newWeight) && newWeight != 0)) {
                        workoutService.addNewWeightExercise(
                            $scope.selectedExercise.id,
                            newReps,
			    newSets,
                            newWeight
                        );
                    } else {
			$scope.errors = "Improper data, ensure reps, weights, and sets are numbers!";
			return;
		    }
                } else {
		    var newDistance = Number($scope.newDistance);
		    var newTime = Number($scope.newTime);
                    // if the exercise is not a weight, add it as a cardio exercise
                    if ((!isNaN(newDistance) && newDistance != 0) || (!isNaN(newTime) && newTime != 0)) {
			newDistance = newDistance || 0;
			newTime = newTime || 0;
                        workoutService.addNewCardioExercise(
                            $scope.selectedExercise.id,
                            $scope.newDistance,
                            $scope.newTime
                        );
                    } else {
			$scope.errors = "Improper data, ensure time and/or distance are numbers!";
			return;
		    }
                }
                $scope.selectedExercise = $scope.exercises[0];
                $scope.newReps = '';
                $scope.newWeight = '';
		$scope.newSets = '';
                $scope.newDistance = '';
                $scope.newTime = '';
		$scope.notes = '';
		$scope.errors = '';
                $scope.getWeightExercises();
                $scope.getCardioExercises();
            }

            $scope.toggleHideCardio = function() {
		if ($scope.selectedExercise == null) {
		    return false;
		}
                return $scope.exerciseTypeMap[$scope.selectedExercise.exerciseType].isWeight;
            }

            $scope.getCurrentWeight = function() {
                personalDataService.getCurrentWeight().then(function(result) {
		    if (result.rows.length > 0) {
                        $scope.currentWeight = result.rows.item(0).weight;
		    } else {
			$scope.currentWeight = 150;
		    }
                });
            }

	    $scope.showWorkout = function(workout){
		$scope.weightExercisesDetail = [];
		$scope.cardioExercisesDetail = [];
		workoutService.getWeightWorkout(workout.date).then(function(result){
		    $scope.weightExercisesDetail = getSQLRowsAsArray(result);
		    if ($scope.weightExercisesDetail == []) {
			$scope.noWeights = true;
		    } else {
			$scope.noWeights = false;
		    }
		});
		workoutService.getCardioWorkout(workout.date).then(function(result){
		    $scope.cardioExercisesDetail = getSQLRowsAsArray(result);
		    if ($scope.cardioExercisesDetail == []) {
			$scope.noCardio = true;
		    } else {
			$scope.noCardio = false;
		    }
		});
	    } 
	
	    $scope.getWorkoutDates = function() {
		workoutService.getWorkouts().then(function(result) {
		    $scope.workouts = [];
		    for (var i = 0; i < result.rows.length; i++) {
			$scope.workouts.push({ date: result.rows.item(i).date });
		    }
		});
	    }
            $scope.getExerciseTypes();
            $scope.getExercises();
            $scope.getCurrentWeight();
            $scope.getWeightExercises();
            $scope.getCardioExercises();
	    // Lazy, but also loading workout log stuff here
	    $scope.getWorkoutDates();
        }
    ])
    .controller('personalDataController', ['$scope', 'personalDataService',
        function($scope, personalDataService) {
            $scope.currentWeight = 0;
            $scope.personalData = [];
            test = new Date();
            $scope.newDate = test.getFullYear() + '-' + (test.getMonth() + 1) + '-' + test.getDate();
            $scope.getPersonalData = function() {
                // function to retrieve all the personal data points
                personalDataService.getPersonalData().then(function(result) {
                    $scope.personalData = getSQLRowsAsArray(result);
                });
            }

            $scope.addPersonalData = function() {
                // function to add a new personal data to the database
                personalDataService.addPersonalData().then(function(result) {
                    $scope.newDate,
                        $scope.newWeight
                })
                $scope.getPersonalData();
            }
            $scope.getPersonalData();
        }
    ])
    .controller('visualizationController', ['$scope', 'workoutService', 'exerciseService', 'personalDataService',
        function($scope, workoutService, exerciseService, personalDataService) {
            $scope.personalData = [];
            $scope.workouts = [];
            $scope.exerciseTypes = [];
            $scope.exercises = [];
        }
    ]);
