'use strict';
(function () {
    var loginApp = angular.module("app");
    loginApp.controller("loginController", ['$scope', function ($scope) {
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
        };
    }]);

})();