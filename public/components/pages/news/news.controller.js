'use strict';

let newsController = ($scope, $http, $location) => {
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
}
newsController.$inject = [
	'$scope',
	'$http',
	'$location'
];

angular.module('app').controller('newsController', newsController);