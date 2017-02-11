'use strict';
(function () {
    var loginApp = angular.module("app");
    loginApp.factory("userService", ['$http', 'Upload', '$rootScope', function ($http, Upload, $rootScope) {
        var service = {};
        $rootScope.currentUser = {};

        service.getLoggedInUser = function () {
            return $http.get('/api/users')
                .then(function success(response) {
                    $rootScope.currentUser = response.data.user;
                    return response.data;
                }, function error(response) {
                    if (response.status == 401) {
                        return {"success": false, "unauthorised": true};
                    }
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.get = function (id) {
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
        service.edit = function (user) {
            return $http.put('/api/users/' + user._id, user)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    if (response.status == 403 || response.status == 409 || response.status == 401) {
                        return response.data;
                    }
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.delete = function (user) {
            return $http.delete('/api/users/' + user)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    if (response.status == 403 || response.status == 409 || response.status == 401) {
                        return response.data;
                    }
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.uploadProfilePic = function (file) {
            return Upload.upload({
                url: 'api/users/' + service.currentUser._id + '/profile_pic',
                data: {file: file},
                method: 'PUT'
            }).then(function (resp) {
                return resp.data;
            }, function (resp) {
                return resp;
            }, function (evt) {
                return parseInt(100.0 * evt.loaded / evt.total);
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