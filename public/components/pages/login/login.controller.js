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
			$scope.loginStatus = 'Вы успешно авторизовались.';

			response = JSON.stringify(response);
			Cookies.set('loggedUser', response);
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
	'$location'
];

angular.module('app').controller('loginController', loginController);