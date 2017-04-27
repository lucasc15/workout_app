var formatDate = function(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    month = (month < 10) ? '0' + month : month;
    var year = date.getFullYear();
    return year + '-' + month + '-' + day;
}

angular.module('workoutApp')

.factory('DB', function($q, $window) {
    var self = this;
    self.db = null;

    self.init = function() {

	if (window.hasOwnProperty('sqlitePlugin')) {
	    self.db = window.sqlitePlugin.openDatabase({ name: "GainsDB", location: 'default' });
	} else {
	    self.db = $window.openDatabase("GainsDB", '1', 'my', 1024 * 1024 * 100); 
	}

        var query = 'CREATE TABLE IF NOT EXISTS EXERCISETYPES (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, part TEXT, isWeight INTEGER, kBody FLOAT, kLength FLOAT, kDistance FLOAT, kTime FLOAT)';
        var query2 = 'CREATE TABLE IF NOT EXISTS EXERCISES (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, exerciseType integer, FOREIGN KEY(exerciseType) REFERENCES EXERCISETYPES(id))';
        var query3 = 'CREATE TABLE IF NOT EXISTS MYWORKOUT (id INTEGER PRIMARY KEY AUTOINCREMENT, workout integer, reps integer, sets integer, weight integer, notes text, date datetime, FOREIGN KEY(workout) REFERENCES EXERCISES(id))';
        var query4 = 'CREATE TABLE IF NOT EXISTS MYDATA (id INTEGER PRIMARY KEY AUTOINCREMENT, date datetime, weight float)';
        var query5 = 'CREATE TABLE IF NOT EXISTS CARDIO (id INTEGER PRIMARY KEY AUTOINCREMENT, time float, distance float, notes text, date datetime, workout INTEGER, FOREIGN KEY(workout) REFERENCES EXERCISES(id))';
        self.query(query);
        self.query(query2);
        self.query(query3);
        self.query(query4);
        self.query(query5);
	
	self.initBaseData();
    };

    self.query = function(query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();

        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
		console.log(query);
		console.log(error);
                deferred.reject(error);
            });
        });
        return deferred.promise;
    }

    self.insertBaseExerciseTypesData = function() {
	var exerciseTypeData = [
	    ["Bench", "Chest", 1, 0.35, .3, 0, 0],
	    ["Squat", "Legs", 1, 1, 0.5, 0, 0],
	    ["Curls", "Biceps", 1, 1, 0.5, 0, 0],
	    ["Deadlift", "Back", 1, 0.2, 0.3, 0, 0],
	    ["Shoulder Press", "Shoulders", 1, 0.25, 0.35, 0, 0],
	    ["Walk", "Cardio", 0, 0, 0, 62, 411],
	    ["Jog", "Cardio", 0, 0, 0, 82, 617],
	    ["Run", "Cardio", 0, 0, 0, 83, 822],
	    ["General Cardio", "Cardio", 0, 0, 0, 83, 700]
	]
	var sql = "INSERT INTO EXERCISETYPES (name, part, isWeight, kBody, kLength, kDistance, kTime) VALUES (?, ?, ?, ?, ?, ?, ?)";
	for (var i = 0; i < exerciseTypeData.length; i++) {
	    self.query(sql, exerciseTypeData[i]);
	}
    }

    self.insertBaseExerciseData = function() {
	var exerciseData = [
	    ["Bench", "Bench"],
	    ["Squat", "Squat"],
	    ["Curls", "Curls"],
	    ["Deadlift", "Deadlift"],
	    ["Shoulder Press", "Shoulder Press"],
	    ["Walk", "Walk"], 
	    ["Jog", "Jog"], 
	    ["Run", "Run"],
	    ["General Cardio", "General Cardio"]
	];
	var sql = "INSERT INTO EXERCISES (name, exerciseType) VALUES (?, (SELECT id FROM EXERCISETYPES WHERE name = ? LIMIT 1));";
	for (var i = 0; i < exerciseData.length; i++) {
	    self.query(sql, exerciseData[i]);
	}
    }

    self.initBaseData = function() {
	self.query("SELECT * FROM EXERCISETYPES", []).then(function(result){
	    if (result.rows.length <= 0) {
		self.insertBaseExerciseTypesData();
	    }
	});
	self.query("SELECT * FROM EXERCISES", []).then(function(result){
	    if (result.rows.length <= 0) {
		self.insertBaseExerciseData();
	    }
	});
    }
    return self;
})

