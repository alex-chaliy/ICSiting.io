'use strict';

let registerController = ($scope, $http, $location) => {
	$scope.userData = {};
	$scope.userData.contacts = {};
	$scope.register = (userData) => {
		console.log(userData);
		$http({
			method: 'POST',
			url: '/user',
			data: userData
		})
		.success((response) => {
			console.log('Register status: Success.');
		})
		.error(() => {
			console.log('Cannot register.');
		});
	}
}
registerController.$inject = [
	'$scope',
	'$http',
	'$location'
];

angular.module('app').controller('registerController', registerController);