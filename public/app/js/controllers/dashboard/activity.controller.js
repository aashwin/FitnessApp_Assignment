'use strict';
(function () {
    var app = angular.module("app");
    app.controller("activityController", ['youtubeService', 'activityService', 'userService', 'Notification', 'defaultProfilePic', '$location', '$scope', '$routeParams', function (youtubeService, activityService, userService, Notification, defaultProfilePic, $location, $scope, $routeParams) {
        $scope.activity = {name: "Loading..."};
        $scope.default_profile_pic = defaultProfilePic;
        $scope.comments = {errors: [], list: [], count: 0};
        $scope.comment = "";
        $scope.mapPathData = [];
        $scope.myActivityList = [];
        $scope.compareActivityObj = {};
        $scope.attachmentUrl = '';
        $scope.attachmentType = '0';
        $scope.query = {
            "limit": '10000',
            "sort_field": "name",
            "sort_by": "asc",
            "createdBy": "me"
        };

        activityService.getAll($scope.query).then(function (res) {
            if (res.success && res.object && res.object instanceof Array) {
                $scope.myActivityList = res.object;
            }
        }, function () {
            $scope.myActivityList = [];
        });
        activityService.get($routeParams.id).then(function (response) {
            if (response.success && response.object) {
                $scope.activity = response.object;
            } else {
                location.href = "/app/404/";
                return;
            }
        }, function () {
            location.href = "/app/404/";
        });
        activityService.getTrackPoints($routeParams.id).then(function (res) {
            if (res.success && res.object && res.object instanceof Array) {
                for (var i = 0; i < res.object.length; i++) {
                    $scope.mapPathData.push([res.object[i].lat, res.object[i].long]);
                }
            }
        });
        var limit = 5;
        var page = 1;
        $scope.loadMoreComments = function () {
            activityService.getComments($routeParams.id, {
                limit: limit,
                page: page,
                sort_field: "created_at",
                "sort_by": "asc"
            }).then(function (res) {
                if (res.success && res.object && res.object instanceof Array) {

                    $scope.comments.list = $scope.comments.list.concat(res.object);
                    $scope.comments.count = res.count || 0;
                    page++;
                }
            });
        };
        $scope.loadMoreComments();
        $scope.compareActivity = function () {
            if ($scope.compareActivityObj && $scope.compareActivityObj._id) {
                $location.path("/app/activity/" + $routeParams.id + "/compare/" + $scope.compareActivityObj._id)
                return;
            }
        };
        $scope.addActivityComment = function () {
            activityService.addComment({
                "activityId": $scope.activity._id,
                "commentText": $scope.comment
            }).then(function (res) {
                if (res.success) {
                    res.object.createdBy = $scope.currentUser;
                    $scope.comments.list.push(res.object);
                    $scope.comments.count++;
                    $scope.comments.errors = [];
                    $scope.comment = "";
                    $scope.errored = false;
                } else {
                    $scope.comments.errors = res.errors;
                    $scope.errored = true;
                }
            }, function (res) {
                $scope.comments.errors = res.errors;
                $scope.errored = true;
            });
        };
        $scope.attachments = [];
        $scope.$watch(function (scope) {
                return !scope.activity ? 0 : !scope.activity.attachedMedia ? 0 : scope.activity.attachedMedia.length;
            }, function () {
                $scope.attachments = [];

                if (!$scope.activity.attachedMedia || !$scope.activity.attachedMedia instanceof Array) {
                    $scope.activity.attachedMedia = [];
                }
                for (var i = 0; i < $scope.activity.attachedMedia.length; i++) {
                    var attachment = $scope.activity.attachedMedia[i];
                    if (attachment.type == 1) {
                        $scope.attachments.push({
                            thumb: attachment.url,
                            title: "Image",
                            url: attachment.url,
                            type: attachment.type
                        });
                    } else if (attachment.type == 2) {
                        var thumb = 'http://free.pagepeeker.com/v2/thumbs.php?size=x&url=' + attachment.url;
                        var utubeId = youtubeService.getIdFromURL(attachment.url);

                        if (utubeId) {
                            youtubeService.get(utubeId).then(function (resp) {
                                if (resp && resp.items) {
                                    $scope.attachments.push({
                                        thumb: resp.items[0].snippet.thumbnails.high.url,
                                        url: 'https://www.youtube.com/watch?v=' + resp.items[0].id,
                                        title: resp.items[0].snippet.title,
                                        type: 2
                                    });
                                }
                            });

                        } else {
                            $scope.attachments.push({
                                thumb: thumb,
                                url: attachment.url,
                                type: attachment.type
                            });
                        }

                    } else {
                        $scope.attachments.push({
                            thumb: 'http://free.pagepeeker.com/v2/thumbs.php?size=x&url=' + attachment.url,
                            url: attachment.url,
                            type: attachment.type
                        });
                    }
                }
            }
        );
        $scope.deleteAttachment = function (attachment) {
            for (var ix = 0; ix < $scope.attachments.length; ix++) {
                if ($scope.attachments[ix].url === attachment.url && attachment.type === $scope.attachments[ix].type && $scope.attachments[ix].title === attachment.title) {
                    $scope.attachments.splice(ix, 1);
                    break;
                }
            }
            for (var i = 0; i < $scope.activity.attachedMedia.length; i++) {
                if ($scope.activity.attachedMedia[i].url == attachment.url && $scope.activity.attachedMedia[i].type == attachment.type) {
                    $scope.activity.attachedMedia.splice(i, 1);
                    activityService.update($routeParams.id, $scope.activity).then(function (res) {
                        if (res.success) {
                            Notification.success({message: 'Successfully removed attachment', delay: 5000});
                        } else {
                            $scope.errored = true;
                        }
                    }, function (res) {
                        $scope.errored = true;

                    });
                    break;
                }
            }
        }
        ;
        $scope.attachMedia = function () {
            if (!$scope.activity) {
                return;
            }
            if (!$scope.activity.attachedMedia || !$scope.activity.attachedMedia instanceof Array) {
                $scope.activity.attachedMedia = [];
            }
            $scope.activity.attachedMedia.push({url: $scope.attachmentUrl, type: $scope.attachmentType});
            activityService.update($routeParams.id, $scope.activity).then(function (res) {
                $scope.attachmentUrl = "";
                if (res.success) {
                    Notification.success({message: 'Successfully attached media', delay: 5000});
                } else {
                    $scope.errored = true;
                }
            }, function (res) {
                $scope.errored = true;

            });
        };
        $scope.editActivity = function () {
            $location.path('/app/activity/' + $scope.activity._id + '/edit');
        };
        $scope.deleteActivity = function () {
            var con = confirm("Are you sure you want to delete the activity? Everything will be erased.");
            if (con) {
                activityService.delete($scope.activity._id).then(function (res) {

                    if (res.success) {
                        $location.path('/app/');
                        Notification.success({message: 'Successfully deleted activity', delay: 5000});
                    } else {
                        Notification.error({message: 'Something went wrong', delay: 5000});
                    }
                }, function () {
                    Notification.error({message: 'Something went wrong', delay: 5000});

                });
            }
        };
    }
    ]);

})();
