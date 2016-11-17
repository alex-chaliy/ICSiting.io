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
			console.log(response);
		})
		.error((response) => {
			console.log('Cannot login.');
			console.log(response);
		});
	}
}
loginController.$inject = [
	'$scope',
	'$http',
	'$location'
];

angular.module('app').controller('loginController', loginController);