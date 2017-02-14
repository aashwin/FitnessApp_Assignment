'use strict';
(function () {
    var loginApp = angular.module("app");
    loginApp.controller("registerController", ['userService','Notification', '$scope', '$location', function (userService, Notification, $scope, $location) {
        $scope.username = "";
        $scope.password = "";
        $scope.confirmPassword = "";
        $scope.registerButtonText = "Signup";
        $scope.pressed = false;
        $scope.errors = [];

        $scope.canRegister = function () {
            return $scope.signupForm.$valid;
        };

        $scope.register = function () {
            if (!$scope.canRegister()) {
                return false;
            }
            $scope.pressed = true;
            $scope.signup = "Please wait...";
            var user = {
                "username": $scope.username,
                "password": $scope.password,
                "confirmPassword": $scope.confirmPassword
            };

            userService.register(user).then(function (res) {
                if (res.success) {
                    Notification.success({message: 'Successfully Registered', delay: 5000});
                    $location.path('/');
                } else {
                    $scope.errors = res.errors;
                    $scope.pressed = false;
                    $scope.signup = "Signup";
                }
            });
        };
    }]);
})();