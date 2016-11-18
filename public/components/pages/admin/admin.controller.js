'use strict';

let adminController = ($scope, $http, $location) => {
	let loggedUser = Cookies.get('loggedUser') || '{}';
	$scope.loggedUser = JSON.parse(loggedUser);

	console.log('logged user: ' + $scope.loggedUser.name + ', role: ' + $scope.loggedUser.role);
	if($scope.loggedUser.role !== 'admin' && $scope.loggedUser.role !== 'moderator') {
		location.replace('/#/login');
	} else {
		$scope.postData = {};
		$scope.createPost = (postData) => {
			if(postData.title && postData.parts[0]) {
				postData.token = $scope.loggedUser.token;
				$http({
					method: 'POST',
					url: '/post',
					data: postData
				})
				.success((response) => {
					$scope.validationStatus = 'Новость успешно создана';
					console.log('Create Post - status: Success.');
				})
				.error((response) => {
					$scope.validationStatus = 'Нет доступа к серверу или нет прав на создание новости';
					console.log('Cannot Create Post.');
					console.log(response);
				});
			} else
				$scope.validationStatus = 'Не введено одно из обязательных полей';
		}
	}
}
adminController.$inject = [
	'$scope',
	'$http',
	'$location'
];

angular.module('app').controller('adminController', adminController);