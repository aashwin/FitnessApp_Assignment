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
                        var leftOver = response.object.durationInSeconds;

                        if (leftOver && leftOver > 0) {
                            response.object.durationH = Math.floor(leftOver / 3600);
                            leftOver %= 3600;

                            response.object.durationM = Math.floor(leftOver / 60);
                            leftOver %= 60;

                            response.object.durationS = Math.round(leftOver);
                        }
                        delete response.object.distanceInMeters;
                        delete response.object.dateTime;
                        delete response.object.durationInSeconds;
                        $scope.manualEntryModel = response.object;
                        $scope.manualEntryModel.shared_with_text = [];
                        var done = 0;
                        for (var ix = 0; ix < $scope.manualEntryModel.shared_with.length; ix++) {
                            userService.get($scope.manualEntryModel.shared_with[ix]).then(function (res) {
                                done++;
                                if (res.success && res.object) {
                                    $scope.manualEntryModel.shared_with_text.push(res.object.username);
                                }
                                if (done == $scope.manualEntryModel.shared_with.length) {
                                    $scope.manualEntryModel.shared_with_text = $scope.manualEntryModel.shared_with_text.join(', ');
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
                var model = angular.copy($scope.manualEntryModel);
                model.dateTime = Math.round($scope.manualEntryModel.dateTimeObj.valueOf() / 1000);
                model.activityType = $scope.manualEntryModel.activityType.value;
                model.distanceInMeters = $scope.manualEntryModel.distance * $scope.manualEntryModel.distanceType.value;
                model.shared_with_text = model.shared_with_text || "";
                model.shared_with = model.shared_with_text.length > 0 ? model.shared_with_text.split(",") : [];
                model.durationInSeconds = model.durationH * 3600 + model.durationM * 60 + model.durationS;

                activityService.update(model._id, model).then(function (res) {
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
                var model = angular.copy($scope.manualEntryModel);
                model.dateTime = Math.round($scope.manualEntryModel.dateTimeObj.valueOf() / 1000);
                model.dateTime = Math.round($scope.manualEntryModel.dateTimeObj.valueOf() / 1000);
                model.activityType = $scope.manualEntryModel.activityType.value;
                model.distanceInMeters = $scope.manualEntryModel.distance * $scope.manualEntryModel.distanceType.value;
                model.shared_with_text = model.shared_with_text || "";
                model.shared_with = model.shared_with_text.length > 0 ? model.shared_with_text.split(",") : [];
                model.durationInSeconds = model.durationH * 3600 + model.durationM * 60 + model.durationS;
                activityService.create(model).then(function (res) {
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

                var copyOfActivityType = angular.copy($scope.gpxUploadModel.activityType);

                $scope.gpxUploadModel.activityType = $scope.gpxUploadModel.activityType.value;
                $scope.gpxUploadModel.shared_with_text = $scope.gpxUploadModel.shared_with_text || "";
                $scope.gpxUploadModel.shared_with = $scope.gpxUploadModel.shared_with_text.length > 0 ? $scope.gpxUploadModel.shared_with_text.split(",") : [];
                console.log($scope.gpxUploadModel);

                $scope.gpxUploadModel.errors = [];
                activityService.createUploader($scope.gpxUploadModel).then(function (resp) {
                    $scope.uploadPercent = null;
                    $scope.gpxUploadModel.activityType = copyOfActivityType;
                    if (resp.success) {
                        $scope.errored = false;
                        $location.path('/app/activity/' + resp.object._id);
                        Notification.success({message: 'Successfully created activity', delay: 5000});
                    } else {
                        $scope.gpxUploadModel.errors = resp.errors;
                        $scope.errored = true;
                    }
                }, function (resp) {
                    $scope.gpxUploadModel.activityType = copyOfActivityType;
                    $scope.gpxUploadModel.errors = ['Something went wrong, try again!'];
                    $scope.errored = true;

                }, function (progressPercent) {
                    $scope.uploadPercent = progressPercent + "%";
                });
            };
        }

    }]);


})();
