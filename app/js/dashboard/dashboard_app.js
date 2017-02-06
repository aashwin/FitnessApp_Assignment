'use strict';

(function () {
    var app = angular.module("app", ['ngRoute', 'moment-picker']);
    app.factory('httpRequestInterceptor',
        ['$rootScope', function ($rootScope) {
            return {
                request: function ($config) {
                    if (localStorage.getItem("AUTH_TOKEN")) {
                        $config.headers['X_AUTH_TOKEN'] = localStorage.getItem("AUTH_TOKEN");
                    } else {
                        location.href = "/?unauthorised=true";
                    }
                    return $config;
                },
                responseError: function (response) {
                    if (response && response.status == 401) {
                        localStorage.removeItem("AUTH_TOKEN");
                        location.href = "/?unauthorised=true";
                    }
                    return response;
                }
            };
        }]);
    app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
        $routeProvider
            .when('/app', {
                templateUrl: 'static_views/dashboard/home.view.html',
                controller: 'homeController'
            })
            .when('/app/create-activity/:method?', {
                templateUrl: 'static_views/dashboard/create_activity.view.html',
                controller: 'createActivityController'

            })
            .otherwise({
                redirectTo: '/app'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
})();

