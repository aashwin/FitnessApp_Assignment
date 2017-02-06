'use strict';
(function () {
    var loginApp = angular.module("app");
    loginApp.factory("userService", ['$http', function ($http) {
        var service = {};
        service.getLoggedInUser = function () {
            return $http.get('/api/users')
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    if (response.status == 401) {
                        return {"success": false, "unauthorised": true};
                    }
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.get = function (id) {
            console.log(123);
            return $http.get('/api/users/' + id)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.register = function (user) {
            return $http.post('/api/users', user)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    if (response.status == 403 || response.status == 409) {
                        return response.data;
                    }
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.authenticate = function (username, password) {
            var user = {
                "username": username,
                "password": password
            };
            return $http.post('/api/authenticate', user)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    if (response.status == 403) {
                        return response.data;
                    }
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        return service;
    }]);
})();