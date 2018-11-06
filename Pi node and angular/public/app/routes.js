var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider

        .when('/', {
        templateUrl: 'app/views/pages/index.html'
    })

    .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode({ enabled: true, requireBase: false });

});