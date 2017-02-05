'use strict';
(function () {
    var loginApp = angular.module("app");
    loginApp.controller("createActivityController", ['userService', '$scope', function (userService, $scope) {
        $scope.username = "";
        $scope.password = "";
        $scope.loginButtonText = "Login";
        $scope.loginPressed = false;

        $scope.canLogin = function () {
            return !isEmpty($scope.username) && !isEmpty($scope.password);
        };
        $scope.login = function () {
            $scope.loginPressed = true;
            $scope.loginButtonText = "Logging in...";

            userService.authenticate($scope.username, $scope.password).then(function (res) {
                if (res.success) {
                    localStorage.setItem("AUTH_TOKEN", res.token);
                    location.href = "/dashboard";
                    
                } else {
                    $scope.errors = res.errors;
                    $scope.loginPressed = false;
                    $scope.loginButtonText = "Login";
                }
            });
        };
    }]);

})();