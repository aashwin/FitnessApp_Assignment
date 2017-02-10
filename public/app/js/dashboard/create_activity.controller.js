'use strict';
(function () {
    var app = angular.module("app");
    app.controller("createActivityController", ['userService', 'activityService', '$location', '$scope', '$routeParams', function (userService, activityService, $location, $scope, $routeParams) {
        $scope.entryMode = 0;
        $scope.errored = false;
        if ($routeParams.method == 'manual') {
            $scope.entryMode = 1;
        } else if ($routeParams.method == 'gpx') {
            $scope.entryMode = 2;
        }
        $scope.activityTypes = [
            {"value": 1, "label": 'Run'}, {"value": 2, "label": 'Walk'}, {"value": 3, "label": 'Cycle'}
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

    }]);


})();