"use strict";!function(){var t=angular.module("app");t.controller("activityController",["activityService","userService","defaultProfilePic","$scope","$routeParams",function(t,e,o,c,r){c.activity={name:"Loading..."},c.default_profile_pic=o,c.currentUser={},c.comments={errors:[],list:[],count:0},c.comment="",c.mapPathData=[],c.$watch(e.currentUser,function(t){c.currentUser=e.currentUser}),t.get(r.id).then(function(t){return t.success&&t.object?void(c.activity=t.object):void(location.href="/app/404/")},function(){location.href="/app/404/"}),t.getTrackPoints(r.id).then(function(t){if(t.success&&t.object&&t.object instanceof Array)for(var e=0;e<t.object.length;e++)c.mapPathData.push([t.object[e].lat,t.object[e].long])});var n=5,i=1;c.loadMoreComments=function(){t.getComments(r.id,{limit:n,page:i}).then(function(t){t.success&&t.object&&t.object instanceof Array&&(c.comments.list=c.comments.list.concat(t.object),c.comments.count=t.count||0,i++)})},c.loadMoreComments(),c.addActivityComment=function(){t.addComment({activityId:c.activity._id,commentText:c.comment}).then(function(t){t.success?(t.object.createdBy=c.currentUser,c.comments.list.push(t.object),c.comments.count++,c.comments.errors=[],c.comment="",c.errored=!1):(c.comments.errors=t.errors,c.errored=!0)},function(t){c.comments.errors=t.errors,c.errored=!0})}}])}();