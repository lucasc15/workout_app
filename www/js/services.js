angular.module('workoutApp')

.factory('DB', function($q) {
    var self = this;
    self.db = null;

    self.init = function() {
        document.addEventListener('deviceready', function() {
            self.db = window.sqlitePlugin.openDatabase(GainsDB.name, "1.0", "Gains Database", 200000);
        });
        errorCB = function(err) {
            alert("Error processing SQL: " + err.code);
        };
        populateDB = function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS EXERCISETYPES (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, part text, kWeight float, kReps float, kSets float, kDistance float, kTime float, kBodyWeight, calories float)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS EXERCISES (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, exerciseType integer, FOREIGN KEY(exerciseType) REFERENCES EXERCISETYPES(id))');
            tx.executeSql('CREATE TABLE IF NOT EXISTS MYWORKOUT (id INTEGER PRIMARY AUTOINCREMENT, workout integer, FOREIGN KEY(workout) REFERENCES EXERCISES(id), reps integer, sets integer, weight integer, notes text, date datetime)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS MYDATA (id INTEGER PRIMARY AUTOINCREMENT, date datetime, weight float)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS CARDIO (id INTEGER PRIMARY AUTOINCREMENT, time float, distance float, notes text, date datetime)');
        };
        self.db.transaction(populateDB, errorCB);
    };
    return self;
})

// exerciseService (get exercise data, add exercise, calculate exercise cals)
.factory('exerciseService', function(DB) {
    var services = {
        getExercise: function() {
            return DB.executeSql('SELECT * FROM EXERCISETYPES');
        },
        addExercise: function() {

        },
        parseExercises: function(result) {
            var exercises = [];
            var item;
            for (var i = 0; i < result.rows.length; i++) {
                item = result.rows.item(i);
                exercises.push({
                    id: item[0],
                    name: item[1],
                    exerciseType: item[2]
                });
            }
            return exercises
        },
        parseExerciseTypes: function(result) {
            var exerciseTypes = [];
            var item;
            for (var i = 0; i < result.rows.length; i++) {
                item = result.rows.item(i);
                exerciseTypes.push({
                    id: item[0],
                    name: item[1],
                    part: item[2],
                    isWeight: item[3],
                    weightConstant: item[4],
                    repConstant: item[5],
                    setConstant: item[6],
                    distanceConstant: item[7],
                    timeConstant: item[8],
                    caloryConstant: item[9],
                });
            }
            return exerciseTypes
        },
        createExerciseTypeMap: function(exerciseTypes) {
            exerciseTypeMap = {};
            for (var i = 0; i < exerciseTypes.length; i++) {
                exerciseTypeMap[exerciseTypes[i].id] = exerciseTypes[i];
            }
            return exerciseTypeMap;
        },
        createExerciseMap: function(exercises) {
            exerciseMap = {};
            for (var i = 0; i < exercises.length; i++) {
                exerciseMap[exercises[i].id] = exercises[i];
            }
            return exerciseMap;
        }
    };
    return services
})

// workoutService(get exercises, add exercises, save workout)
.factory('workoutService', function(DB) {
    var services = {
        getExercise: function() {
            return DB.transaction('SELECT * FROM EXERCISES');
        },
        addExercise: function() {
            DB.transaction('INSERT INTO EXERCISES (name, exerciseType) SELECT name, id FROM EXERCISETYPES');
        },
        getWorkouts() {},
        getWorkout(date) {},
        getCurrentCardioWorkout: function() {
            return DB.transaction("SELECT * FROM CARDIO WHERE date = date('now')")
        },
        getCurrentWeightWorkout: function() {
            return DB.transaction("SELECT * FROM MYWORKOUT WHERE date = date('now')")
        },
        parseWorkoutWeightExercises: function(result) {
            var workoutExercises = [];
            var item;
            for (var i = 0; i < result.rows.length; i++) {
                item = result.rows.item(i);
                workoutExercises.push({
                    id: item[0],
                    exercise: item[1],
                    reps: item[2],
                    sets: item[3],
                    weight: item[4],
                    notes: item[5],
                    date: item[6]
                });
            }
            return workoutExercises;
        },
        parseWorkoutCardioExercises: function(result) {
            var workoutExercises = [];
            var item;
            for (var i = 0; i < result.rows.length; i++) {
                item = result.rows.item(i)
                workoutExercises.push({
                    id: item[0],
                    time: item[1],
                    distance: item[2],
                    notes: item[3]
                });
            }
            return workoutExercises;
        }
    };
    return services
})

// personalDataService(add weight data, get weight data)
.factory('personalDataService', function(DB) {
    var services = {
        addWeight: function() {
            DB.transaction('INSERT INTO MYDATA (date, weight) VALUES ()')
        },
        getWeight: function() {
            return DB.transaction('SELECT * FROM MYDATA')
        },
        parsePersonalData: function(result) {
            var personalData = [];
            var item;
            for (var i = 0; i < result.rows.length; i++) {
                item = result.rows.item(i);
                personalData.push({
                    id: item[0],
                    date: item[1],
                    weight: item[2]
                });
            }
            return personalData;
        }
    };
    return services
})

.factory('caloryService', function() {
    cardioCalories = function(bodyWeight, workoutExercise, exerciseType) {
        return (
            (workoutExercise.distance * exerciseType.kDistance +
                workoutExercise.time * exerciseType.kTime) * exerciseType.kCalories
        ) * (bodyWeight * exerciseType.kBodyWeight);
    };

    weightCalories = function(bodyWeight, workoutExercise, exerciseType) {
        return (
            (workoutExercise.weight * exerciseType.kWeight +
                workoutExercise.reps * exerciseType.kReps +
                workoutExercise.sets * exerciseType.kSets) * exerciseType.kCalories
        ) * (bodyWeight * exerciseType.kBodyWeight);
    };

    var services = {
        calculateCardioCalories: function(bodyWeight, workoutExercise, exerciseType) {
            return cardioCalories(bodyWeight, workoutExercise, exerciseType);
        },
        calculateWeightCalories: function(bodyWeight, workoutExercise, exerciseType) {
            return weightCalories(bodyweight, workoutExercise, exerciseType);
        },
        calculateTotalCalories: function(bodyWeight, exercises, exerciseTypeMap) {
            var totalCalories = 0;
            var exerciseType;
            for (var i = 0; i < exercises.length; i++) {
                exerciseType = exerciseTypeMap[exercises.exerciseType];
                if (exerciseType.isWeight) {
                    totalCalories += weightCalories(bodyWeight, exercises[i], exerciseType);
                } else {
                    totalCalories += cardioCalories(bodyWeight, exercises[i], exerciseType);
                }
            }
            return totalCalories;
        }
    }
    return services;
});
