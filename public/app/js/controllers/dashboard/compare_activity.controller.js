'use strict';
(function () {
    var app = angular.module("app");
    app.controller("compareActivityController", ['userService', 'activityService', '$location', '$scope', '$routeParams', function (userService, activityService, $location, $scope, $routeParams) {
        $scope.activity = {name: "Loading..."};
        $scope.otherActivity = {name: "Loading..."};
        $scope.myActivityList = [];
        $scope.compareActivityObj = {};
        $scope.query = {
            "limit": '10000',
            "sort_field": "name",
            "sort_by": "asc",
            "createdBy": "me"
        };
        $scope.compareActivity = function () {
            if ($scope.compareActivityObj && $scope.compareActivityObj._id) {
                $location.path("/app/activity/" + $routeParams.id + "/compare/" + $scope.compareActivityObj._id)
                return;
            }
        };

        activityService.getAll($scope.query).then(function (res) {
            if (res.success && res.object && res.object instanceof Array) {
                $scope.myActivityList = res.object;
            }
        }, function () {
            $scope.myActivityList = [];
        });
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
        activityService.get($routeParams.compare_id).then(function (response) {
            if (response.success && response.object) {
                $scope.otherActivity = response.object;
            } else {
                location.href = "/app/404/";
                return;
            }
        }, function () {
            location.href = "/app/404/";
        });
    }]);


})();
