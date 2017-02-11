"use strict";!function(){var t=angular.module("app");t.factory("activityService",["$http","Upload",function(t,n){var r={};return r.get=function(n){return t.get("/api/activities/"+n).then(function(t){return t.data},function(t){return{success:!1,errors:["Something went wrong, try again!"]}})},r.getAll=function(n){return t.get("/api/activities/"+toQuery(n)).then(function(t){return t.data},function(t){return{success:!1,errors:["Something went wrong, try again!"]}})},r.getComments=function(n,r){return t.get("/api/activities/"+n+"/comments"+toQuery(r)).then(function(t){return t.data},function(t){return{success:!1,errors:["Something went wrong, try again!"]}})},r.getTrackPoints=function(n){return t.get("/api/activities/"+n+"/trackpoints").then(function(t){return t.data},function(t){return{success:!1,errors:["Something went wrong, try again!"]}})},r.create=function(n){return t.post("/api/activities/",n).then(function(t){return t.data},function(t){return 400==t.status?t.data:{success:!1,errors:["Something went wrong, try again!"]}})},r.createUploader=function(t){return n.upload({url:"/api/activities/",data:t}).then(function(t){return t.data},function(t){return t},function(t){return parseInt(100*t.loaded/t.total)})},r.addComment=function(n){return t.post("/api/activities/"+n.activityId+"/comments",n).then(function(t){return t.data},function(t){return 400==t.status?t.data:{success:!1,errors:["Something went wrong, try again!"]}})},r}])}();