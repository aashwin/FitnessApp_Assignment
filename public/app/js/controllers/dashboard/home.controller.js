'use strict';
(function () {
    var app = angular.module("app");
    app.controller("homeController", ['activityService', 'userService', '$scope', function (activityService, userService, $scope) {
        $scope.myActivityList = [];
        activityService.getAll({createdBy: 'me'}).then(function (res) {
            if (res.success && res.object && res.object instanceof Array) {
                $scope.myActivityList = res.object;
            }
        }, function () {

        });
    }]);

})();