'use strict';

let loginController = ($scope, $http, $location) => {
	$scope.login = (userData) => {
		$http({
			method: 'POST',
			url: '/login',
			data: userData
		})
		.success((response) => {
			console.log('Login status: Success.');
		})
		.error(() => {
			console.log('Cannot login.');
		});
	}
}
loginController.$inject = [
	'$scope',
	'$http',
	'$location'
];

angular.module('app').controller('loginController', loginController);