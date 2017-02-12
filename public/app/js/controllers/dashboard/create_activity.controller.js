'use strict';
(function () {
    var app = angular.module("app");
    app.controller("createActivityController", ['userService', 'Notification', 'activityService', '$location', '$scope', '$routeParams', function (userService, Notification, activityService, $location, $scope, $routeParams) {
        $scope.entryMode = 0;
        $scope.errored = false;
        $scope.edit_mode = false;
        if ($routeParams.edit_mode && $routeParams.edit_mode == 'edit') {
            $scope.edit_mode = true;
            $scope.entryMode = 1;
        } else if ($routeParams.method == 'manual') {
            $scope.entryMode = 1;
        } else if ($routeParams.method == 'gpx') {
            $scope.entryMode = 2;
        }
        $scope.activityTypes = [
            {"value": 0, "label": 'Run'}, {"value": 1, "label": 'Walk'}, {"value": 2, "label": 'Cycle'}
        ];
        $scope.measurementTypes = [
            {"value": 1609.34, "label": 'Miles'}, {"value": 1000, "label": 'KM'}, {"value": 1, "label": 'Meters'}
        ];
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        $scope.manualEntryModel = {
            errors: [],
            activityType: $scope.activityTypes[0],
            distanceType: $scope.measurementTypes[0],
            dateTimeObj: moment(date)
        };

        if ($scope.edit_mode) {
            activityService.get($routeParams.id).then(function (response) {
                    if (response.success && response.object) {
                        if (response.object.createdBy._id !== $scope.currentUser._id) {
                            $location.path("/app/404/");
                            return;
                        }
                        if (response.object.activityType) {
                            for (var i = 0; i < $scope.activityTypes.length; i++) {
                                if (response.object.activityType == $scope.activityTypes[i].value) {
                                    response.object.activityType = $scope.activityTypes[i];
                                    break;
                                }
                            }
                        } else {
                            response.object.activityType = $scope.activityTypes[0];
                        }
                        response.object.distance = response.object.distanceInMeters / 1000;
                        response.object.distanceType = $scope.measurementTypes[1];
                        response.object.dateTimeObj = moment(new Date(response.object.dateTime * 1000));
                        response.object.elevation = response.object.elevationInMeters;
                        response.object.shared_with_list = response.object.shared_with;
                        var leftOver = response.object.durationInSeconds;

                        if (leftOver && leftOver > 0) {
                            response.object.durationH = Math.floor(leftOver / 3600);
                            leftOver %= 3600;

                            response.object.durationM = Math.floor(leftOver / 60);
                            leftOver %= 60;

                            response.object.durationS = Math.round(leftOver);
                        }
                        delete response.object.distanceInMeters;
                        delete response.object.elevationInMeters;
                        delete response.object.dateTime;
                        delete response.object.durationInSeconds;
                        delete response.object.shared_with;
                        $scope.manualEntryModel = response.object;
                        $scope.manualEntryModel.shared_with = "";
                        for (var ix = 0; ix < $scope.manualEntryModel.shared_with_list.length; ix++) {
                            userService.get($scope.manualEntryModel.shared_with_list[ix]).then(function (res) {
                                if (res.success && res.object) {
                                    if ($scope.manualEntryModel.shared_with.length > 0) {
                                        $scope.manualEntryModel.shared_with += ", ";
                                    }
                                    $scope.manualEntryModel.shared_with += res.object.username;
                                }
                            });
                        }

                    } else {
                        $location.path("/app/404/");
                        return;
                    }
                }
                ,
                function () {
                    $location.path("/app/404/");
                }
            );
            $scope.addActivityManual = function () {
                $scope.manualEntryModel.errors = [];
                $scope.manualEntryModel.dateTime = Math.round($scope.manualEntryModel.dateTimeObj.valueOf() / 1000);
                activityService.update($scope.manualEntryModel._id, $scope.manualEntryModel).then(function (res) {
                    if (res.success) {
                        $scope.errored = false;
                        $location.path('/app/activity/' + res.object._id);
                        Notification.success({message: 'Successfully updated activity', delay: 5000});

                    } else {
                        $scope.manualEntryModel.errors = res.errors;
                        $scope.errored = true;
                    }
                }, function (res) {
                    $scope.manualEntryModel.errors = res.errors;
                    $scope.errored = true;

                });
            }
        } else {
            $scope.gpxUploadModel = {
                errors: [],
                activityType: $scope.activityTypes[0]
            };
            $scope.addActivityManual = function () {
                $scope.manualEntryModel.errors = [];
                $scope.manualEntryModel.dateTime = Math.round($scope.manualEntryModel.dateTimeObj.valueOf() / 1000);
                activityService.create($scope.manualEntryModel).then(function (res) {
                    if (res.success) {
                        $scope.errored = false;
                        $location.path('/app/activity/' + res.object._id);
                        Notification.success({message: 'Successfully created activity', delay: 5000});

                    } else {
                        $scope.manualEntryModel.errors = res.errors;
                        $scope.errored = true;
                    }
                }, function (res) {
                    $scope.manualEntryModel.errors = res.errors;
                    $scope.errored = true;

                });
            };
            $scope.uploadPercent = null;
            $scope.uploadGpx = function () {
                if ($scope.gpxUpload.$invalid) {
                    $scope.gpxUploadModel.errors = ['Fix the highlighted issues before continuing...'];
                    $scope.errored = true;
                    return;
                }
                $scope.gpxUploadModel.errors = [];
                activityService.createUploader($scope.gpxUploadModel).then(function (resp) {
                    $scope.uploadPercent = null;
                    if (resp.success) {
                        $scope.errored = false;
                        $location.path('/app/activity/' + resp.object._id);
                        Notification.success({message: 'Successfully created activity', delay: 5000});
                    } else {
                        $scope.gpxUploadModel.errors = resp.errors;
                        $scope.errored = true;
                    }
                }, function (resp) {
                    $scope.gpxUploadModel.errors = ['Something went wrong, try again!'];
                    $scope.errored = true;

                }, function (progressPercent) {
                    $scope.uploadPercent = progressPercent + "%";
                });
            };
        }

    }]);


})();
