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
                exerciseService.getExercises().then(function(result) {
                    $scope.exerciseTypes = exerciseService.parseExerciseTypes(result);
                    $scope.selectedExerciseType = $scope.exerciseTypes[0]
                });
            }

            $scope.getExercises = function() {
                // populate table with current exercises
                exerciseService.getExercises().then(function(result) {
                    $scope.exercises = exerciseService.parseExercises(result);
                });
            }

            $scope.addExercise = function() {
                // adds new exercises to the database;
                if ($scope.selectedExerciseType != null) {
                    exerciseService.addExercise(
                        $scope.selectedExerciseType.pk,
                        $scope.newExerciseName;
                    );
                    $scope.getExercises();
                }
                // $scope.hideNewExerciseForm();
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
    .controller('workoutController', ['$scope', 'workoutService', 'exerciseService', 'caloryService', 'personalDataService'

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
                exerciseService.getCurrentWeightWorkout().then(function(result) {
                    $scope.weightExercises = workoutService.parseWorkoutExercises(result);
                });
            }

            $scope.getCardioExercises = function() {
                // retrieve cardio exercises;
                workoutService.getCurrentCardioWorkout().then(function(result) {
                    $scope.cardioExercises = workoutService.parseWorkoutExercises(result);
                });
                // TODO calculate calories + add to each exercise;
                // TODO get name from exercise map and add to each exercise;
            }

            $scope.getExercises = function() {
                exerciseService.getExercises().then(function(result) {
                    $scope.exercises = exerciseService.parseExercises(result);
                    $scope.exerciseMap = exerciseService.createExerciseMap($scope.exercises);
                });
                // TODO calculate calories + add to each exercise
                // TODO get name from exercise map and add to each exercise;
            }

            $scope.getExerciseTypes = function() {
                // retrieve exercise types
                exerciseService.getExerciseTypes().then(function(result) {
                    $scope.exerciseTypes = exerciseService.parseExercises(result);
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
                        $scope.currentWeight = result.rows.item(0)[1] || 75;
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
    .controller('personalDataController', ['$scope', 'personalDataService'],
        function($scope, personalDataService) {
            $scope.currentWeight = 0;
            $scope.personalData = [];
            $scope.newDate = Date();

            $scope.getPersonalData = function() {
                // function to retrieve all the personal data points
                personalDataService.getPersonalData().then(function(result) {
                    $scope.personalData = personalDataService.parsePersonalData(result);
                    $scope.currentWeight = $scope.personalData[0];
                });
                $scope.personalData = personalDataService.getPersonalData();
            }

            $scope.addPersonalData = function() {
                // function to add a new personal data to the database
                personalDataService.addPersonalData(
                    $scope.newDate,
                    $scope.newWeight
                );
                $scope.newDate = Date();
            }

            $scope.getPersonalData();
        }
    ])
.controller('visualizationController', ['$scope', 'workoutService', 'exerciseService', 'personalDataService'],
function($scope, workoutService, exerciseService, personalDataService) {
    $scope.personalData = [];
    $scope.workouts = [];
    $scope.exerciseTypes = [];
    $scope.exercises = [];
}
]);