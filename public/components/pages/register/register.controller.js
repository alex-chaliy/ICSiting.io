'use strict';

let registerController = ($scope, $http, $location) => {
	$scope.userData = {};
	$scope.userData.contacts = {};
	$scope.register = (userData) => {
		let expression = (!userData.login ||
						  !userData.password ||
						  !userData.contacts.email ||
						  !userData.name ||
						  !userData.surName);
		if(expression) $scope.loginStatus = 'Не введено одно из обязательных полей.';
		else {
			$scope.loginStatus = '';
			let minLoginWidth = 4;
			let minPasswordWidth = 8;
			let emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			let userEmail = userData.contacts.email;
			let emailCorrect = userEmail.match(emailRegExp);
			if( !emailCorrect ) $scope.loginStatus = 'Неверный формат эл. почты';
			else if( userData.login.length < minLoginWidth ) $scope.loginStatus = 'Короткий логин, мин. число символов ' + minLoginWidth;
			else if( userData.password.length < minPasswordWidth ) $scope.loginStatus = 'Короткий пароль, мин. число символов ' + minPasswordWidth;
			else {
				$scope.loginStatus = '';
				$http({
					method: 'POST',
					url: '/user',
					data: userData
				})
				.success((response) => {
					console.log('Register status: Success.');
					$scope.loginStatus = 'Успешная регистрация';
				})
				.error(() => {
					console.log('Cannot register.');
					$scope.loginStatus = 'Не могу провести регистрацию. ' + 
						'Нет доступа к серверу.';
				});
			}
		}
	}
}
registerController.$inject = [
	'$scope',
	'$http',
	'$location'
];

angular.module('app').controller('registerController', registerController);