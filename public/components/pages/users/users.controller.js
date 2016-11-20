'use strict';

let usersController = ($scope, $http, $location, ui) => {
	let loggedUser = Cookies.get('loggedUser') || '{}';
	$scope.loggedUser = JSON.parse(loggedUser);
	console.log('logged user: ' + $scope.loggedUser.name + ', role: ' + $scope.loggedUser.role);

	// include ui in scope to get access from template
	$scope.ui = ui;

	$scope.getUsers = () => {
		$http({
			method: 'GET',
			url: '/users'
		})
		.success((response) => {
			$scope.users = response;
		});
	}
	$scope.getUsers();
}
usersController.$inject = [
	'$scope',
	'$http',
	'$location',
	'ui'
];

angular.module('app').controller('usersController', usersController);