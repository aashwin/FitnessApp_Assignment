'use strict';
(function () {
    var app = angular.module("app");
    app.controller("profileController", ['userService', 'activityService', 'defaultProfilePic', '$location', '$scope', '$routeParams', function (userService, activityService, defaultProfilePic, $location, $scope, $routeParams) {
        $scope.default_profile_pic = defaultProfilePic;
        $scope.profile = {};
        $scope.myActivityList = [];
        $scope.count = 0;
        $scope.totalPages = [];
        userService.get($routeParams.id).then(function (response) {
            if (response.success && response.object) {
                $scope.profile = response.object;
            } else {
                location.href = "/app/404/";
                return;
            }
        }, function () {
            location.href = "/app/404/";
        });
        $scope.query = {
            "limit": '10',
            "sort_field": "createdAt",
            "sort_by": "desc",
            "createdBy": $routeParams.id,
            "page": 1
        };

        $scope.switchPage = function (p) {
            $scope.query.page = p;
            $scope.reload();
        };
        $scope.reload = function () {
            activityService.getAll($scope.query).then(function (res) {
                if (res.success && res.object && res.object instanceof Array) {
                    $scope.myActivityList = res.object;
                    $scope.count = res.count;
                    $scope.totalPages = new Array(Math.ceil(res.count / $scope.query.limit));
                }
            }, function () {
                $scope.myActivityList = [];
                $scope.totalPages = [];
            });
        };
        $scope.reload();
    }]);


})();
