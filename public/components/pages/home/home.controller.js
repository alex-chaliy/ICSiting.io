'use strict';

let homeController = ($scope, $http, $location, ui) => {
	let loggedUser = Cookies.get('loggedUser') || '{}';
	$scope.loggedUser = JSON.parse(loggedUser);
	console.log('logged user: ' + $scope.loggedUser.name + ', role: ' + $scope.loggedUser.role);

	$scope.ui = ui;

	let slides = [
		{
			_id: 's1',
			title: 'ИКС',
			subtitle: 'Институт Компьютерных Систем',
			keyWordTitle: {
				text: 'Интеллект',
				color: '#ccff90'
			},
			btn: {
				text: 'Новости ИКСа',
				href: '/#/news',
				bgColor: '#64dd17'
			},
			bgImg: {
				url: '/uploads/img/slider/img-7.jpg'
			}
		},
		{
			_id: 's2',
			title: 'ИКС',
			subtitle: 'Институт Компьютерных Систем',
			keyWordTitle: {
				text: 'Квалификация',
				color: '#f4ff81'
			},
			btn: {
				text: 'Найти одногруппника',
				href: '/#/users',
				bgColor: '#ffab00'
			},
			bgImg: {
				url: '/uploads/img/slider/img-12.jpg'
			}
		},
		{
			_id: 's3',
			title: 'ИКС',
			subtitle: 'Институт Компьютерных Систем',
			keyWordTitle: {
				text: 'Совершенство',
				color: '#b9f6ca'
			},
			btn: {
				text: 'Новости в IT',
				href: '/#/news',
				bgColor: '#0091ea'
			},
			bgImg: {
				url: '/uploads/img/slider/img-8.jpg'
			}
		},
	];
	$scope.slides = slides;
	let Slider = ui.Slider;
	let slider = Object.create(Slider).constructor(slides);
	slider.run($scope.slides);

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
homeController.$inject = [
	'$scope',
	'$http',
	'$location',
	'ui'
];

angular.module('app').controller('homeController', homeController);