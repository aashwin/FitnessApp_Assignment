"use strict";!function(){var n=angular.module("app");n.controller("homeController",["userService","$scope",function(n,e){e.username="",e.password="",e.loginButtonText="Login",e.loginPressed=!1,e.canLogin=function(){return!isEmpty(e.username)&&!isEmpty(e.password)},e.login=function(){e.loginPressed=!0,e.loginButtonText="Logging in...",n.authenticate(e.username,e.password).then(function(n){n.success?(localStorage.setItem("AUTH_TOKEN",n.token),location.href="/app"):(e.errors=n.errors,e.loginPressed=!1,e.loginButtonText="Login")})}}])}();