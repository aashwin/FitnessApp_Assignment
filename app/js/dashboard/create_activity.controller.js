'use strict';
(function () {
    var app = angular.module("app");
    app.controller("createActivityController", ['userService', '$scope', '$routeParams', function (userService, $scope, $routeParams) {
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
        $scope.manualEntryModel = {
            errors: [],
            activityType: $scope.activityTypes[0],
            distanceType: $scope.measurementTypes[0]
        };
        $scope.addActivityManual = function () {
            $scope.errored = true;
            console.log($scope);
        };

    }]);

})();
