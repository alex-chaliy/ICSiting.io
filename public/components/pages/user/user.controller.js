'use strict';

let userController = ($scope, $http, $location, $routeParams, ui) => {
	let loggedUser = Cookies.get('loggedUser') || '{}';
	$scope.loggedUser = JSON.parse(loggedUser);
	console.log('logged user: ' + $scope.loggedUser.name + ', role: ' + $scope.loggedUser.role);

	$scope.ui = ui;
	ui.initMaterializeComponents();

	let user_id = $routeParams.user_id;

	$scope.getUser = () => {
		$http({
	        headers: {"Content-Type": "application/json;charset=utf-8"},
			method: 'GET',
			url: '/user/' +  user_id
		})
		.success((response) => {
			$scope.user = response;
		})
		.error((response) => {
			console.log('Cannot get post.');
			location.replace('/#/users');
		});
	}
	$scope.getUser();

	$scope.deleteUser = (userId, token) => {
		$http({
	        headers: {"Content-Type": "application/json;charset=utf-8"},
			method: 'DELETE',
			url: '/user/' + userId,
			data:  {token: token}
		})
		.success((response) => {
			$scope.actionStatus = 'Пользователь успешно удален';
			console.log('Delete User - status: Success.');

			$('#user-' + postId).fadeOut(500);
			setTimeout(() => {
				location.replace('/#/users');
			}, 1000);
		})
		.error((response) => {
			$scope.actionStatus = 'Нет доступа к серверу или нет прав на удаление пользователя';
			console.log('Cannot Delete User.');
			console.log(response);
		});
	}
}
userController.$inject = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	'ui'
];

angular.module('app').controller('userController', userController);