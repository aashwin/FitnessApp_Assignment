"use strict";const isEmpty=function(e){return void 0===e||null===e||""==e};!function(){localStorage.getItem("AUTH_TOKEN")&&(location.href="/public/app");var e=angular.module("app",["ngRoute"]);e.config(["$routeProvider","$locationProvider",function(e,t){e.when("/",{templateUrl:"static_views/login/login.view.html",controller:"loginController"}).when("/register",{templateUrl:"static_views/login/register.view.html",controller:"registerController"}).otherwise({redirectTo:"/"}),t.html5Mode({enabled:!0,requireBase:!1})}])}();