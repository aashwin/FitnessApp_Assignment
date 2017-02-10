'use strict';
(function () {
    var app = angular.module("app");
    app.controller("activityController", ['activityService', 'userService', 'defaultProfilePic', '$scope', '$routeParams', function (activityService, userService, defaultProfilePic, $scope, $routeParams) {
        $scope.activity = {name: "Loading..."};
        $scope.default_profile_pic = defaultProfilePic;
        $scope.currentUser = {};
        $scope.comments = {errors: [], list: []};
        $scope.comment = "";
        $scope.mapPathData = [];
        $scope.$watch(userService.currentUser, function (currentUser) {
            $scope.currentUser = userService.currentUser;
        });
        activityService.get($routeParams.id).then(function (response) {
            if (response.success && response.object) {
                $scope.activity = response.object;
            } else {
                location.href = "../..//404/";
                return;
            }
        }, function () {
            location.href = "../..//404/";
        });
        activityService.getTrackPoints($routeParams.id).then(function (res) {
            if (res.success && res.object && res.object instanceof Array) {
                for (var i = 0; i < res.object.length; i++) {
                    $scope.mapPathData.push([res.object[i].lat, res.object[i].long]);
                }
            }
        });
        activityService.getComments($routeParams.id).then(function (res) {
            if (res.success && res.object && res.object instanceof Array) {
                $scope.comments.list = res.object;
            }
        });
        $scope.addActivityComment = function () {
            activityService.addComment({
                "activityId": $scope.activity._id,
                "commentText": $scope.comment
            }).then(function (res) {
                if (res.success) {
                    res.object.createdBy = $scope.currentUser;
                    $scope.comments.list.push(res.object);
                    $scope.comments.errors = [];
                    $scope.comment = "";
                    $scope.errored = false;
                } else {
                    $scope.comments.errors = res.errors;
                    $scope.errored = true;
                }
            }, function (res) {
                $scope.comments.errors = res.errors;
                $scope.errored = true;
            });
        };
    }]);

})();
