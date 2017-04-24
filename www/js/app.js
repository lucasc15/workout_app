var app = angular.module('workoutApp', ['ui.router'])
    .config(
	['$stateProvider', '$urlRouterProvider',
	 function ($stateProvider, $urlRouterProvider) {

	     $urlRouterProvider.otherwise('/home');

	     $stateProvider
	         .state('home', {
		     url: '/home',
		     templateUrl: 'templates/home.html',
		 })
	         .state('new-workout', {
		     url: '/new-workout',
		     templateUrl: 'templates/new-workout.html'
		 });
	 }]
    );
