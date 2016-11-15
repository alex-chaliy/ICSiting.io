'use strict';

const app = angular.module('app', ['ngRoute']);

// Routes
let routesConfig = ($routeProvider) => {
	$routeProvider.
		when('/home', {
			templateUrl: 'components/pages/home/home.html',
			controller: 'homeController'
		})
		.when('/users', {
			templateUrl: 'components/pages/users/users.html',
			controller: 'usersController'
		})
		.when('/login', {
			templateUrl: 'components/pages/login/login.html',
			controller: 'loginController'
		})
		.when('/register', {
			templateUrl: 'components/pages/register/register.html',
			controller: 'registerController'
		})
		.otherwise({
			redirectTo: '/home'
		});
}
routesConfig.$inject = ['$routeProvider'];

app.config(routesConfig);