'use strict';

let postController = ($scope, $http, $location, $routeParams, ui) => {
	let loggedUser = Cookies.get('loggedUser') || '{}';
	$scope.loggedUser = JSON.parse(loggedUser);
	console.log('logged user: ' + $scope.loggedUser.name + ', role: ' + $scope.loggedUser.role);

	$scope.ui = ui;
	let post_id = $routeParams.post_id;

	$scope.getPost = (userData) => {
		$http({
			method: 'GET',
			url: '/post/' + post_id
		})
		.success((response) => {
			$scope.post = response;
		})
		.error((response) => {
			console.log('Cannot get post.');
			location.replace('/#/news');
		});
	}
	$scope.getPost();
}
postController.$inject = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	'ui'
];

angular.module('app').controller('postController', postController);