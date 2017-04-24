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
	         .state('newworkout', {
		     url: '/newworkout',
		     templateUrl: 'templates/newworkout.html'
		 });
	 }]
    );
