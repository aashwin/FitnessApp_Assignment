"use strict";!function(){var n=angular.module("app");n.controller("loginController",["$scope",function(n){n.username="",n.password="",n.loginButtonText="Login",n.loginPressed=!1,n.canLogin=function(){return!isEmpty(n.username)&&!isEmpty(n.password)},n.login=function(){n.loginPressed=!0,n.loginButtonText="Logging in..."}}])}();