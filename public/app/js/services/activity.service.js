'use strict';
(function () {
    var app = angular.module("app");
    app.factory("activityService", ['$http', 'Upload', function ($http, Upload) {
        var service = {};
        service.get = function (id) {
            return $http.get('/api/activities/' + id)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.getAll = function (query) {

            return $http.get('/api/activities/' + toQuery(query))
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.delete = function (id) {
            return $http.delete('/api/activities/' + id)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.update = function (id, activity) {
            return $http.put('/api/activities/' + id, activity)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    if (response.status == 400) {
                        return response.data;
                    }
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.getComments = function (id, query) {
            return $http.get('/api/activities/' + id + '/comments' + toQuery(query))
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return {"success": false, "errors": ["Something went wrong, try again!"]};
                });
        };
        service.getTrackPoints = function (id) {
            return $http.get('/api/activities/' + id + '/trackpoints')
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
        service.createUploader = function (activity) {
            return Upload.upload({
                url: '/api/activities/',
                data: activity
            }).then(function (resp) {
                return resp.data;
            }, function (resp) {
                return resp;
            }, function (evt) {
                return parseInt(100.0 * evt.loaded / evt.total);
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