'use strict';
(function () {
    var loginApp = angular.module("app");
    loginApp.factory("userService", ['$http', function ($http) {
        var service = {};
        service.register = function (user) {
            return $http.post('/api/users', user).then(success, failure('Could not connect to server, try again!'));
        };
        return service;

        function success(res) {
            return res.data;
        }

        function failure(error) {
            return function () {
                return {success: false, errors: [error]};
            };
        }
    }]);
})();