// exerciseService (get exercise data, add exercise, calculate exercise cals)
.factory('exerciseService', function(DB) {
    var services = {
        getExerciseTypes: function() {
            return DB.query('SELECT * FROM EXERCISETYPES');
        },
	getExercises: function() {
	    return DB.query('SELECT * FROM EXERCISES');
	},
        addExercise: function(exerciseTypePk, name) {
	    return DB.query('INSERT INTO EXERCISES (name, exerciseType) VALUES (?, ?)',
			    [name, exerciseTypePk]); 
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
            return DB.query('SELECT * FROM EXERCISES');
        },
        addExercise: function() {
            DB.query('INSERT INTO EXERCISES (name, exerciseType) SELECT name, id FROM EXERCISETYPES');
        },
        getWorkouts: function() {
	    return DB.query('SELECT DISTINCT date FROM (SELECT date FROM  MYWORKOUT UNION SELECT date FROM CARDIO) a ORDER BY date DESC');
	},
        getWeightWorkout: function(date) {
	    return DB.query('SELECT * FROM MYWORKOUT WHERE date = ?', [date]);
	},
	getCardioWorkout: function(date) {
	    return DB.query('SELECT * FROM CARDIO WHERE date = ?', [date]);
	},
        getCurrentCardioWorkout: function() {
            return DB.query("SELECT * FROM CARDIO WHERE date = date('now', 'localtime')");
        },
        getCurrentWeightWorkout: function() {
            return DB.query("SELECT * FROM MYWORKOUT WHERE date = date('now', 'localtime')");
        },
	addNewWeightExercise: function(exerciseId, reps, sets, weight, notes) {
	    notes = notes || "";
	    var date = formatDate(new Date());
	    DB.query("INSERT INTO MYWORKOUT (date, weight, sets, reps, notes, workout) VALUES (?, ?, ?, ?, ?, ?)",
		     [date, weight, sets, reps, notes, exerciseId]);
	},
	addNewCardioExercise: function(exerciseId, distance, time, notes) {
	    notes = notes || "";
	    var date = formatDate(new Date());
	    DB.query("INSERT INTO CARDIO (date, time, distance, notes, workout) VALUES (?, ?, ?, ?, ?)",
		     [date, time, distance, notes, exerciseId]);
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
            return DB.query('SELECT * FROM MYDATA')
        },
	getCurrentWeight: function() {
	    return DB.query('SELECT weight FROM MYDATA ORDER BY date DESC LIMIT 1');
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
	var cardioKMs = workoutExercise.distance * 0.47 * exerciseType.kDistance * bodyWeight;
	var cardioTime = workoutExercise.time / 60 * 0.47 * exerciseType.kTime * bodyWeight / 100;
	return cardioTime || cardioKMs;
    };

    weightCalories = function(bodyWeight, workoutExercise, exerciseType) {
	var efficiencyFactor = 5 // i.e. 20%
	return workoutExercise.reps * workoutExercise.sets *
	    ( efficiencyFactor * 
	      ((workoutExercise.weight + bodyWeight * exerciseType.kBody) / 2.2 )
	      * 9.81 * exerciseType.kLength * 0.000239006
	    );
    };

    var services = {
        calculateCardioCalories: function(bodyWeight, workoutExercise, exerciseType) {
            return cardioCalories(bodyWeight, workoutExercise, exerciseType);
        },
        calculateWeightCalories: function(bodyWeight, workoutExercise, exerciseType) {
            return weightCalories(bodyWeight, workoutExercise, exerciseType);
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
