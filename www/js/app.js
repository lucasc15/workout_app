var app = angular.module('workoutApp', ['ui.router'])
    .run(function(DB) {
	 console.log("DB: " + DB);
         DB.init();
     })
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {

                $urlRouterProvider.otherwise('/home');

                $stateProvider
                    .state('home', {
                        url: '/home',
                        templateUrl: 'templates/home.html',
                    })
                    .state('health', {
                        url: '/health',
                        templateUrl: 'templates/health.html'
                    })
                    .state('inspiration', {
                        url: '/inspiration',
                        templateUrl: 'templates/inspiration.html'
                    })
                    .state('exercise', {
                        url: '/exercise',
                        templateUrl: 'templates/exercise.html',
                        controller: 'exerciseController'
                    })
                    .state('personal', {
                        url: '/personal',
                        templateUrl: 'templates/personal.html',
                        controller: 'personalDataController'
                    })
                    .state('newworkout', {
                        url: '/newworkout',
                        templateUrl: 'templates/newworkout.html',
                        controller: 'workoutController'
                    })
                    .state('workouts', {
                        url: '/workouts',
                        templateUrl: 'templates/workout.html',
                        controller: 'workoutController'
                    });
            }
        ]
    );
