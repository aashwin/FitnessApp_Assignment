'use strict';
(function () {
    var app = angular.module("app");
    app.factory("youtubeService", ['$http', function ($http) {
        var service = {};
        var key = "AIzaSyB-ceaTERvEw6THbFYT8wqXXPv-sM1Llww";
        service.getIdFromURL = function (url) {
            var youtubeRegex = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(youtubeRegex);
            if (match && match[2].length == 11) {
                return match[2];
            }
            return null;
        };
        service.get = function (id) {
            return $http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + id + '&key=' + key)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return null;
                });
        };
        return service;
    }]);
})();