'use strict';

let loginController = ($scope, $http, $location, ui) => {
	let loggedUser = Cookies.get('loggedUser') || '{}';
	$scope.loggedUser = JSON.parse(loggedUser);
	console.log('logged user: ' + $scope.loggedUser.name + ', role: ' + $scope.loggedUser.role);

	$scope.ui = ui;

	if($scope.loggedUser.role) location.replace('/#/home');

	$scope.login = (userData) => {
		$http({
			method: 'POST',
			url: '/login',
			data: userData
		})
		.success((response) => {
			console.log('Login status: Success.');
			console.log(response);
			$scope.loginStatus = 'Вы успешно авторизовались.';

			response = JSON.stringify(response);
			Cookies.set('loggedUser', response);

			setTimeout(() => {
				location.replace('/#/news');
			}, 1000);
		})
		.error((response) => {
			console.log('Cannot login.');
			console.log(response);
			$scope.loginStatus = 'Неверный логин или пароль.';
		});
	}
}
loginController.$inject = [
	'$scope',
	'$http',
	'$location',
	'ui'
];

angular.module('app').controller('loginController', loginController);