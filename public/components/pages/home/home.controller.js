'use strict';

let homeController = ($scope, $http, $location) => {
}
homeController.$inject = [
	'$scope',
	'$http',
	'$location'
];

angular.module('app').controller('homeController', homeController);