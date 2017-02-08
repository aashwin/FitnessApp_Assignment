'use strict';
(function () {
    var app = angular.module("app");
    app.factory("activityService", ['$http', function ($http) {
        var service = {};
        service.get = function (id) {
            return $http.get('/api/activities/' + id)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.getComments = function (id) {
            return $http.get('/api/activities/' + id + '/comments')
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
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
        service.addComment = function (comment) {
            return $http.post('/api/activities/' + comment.activityId + "/comments", comment)
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