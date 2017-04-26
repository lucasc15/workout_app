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
    .controller('workoutController', ['$scope', 'workoutService', 'exerciseService', 'caloryService', 'personalDataService',
        function($scope, workoutService, exerciseService, caloryService, personalDataService) {
            $scope.hideNewExerciseForm = true;
            $scope.hideCardio = true;
            $scope.hideWeight = false;

            $scope.currentWeight = 75;
            $scope.weightExercises = [];
            $scope.cardioExercises = [];
            $scope.exercises = [];
            $scope.exerciseMap = {};
            $scope.exerciseTypes = [];
            $scope.exeriseTypeMap = {};
            $scope.selectedExercise = null;

            $scope.getWeightExercises = function() {
                // retrieve weight exercises;
                workoutService.getCurrentWeightWorkout().then(function(result) {
                    $scope.weightExercises = result;
                });
            }

            $scope.getCardioExercises = function() {
                // retrieve cardio exercises;
                workoutService.getCurrentCardioWorkout().then(function(result) {
                    $scope.cardioExercises = result;
                });
                // TODO calculate calories + add to each exercise;
                // TODO get name from exercise map and add to each exercise;
            }

            $scope.getExercises = function() {
                exerciseService.getExercises().then(function(result) {
                    $scope.exercises = result;
                    $scope.exerciseMap = exerciseService.createExerciseMap($scope.exercises);
                });
                // TODO calculate calories + add to each exercise
                // TODO get name from exercise map and add to each exercise;
            }

            $scope.getExerciseTypes = function() {
                // retrieve exercise types
                exerciseService.getExerciseTypes().then(function(result) {
                    $scope.exerciseTypes = result;
                    $scope.exerciseTypeMap = exerciseService.createExerciseTypeMap($scope.exerciseTypes);
                });
            }

            $scope.addWorkoutExercise = function() {
                // function to add a new exercise to a workout
                if ($scope.exerciseTypeMap[$scope.selectedExercise.isWeight]) {
                    // TODO find out how to ensure this is a number;
                    if ($scope.newReps != 0) {
                        workoutService.addNewExercise(
                            $scope.selectedExercise.Name,
                            $scope.selectedExercise.id,
                            $scope.newReps,
                            $scope.newWeight
                        );
                    }
                } else {
                    // if the exercise is not a weight, add it as a cardio exercise
                    if ($scope.newDistance != 0) {
                        // TODO ensure newDistance and newTime are valid input!
                        workoutService.addNewCardioExercise(
                            $scope.selectedExercise.id,
                            $scope.newDistance,
                            $scope.newTime
                        );
                    }
                }
                $scope.selectedExercise = $scope.exercises[0];
                $scope.newReps = '';
                $scope.newWeight = '';
                $scope.newDistance = '';
                $scope.newTime = '';
                $scope.getWeightExercises();
                $scope.getCardioExercises();
            }

            $scope.toggleHideCardio = function() {
                // hide cardio if the selected exercise type is 
                return $scope.exerciseTypeMap[$scope.selectedExercise.exerciseType].isWeight;
            }

            $scope.getCurrentWeight = function() {
                    personalDataService.getCurrentWeight().then(function(result) {
                        if (result.rows.length > 0) {
                            $scope.currentWeight = result.rows.item(0).weight;
                        } else {
                            $scope.currentWeight = 75;
                        }
                    });
                }
                // Controller init to get data;
            $scope.getExerciseTypes();
            $scope.getExercises();
            $scope.getCurrentWeight();
            $scope.getWeightExercises();
            $scope.getCardioExercises();
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