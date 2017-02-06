'use strict';

(function () {
    var app = angular.module("app", ['ngRoute']);
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
    }]);
})();

