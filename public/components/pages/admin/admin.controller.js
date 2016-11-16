'use strict';

let adminController = ($scope, $http, $location) => {
	$scope.loggedUser = Cookies.get('loggedUser') || {};
	if($scope.loggedUser.role !== 'admin' && $scope.loggedUser.role !== 'moderator') {
		location.replace('/#/login');
	} else {
		$scope.postData = {};
		$scope.createPost = (postData) => {
			if(postData.title) {
				$http({
					method: 'POST',
					url: '/post',
					data: postData
				})
				.success((response) => {
					console.log('Create Post - status: Success.');
				})
				.error(() => {
					console.log('Cannot Create Post.');
				});
			}
		}
	}
}
adminController.$inject = [
	'$scope',
	'$http',
	'$location'
];

angular.module('app').controller('adminController', adminController);