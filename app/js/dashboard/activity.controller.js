'use strict';
(function () {
    var app = angular.module("app");
    app.controller("activityController", ['activityService', 'userService', '$scope', '$routeParams', function (activityService, userService, $scope, $routeParams) {
        $scope.activity = {name: "Loading..."};
        activityService.get($routeParams.id).then(function (response) {
            if (response.success && response.object) {
                $scope.activity = response.object;
                $scope.activity.user = {"name": "unknown", "username": "unknown"};

                userService.get($scope.activity.createdBy).then(function (res) {
                    if (res.success && res.object) {
                        $scope.activity.user = res.object;
                    }
                });
            } else {
                location.href = "/404/";
                return;
            }
        }, function () {
            location.href = "/404/";
        });
    }]);

})();
