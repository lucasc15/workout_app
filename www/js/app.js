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
		 	 .state('exercise', {
		     url: '/exercise',
		     templateUrl: 'templates/exercise.html' 
		 })
	         .state('personal', {
		     url: '/personal',
		     templateUrl: 'templates/personal.html'
			 
		 })
	         .state('newworkout', {
		     url: '/newworkout',
		     templateUrl: 'templates/newworkout.html'
			 
		 });
	 }]
    );
