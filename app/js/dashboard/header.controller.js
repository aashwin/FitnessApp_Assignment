'use strict';
(function () {
    var app = angular.module("app");
    app.controller("headerController", ['userService', '$scope', function (userService, $scope) {
        $scope.user = {};
        userService.getLoggedInUser().then(function (res) {
            if (res.success) {
                $scope.user = res.user;
            } else {
                location.href = "/?unauthorised=true";
            }
        });
    }]);

})();