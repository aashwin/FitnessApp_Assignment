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
            var parts = [];
            for (var i in query) {
                if (query.hasOwnProperty(i)) {
                    parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(query[i]));
                }
            }
            return $http.get('/api/activities/?' + parts.join("&"))
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