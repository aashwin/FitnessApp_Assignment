"use strict";!function(){var e=angular.module("app");e.controller("editProfileController",["userService","defaultProfilePic","$location","$scope","$routeParams",function(e,r,o,l,n){l.default_profile_pic=r,l.errored=!1,l.entryModel={},l.genders=[{label:"Undisclosed",value:0},{label:"Male",value:1},{label:"Female",value:2}],l.$watch(e.currentUser,function(r){if(l.entryModel=e.currentUser,l.entryModel.dob&&(l.entryModel.dobObj=moment(l.entryModel.dob)),l.entryModel.gender){for(var o=0;o<l.genders.length;o++)if(l.entryModel.gender==l.genders[o].value){l.entryModel.genderObj=l.genders[o];break}}else l.entryModel.genderObj=l.genders[0]}),l.editProfile=function(){l.entryModel.errors=[];var r=l.entryModel;r.gender=l.entryModel.genderObj.value,r.dob=Math.round(l.entryModel.dobObj.valueOf()/1e3),delete r.errors,e.edit(r).then(function(e){e.success?o.path("app/users/edit-profile"):l.entryModel.errors=e.errors})},l.upload=function(r){l.uploaderText="Uploading...",e.uploadProfilePic(r).then(function(e){l.uploaderText=null,e.success?l.uploaderText:l.uploaderText=e.errors},function(e){l.uploaderText=e.errors},function(e){l.uploaderText=e+"% uploaded."})}}])}();