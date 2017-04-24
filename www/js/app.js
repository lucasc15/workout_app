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
		 	 .state('health', {
		     url: '/health',
		     templateUrl: 'templates/health.html'
		 })
	         .state('progress', {
		     url: '/progress',
		     templateUrl: 'templates/progress.html' 
		 })
		 	 .state('exersize', {
		     url: '/exersize',
		     templateUrl: 'templates/exersize.html' 
		 })
	         .state('workout', {
		     url: '/workout',
		     templateUrl: 'templates/workout.html'
			 
		 })
	         .state('newworkout', {
		     url: '/newworkout',
		     templateUrl: 'templates/newworkout.html'
			 
		 });
	 }]
    );
