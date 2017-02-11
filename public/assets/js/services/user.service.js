"use strict";!function(){var t=angular.module("app");t.factory("userService",["$http","Upload","$rootScope",function(t,n,r){var e={};return r.currentUser={},e.getLoggedInUser=function(){return t.get("/api/users").then(function(t){return r.currentUser=t.data.user,t.data},function(t){return 401==t.status?{success:!1,unauthorised:!0}:{success:!1,errors:["Something went wrong, try again!"]}})},e.get=function(n){return t.get("/api/users/"+n).then(function(t){return t.data},function(t){return{success:!1,errors:["Something went wrong, try again!"]}})},e.register=function(n){return t.post("/api/users",n).then(function(t){return t.data},function(t){return 403==t.status||409==t.status?t.data:{success:!1,errors:["Something went wrong, try again!"]}})},e.edit=function(n){return t.put("/api/users/"+n._id,n).then(function(t){return t.data},function(t){return 403==t.status||409==t.status||401==t.status?t.data:{success:!1,errors:["Something went wrong, try again!"]}})},e.delete=function(n){return t.delete("/api/users/"+n).then(function(t){return t.data},function(t){return 403==t.status||409==t.status||401==t.status?t.data:{success:!1,errors:["Something went wrong, try again!"]}})},e.uploadProfilePic=function(t){return n.upload({url:"api/users/"+e.currentUser._id+"/profile_pic",data:{file:t},method:"PUT"}).then(function(t){return t.data},function(t){return t},function(t){return parseInt(100*t.loaded/t.total)})},e.authenticate=function(n,r){var e={username:n,password:r};return t.post("/api/authenticate",e).then(function(t){return t.data},function(t){return 403==t.status?t.data:{success:!1,errors:["Something went wrong, try again!"]}})},e}])}();