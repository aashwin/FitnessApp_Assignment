"use strict";!function(){var o=angular.module("app");o.controller("loginController",["userService","$scope","$location",function(o,n,e){n.username="",n.password="",n.loginButtonText="Login",n.loginPressed=!1,n.errors=[],e.search().unauthorised&&n.errors.push("You need to login to continue..."),n.canLogin=function(){return!isEmpty(n.username)&&!isEmpty(n.password)},n.login=function(){n.loginPressed=!0,n.loginButtonText="Logging in...",o.authenticate(n.username,n.password).then(function(o){o.success?(localStorage.setItem("AUTH_TOKEN",o.token),location.href="/app/"):(n.errors=o.errors,n.loginPressed=!1,n.loginButtonText="Login")})}}])}();