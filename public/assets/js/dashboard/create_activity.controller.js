"use strict";!function(){var e=angular.module("app");e.controller("createActivityController",["userService","$scope","$routeParams",function(e,a,l){a.entryMode=0,a.errored=!1,"manual"==l.method?a.entryMode=1:"gpx"==l.method&&(a.entryMode=2),a.activityTypes=[{value:1,label:"Run"},{value:2,label:"Walk"},{value:3,label:"Cycle"}],a.measurementTypes=[{value:1609.34,label:"Miles"},{value:1e3,label:"KM"},{value:1,label:"Meters"}],a.manualEntryModel={errors:[],activityType:a.activityTypes[0],distanceType:a.measurementTypes[0]},a.addActivityManual=function(){a.errored=!0,console.log(a)}}])}();