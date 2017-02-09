'use strict';

(function () {
    var app = angular.module("app", ['ngRoute', 'moment-picker','ngFileUpload', 'ngMap']);
    app.constant('defaultProfilePic', "images/default_avatar.png");
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
    app.filter('numberText', function () {
        return function (number, precision) {
            if (isNaN(number)) {
                return number;
            }
            precision = precision || 2;
            var base = Math.floor(Math.log(Math.abs(number)) / Math.log(1000));
            var suffix = 'kmb'[base - 1];
            var prec = Math.pow(10, precision);
            return suffix ? Math.round((number / Math.pow(1000, base) * prec)) / prec + suffix : '' + n;

        };
    });
    app.filter('timeAgo', function () {
        return function (val) {
            return moment(val).fromNow();

        };
    });
    app.directive('dashCard', function () {
        return {

            restrict: 'E', //E = element, A = attribute, C = class, M = comment
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                title: '@',
                value: "@",
                format: "@",
                units: "@",
                type: "@"
            },
            // template: '<div class="dash_card" ng-class="class"> <div class="title">{{title}}</div><div class="value">{{displayVal}}</div></div>',
            templateUrl: '/static_views/dashboard/dash_card.directive.html',
            link: function (scope, elem, attrs) {
                //Convert to K, M source adapted from: http://stackoverflow.com/a/10600491/7156780
                scope.$watchGroup(['units', 'type', 'value'], function (newValues, oldValues, scope) {
                    if (scope.type == 'timeValue' && scope.value) {
                        var leftOver = scope.value;
                        var hour = 0, minutes = 0, seconds = 0;
                        if (scope.format.indexOf("HH") !== -1) {
                            hour = Math.floor(leftOver / 3600);
                            leftOver %= 3600;
                        }
                        if (scope.format.indexOf("MM") !== -1) {
                            minutes = Math.floor(leftOver / 60);
                            leftOver %= 60;
                        }
                        seconds = Math.round(leftOver);
                        // if (scope.format.indexOf("HH") === -1 && scope.format.indexOf("MM") !== -1) {
                        //     minutes = window.Math.round((scope.value) / 60);
                        // }
                        // if (scope.format.indexOf("MM") === -1 && scope.format.indexOf("SS") !== -1) {
                        //     seconds = window.Math.round((scope.value / 60));
                        // }

                        scope.displayVal = scope.format.replace("HH", hour > 0 && hour < 10 ? "0" + hour : hour > 9 ? hour : "00");
                        scope.displayVal = scope.displayVal.replace("MM", minutes > 0 && minutes < 10 ? "0" + minutes : minutes > 9 ? minutes : "00");
                        scope.displayVal = scope.displayVal.replace("SS", seconds > 0 && seconds < 10 ? "0" + seconds : seconds > 9 ? seconds : "00");
                    } else {
                        scope.displayVal = scope.value ? scope.value : "--";

                    }
                    scope.displayUnits = scope.units;
                    if (!scope.value) {
                        scope.displayUnits = "";
                    }
                });
            }


        };
    });
    app.config(['$routeProvider', '$locationProvider', '$httpProvider', 'momentPickerProvider', function ($routeProvider, $locationProvider, $httpProvider, momentPickerProvider) {
        momentPickerProvider.options({
            startView: 'month',
            today: true
        });
        $httpProvider.interceptors.push('httpRequestInterceptor');
        $routeProvider
            .when('/app', {
                templateUrl: 'static_views/dashboard/home.view.html',
                controller: 'homeController'
            })
            .when('/app/create-activity/:method?', {
                templateUrl: 'static_views/dashboard/create_activity.view.html',
                controller: 'createActivityController'

            }).when('/app/activity/:id?', {
            templateUrl: 'static_views/dashboard/activity.view.html',
            controller: 'activityController'

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

