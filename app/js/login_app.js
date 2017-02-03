var loginApp = angular.module("loginApp", ['ngRoute']);
loginApp
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'static_views/login/login.html'
            })
            .when('/register', {
                templateUrl: 'static_views/login/register.html'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);

function isEmpty(txt) {
    return txt === undefined || txt === null || txt == "";
}

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


loginApp.controller("registerController", ['$scope', function ($scope) {
    $scope.username = "";
    $scope.password = "";
    $scope.confirmPassword = "";
    $scope.registerButtonText = "Signup";
    $scope.pressed = false;

    $scope.canRegister = function () {
        return !isEmpty($scope.username) && !isEmpty($scope.password) && !isEmpty($scope.confirmPassword);
    };
    $scope.register = function () {
        $scope.pressed = true;
        $scope.signup = "Please wait...";
    };
}]);
