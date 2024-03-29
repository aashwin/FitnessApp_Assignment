'use strict';
(function () {
    var app = angular.module("app");
    app.controller("homeController", ['activityService', 'defaultProfilePic', 'userService', '$scope', '$routeParams', function (activityService, defaultProfilePic, userService, $scope, $routeParams) {
        $scope.myActivityList = [];
        $scope.default_profile_pic = defaultProfilePic;

        $scope.totalPages = [];
        $scope.count = 0;
        $scope.query = {
            "limit": '10',
            "sort_field": "createdAt",
            "sort_by": "desc",
            "createdBy": "me",
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