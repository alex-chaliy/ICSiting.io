'use strict';

const app = angular.module('app', ['ngRoute']);

// Routes
let routesConfig = ($routeProvider) => {
	$routeProvider.
		when('/admin', {
			templateUrl: 'components/pages/admin/admin.html',
			controller: 'adminController'
		})
		.when('/home', {
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
		.when('/news', {
			templateUrl: 'components/pages/news/news.html',
			controller: 'newsController'
		})
		.when('/post', {
			templateUrl: 'components/pages/post/post.html',
			controller: 'postController'
		})
		.otherwise({
			redirectTo: '/home'
		});
}
routesConfig.$inject = ['$routeProvider'];

app.config(routesConfig);