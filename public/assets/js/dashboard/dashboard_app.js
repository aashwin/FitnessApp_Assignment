"use strict";!function(){var t=angular.module("app",["ui-notification","ngRoute","moment-picker","ngFileUpload","ngMap"]);t.constant("defaultProfilePic","images/default_avatar.png"),t.factory("httpRequestInterceptor",["$rootScope",function(t){return{request:function(t){return localStorage.getItem("AUTH_TOKEN")?t.headers.X_AUTH_TOKEN=localStorage.getItem("AUTH_TOKEN"):location.href="/?unauthorised=true",t},responseError:function(t){return t&&401==t.status&&(localStorage.removeItem("AUTH_TOKEN"),location.href="/?unauthorised=true"),t}}}]),t.filter("numberText",function(){return function(t,e){if(isNaN(t))return t;e=e||2;var r=Math.floor(Math.log(Math.abs(t))/Math.log(1e3)),a="kmb"[r-1],o=Math.pow(10,e);return a?Math.round(t/Math.pow(1e3,r)*o)/o+a:""+n}}),t.filter("timeAgo",function(){return function(t){return moment(t).fromNow()}}),t.directive("dashCard",function(){return{restrict:"E",scope:{title:"@",value:"@",format:"@",units:"@",type:"@"},templateUrl:"/static_views/dashboard/dash_card.directive.html",link:function(t,e,r){t.$watchGroup(["units","type","value"],function(t,e,r){if("timeValue"==r.type&&r.value){var a=r.value,o=0,i=0,l=0;r.format.indexOf("HH")!==-1&&(o=Math.floor(a/3600),a%=3600),r.format.indexOf("MM")!==-1&&(i=Math.floor(a/60),a%=60),l=Math.round(a),r.displayVal=r.format.replace("HH",o>0&&o<10?"0"+o:o>9?o:"00"),r.displayVal=r.displayVal.replace("MM",i>0&&i<10?"0"+i:i>9?i:"00"),r.displayVal=r.displayVal.replace("SS",l>0&&l<10?"0"+l:l>9?l:"00")}else r.displayVal=r.value?r.value:"--";r.displayUnits=r.units,r.value||(r.displayUnits="")})}}}),t.config(["$routeProvider","$locationProvider","$httpProvider","momentPickerProvider",function(t,e,r,a){a.options({startView:"month",today:!0}),r.interceptors.push("httpRequestInterceptor"),t.when("/app",{templateUrl:"static_views/dashboard/home.view.html",controller:"homeController"}).when("/app/create-activity/:method?",{templateUrl:"static_views/dashboard/create_activity.view.html",controller:"createActivityController"}).when("/app/activity/:id?",{templateUrl:"static_views/dashboard/activity.view.html",controller:"activityController"}).when("/app/activity/:id?",{templateUrl:"static_views/dashboard/activity.view.html",controller:"activityController"}).when("/app/users/edit-profile",{templateUrl:"static_views/dashboard/edit_profile.view.html",controller:"editProfileController"}).when("/app/404",{templateUrl:"static_views/dashboard/404.view.html",controller:"ErrorController"}).otherwise({redirectTo:"/app/404"}),e.html5Mode({enabled:!0,requireBase:!1})}])}();