'use strict';

let homeController = ($scope, $http, $location, ui) => {
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
				url: '/uploads/img/img-7.jpg'
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
				text: 'Найти одногрупника',
				href: '/#/users',
				bgColor: '#ffab00'
			},
			bgImg: {
				url: '/uploads/img/img-12.jpg'
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
				url: '/uploads/img/img-8.jpg'
			}
		},
	];
	$scope.slides = slides;
	$scope.ui = ui;
	let Slider = ui.Slider;
	let slider = Object.create(Slider).constructor(slides);
	slider.run($scope.slides);
}
homeController.$inject = [
	'$scope',
	'$http',
	'$location',
	'ui'
];

angular.module('app').controller('homeController', homeController);