'use strict';
(function () {
    if (localStorage.getItem("AUTH_TOKEN")) {
        location.href = "/app";
    }
    var angular = require('angular');
    var ngRoute = require('angular-route');
    var ngFileUpload = require('ng-file-upload');
    var ui_notification = require('angular-ui-notification');

    var loginApp = angular.module("app", [ui_notification, ngRoute, ngFileUpload]);

    require('../controllers/login');
    require('../services/user.service');
    loginApp
        .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'static_views/login/login.view.html',
                    controller: 'loginController'
                })
                .when('/register', {
                    templateUrl: 'static_views/login/register.view.html',
                    controller: 'registerController'

                })
                .otherwise({
                    redirectTo: '/'
                });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }]);
})();
