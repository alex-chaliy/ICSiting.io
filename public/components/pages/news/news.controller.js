'use strict';

let newsController = ($scope, $http, $location, ui) => {
	let loggedUser = Cookies.get('loggedUser') || '{}';
	$scope.loggedUser = JSON.parse(loggedUser);

	console.log('logged user: ' + $scope.loggedUser.name + ', role: ' + $scope.loggedUser.token);

	$scope.ui = ui;

	$scope.getNews = (userData) => {
		$http({
			method: 'GET',
			url: '/posts'
		})
		.success((response) => {
			$scope.news = response;
		})
		.error(() => {
			console.log('Cannot get news.');
		});
	}
	$scope.getNews();

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
		})
		.error((response) => {
			$scope.actionStatus = 'Нет доступа к серверу или нет прав на удаление новости';
			console.log('Cannot Delete Post.');
			console.log(response);
		});
	}
}
newsController.$inject = [
	'$scope',
	'$http',
	'$location',
	'ui'
];

angular.module('app').controller('newsController', newsController);