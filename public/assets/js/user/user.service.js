"use strict";!function(){var t=angular.module("app");t.factory("userService",["$http",function(t){var n={};return n.register=function(n){return t.post("/api/users",n).then(function(t){return t.data},function(t){return 403==t.status||409==t.status?t.data:{success:!1,errors:["Something went wrong, try again!"]}})},n.authenticate=function(n,r){var e={username:n,password:r};return t.post("/api/authenticate",e).then(function(t){return t.data},function(t){return 403==t.status?t.data:{success:!1,errors:["Something went wrong, try again!"]}})},n}])}();