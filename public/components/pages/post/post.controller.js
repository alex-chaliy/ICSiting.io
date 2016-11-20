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

	$scope.deletePost = (postId, token) => {
		$http({
	        headers: {"Content-Type": "application/json;charset=utf-8"},
			method: 'DELETE',
			url: '/post/' + postId,
			data:  {token: token}
		})
		.success((response) => {
			$scope.actionStatus = 'Новость успешно удалена';
			console.log('Delete Post - status: Success.');

			$('#post-' + postId).fadeOut(500);
			setTimeout(() => {
				location.replace('/#/news');
			}, 1000);
		})
		.error((response) => {
			$scope.actionStatus = 'Нет доступа к серверу или нет прав на удаление новости';
			console.log('Cannot Delete Post.');
			console.log(response);
		});
	}
}
postController.$inject = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	'ui'
];

angular.module('app').controller('postController', postController);