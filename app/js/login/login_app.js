'use strict';
const isEmpty = function (txt) {
    return txt === undefined || txt === null || txt == "";
};
(function(){
    var loginApp = angular.module("app", ['ngRoute']);
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
