var loginApp = angular.module("loginApp", []);

loginApp.controller("loginController", ['$scope', function ($scope) {
    $scope.username = "";
    $scope.password = "";
    function validUsername() {
        return $scope.username !== undefined && $scope.username !== null && $scope.username != "";
    }
    function validPassword() {
        return $scope.password !== undefined && $scope.password !== null && $scope.password != "";
    }

    $scope.canLogin = function () {
        return validUsername() && validPassword();
    };
    $scope.login = function () {
        alert(123);
    };
}]);