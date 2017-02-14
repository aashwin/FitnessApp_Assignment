'use strict';
var angular = require('angular');
var ui_notification = require('angular-ui-notification');
var ngRoute = require('angular-route');
var moment_picker = require('angular-moment-picker');
var ngFileUpload = require('ng-file-upload');
var ngMap = require('ngmap');


(function () {
    var app = angular.module("app", [ui_notification, ngRoute, ngFileUpload, ngMap, 'moment-picker']);
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

    require('../controllers/dashboard');
    require('../services/activity.service');
    require('../services/user.service');
    require('../services/youtube.service');
    app.filter('numberText', function () {
        return function (number, precision) {
            if (isNaN(number)) {
                return number;
            }
            precision = precision || 2;
            var base = Math.floor(Math.log(Math.abs(number)) / Math.log(1000));
            var suffix = 'kmb'[base - 1];
            var prec = Math.pow(10, precision);
            return suffix ? Math.round((number / Math.pow(1000, base) * prec)) / prec + suffix : number;

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
                highlighter: "@",
                units: "@",
                type: "@"
            },
            // template: '<div class="dash_card" ng-class="class"> <div class="title">{{title}}</div><div class="value">{{displayVal}}</div></div>',
            templateUrl: '/static_views/dashboard/dash_card.directive.html',
            link: function (scope, elem, attrs) {
                //Convert to K, M source adapted from: http://stackoverflow.com/a/10600491/7156780
                scope.$watchGroup(['units', 'type', 'value'], function (newValues, oldValues, scope) {
                    if (scope.type == 'timeValue' && scope.value) {
                        var leftOver = Math.abs(scope.value);

                        if (leftOver && leftOver > 0) {
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

                            scope.displayVal = scope.format.replace("HH", hour > 0 && hour < 10 ? "0" + hour : hour > 9 ? hour : "00");
                            scope.displayVal = scope.displayVal.replace("MM", minutes > 0 && minutes < 10 ? "0" + minutes : minutes > 9 ? minutes : "00");
                            scope.displayVal = scope.displayVal.replace("SS", seconds > 0 && seconds < 10 ? "0" + seconds : seconds > 9 ? seconds : "00");
                        } else {
                            scope.displayVal = "--";
                            scope.displayUnits = ""
                        }
                    } else {
                        scope.displayVal = !scope.value || scope.value === 0 || scope.value === '0' || scope.value === '0.00' ? "--" : scope.value;
                    }
                    if (scope.highlighter) {

                    }
                    scope.displayUnits = scope.units;
                    if (!scope.value || scope.value === 0 || scope.value === '0' || scope.value === '0.00') {
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

            }).when('/app/activity/:id/:edit_mode', {
            templateUrl: 'static_views/dashboard/create_activity.view.html',
            controller: 'createActivityController'

        }).when('/app/activity/:id/compare/:compare_id', {
            templateUrl: 'static_views/dashboard/compare_activity.view.html',
            controller: 'compareActivityController'

        }).when('/app/activity/:id', {
            templateUrl: 'static_views/dashboard/activity.view.html',
            controller: 'activityController'

        }).when('/app/profile/:id', {
            templateUrl: 'static_views/dashboard/profile.view.html',
            controller: 'profileController'

        }).when('/app/activities', {
            templateUrl: 'static_views/dashboard/activity_list.view.html',
            controller: 'listActivitiesController'

        }).when('/app/users/edit-profile', {
            templateUrl: 'static_views/dashboard/edit_profile.view.html',
            controller: 'editProfileController'

        }).when("/app/logout", {
            template: 'Logging you out...',
            controller: 'LogoutController'
        }).when('/app/404', {
            templateUrl: 'static_views/dashboard/404.view.html',
            controller: 'ErrorController'

        })
            .otherwise({
                redirectTo: '/app/404'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
    ]).controller("LogoutController", ['$scope', function ($scope) {
        localStorage.removeItem("AUTH_TOKEN");
        location.href = "/";

    }]);


})
();

