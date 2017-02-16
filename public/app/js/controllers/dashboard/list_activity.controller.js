'use strict';
(function () {
    var app = angular.module("app");
    app.controller("listActivitiesController", ['activityService', 'userService', 'Notification', 'defaultProfilePic', '$location', '$scope', '$routeParams', function (activityService, userService, Notification, defaultProfilePic, $location, $scope, $routeParams) {
        $scope.default_profile_pic = defaultProfilePic;
        $scope.myActivityList = [];
        $scope.totalPages = [];
        $scope.count = 0;
        $scope.search_type = "name";
        $scope.search_query = "";
        $scope.query = {
            "limit": '10',
            "sort_field": "createdAt",
            "sort_by": "desc",
            "page": 1,
            "activityType": "ALL"
        };
        $scope.switchPage = function (p) {
            $scope.query.page = p;
            $scope.reload();
        };
        $scope.reload = function () {
            if ($scope.count == 0 || $scope.query.page > Math.ceil($scope.count / $scope.query.limit)) {
                $scope.query.page = 1;
            };

            $scope.query[$scope.search_type] = $scope.search_query;
            if ($scope.query.activityType == 'ALL') {
                delete $scope.query.activityType;
            }
            activityService.getAll($scope.query).then(function (res) {
                if (!$scope.query.activityType) {
                    $scope.query.activityType = 'ALL';
                }
                if (res.success && res.object && res.object instanceof Array) {
                    $scope.myActivityList = res.object;
                    $scope.count = res.count;
                    $scope.totalPages = new Array(Math.ceil(res.count / $scope.query.limit));
                }
            }, function () {
                if (!$scope.query.activityType) {
                    $scope.query.activityType = 'ALL';
                }
                $scope.myActivityList = [];
                $scope.totalPages = [];
            });
        };
        $scope.reload();

    }]);

})();
