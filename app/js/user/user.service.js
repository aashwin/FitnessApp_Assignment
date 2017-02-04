'use strict';
(function () {
    var loginApp = angular.module("app");
    loginApp.factory("userService", ['$http', function ($http) {
        var service = {};
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
        return service;
    }]);
})();