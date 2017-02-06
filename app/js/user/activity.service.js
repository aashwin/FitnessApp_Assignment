'use strict';
(function () {
    var app = angular.module("app");
    app.factory("activityService", ['$http', function ($http) {
        var service = {};

        service.create = function (activity) {
            return $http.post('/api/activities/', activity)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    if (response.status == 400) {
                        return response.data;
                    }
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        return service;
    }]);
})();