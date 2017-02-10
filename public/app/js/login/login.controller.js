'use strict';
(function () {
    var loginApp = angular.module("app");
    loginApp.controller("loginController", ['userService', '$scope', '$location', function (userService, $scope, $location) {
        $scope.username = "";
        $scope.password = "";
        $scope.loginButtonText = "Login";
        $scope.loginPressed = false;
        $scope.errors = [];
        if ($location.search()["unauthorised"]) {
            $scope.errors.push("You need to login to continue...");
        }
        $scope.canLogin = function () {
            return !isEmpty($scope.username) && !isEmpty($scope.password);
        };
        $scope.login = function () {
            $scope.loginPressed = true;
            $scope.loginButtonText = "Logging in...";

            userService.authenticate($scope.username, $scope.password).then(function (res) {
                if (res.success) {
                    localStorage.setItem("AUTH_TOKEN", res.token);
                    location.href = "/public/app/";

                } else {
                    $scope.errors = res.errors;
                    $scope.loginPressed = false;
                    $scope.loginButtonText = "Login";
                }
            });
        };
    }]);

})();