'use strict';
(function () {
    var app = angular.module("app");
    app.controller("headerController", ['userService', '$scope', function (userService, $scope) {
        $scope.user = {};
        userService.getLoggedInUser().then(function (res) {
            if (res.success) {
                $scope.user = res.user;
            } else {
                localStorage.removeItem("AUTH_TOKEN");
                location.href = "/?unauthorised=true";
            }
        }, function () {
            localStorage.removeItem("AUTH_TOKEN");
            location.href = "/?unauthorised=true";
        });
    }]);

})();