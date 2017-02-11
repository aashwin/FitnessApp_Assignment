'use strict';
(function () {
    var app = angular.module("app");
    app.controller("activityController", ['activityService', 'userService', 'Notification', 'defaultProfilePic', '$location', '$scope', '$routeParams', function (activityService, userService, Notification, defaultProfilePic, $location, $scope, $routeParams) {
        $scope.activity = {name: "Loading..."};
        $scope.default_profile_pic = defaultProfilePic;
        $scope.comments = {errors: [], list: [], count: 0};
        $scope.comment = "";
        $scope.mapPathData = [];

        activityService.get($routeParams.id).then(function (response) {
            if (response.success && response.object) {
                $scope.activity = response.object;
            } else {
                location.href = "/app/404/";
                return;
            }
        }, function () {
            location.href = "/app/404/";
        });
        activityService.getTrackPoints($routeParams.id).then(function (res) {
            if (res.success && res.object && res.object instanceof Array) {
                for (var i = 0; i < res.object.length; i++) {
                    $scope.mapPathData.push([res.object[i].lat, res.object[i].long]);
                }
            }
        });
        var limit = 5;
        var page = 1;
        $scope.loadMoreComments = function () {
            activityService.getComments($routeParams.id, {
                limit: limit,
                page: page,
                sort_field: "created_at",
                "sort_by": "asc"
            }).then(function (res) {
                if (res.success && res.object && res.object instanceof Array) {

                    $scope.comments.list = $scope.comments.list.concat(res.object);
                    $scope.comments.count = res.count || 0;
                    page++;
                }
            });
        };
        $scope.loadMoreComments();
        $scope.addActivityComment = function () {
            activityService.addComment({
                "activityId": $scope.activity._id,
                "commentText": $scope.comment
            }).then(function (res) {
                if (res.success) {
                    res.object.createdBy = $scope.currentUser;
                    $scope.comments.list.push(res.object);
                    $scope.comments.count++;
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
        $scope.deleteActivity = function () {
            var con = confirm("Are you sure you want to delete the activity? Everything will be erased.");
            if (con) {
                activityService.delete($scope.activity._id).then(function (res) {

                    if(res.success) {
                        $location.path('/app/');
                        Notification.success({message: 'Successfully deleted activity', delay: 5000});
                    }else{
                        Notification.error({message: 'Something went wrong', delay: 5000});
                    }
                }, function () {
                    Notification.error({message: 'Something went wrong', delay: 5000});

                });
            }
        };
    }]);

})();
