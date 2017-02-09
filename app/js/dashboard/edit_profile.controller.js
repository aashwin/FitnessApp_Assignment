'use strict';
(function () {
    var app = angular.module("app");
    app.controller("editProfileController", ['userService', 'defaultProfilePic', '$location', '$scope', '$routeParams', function (userService, defaultProfilePic, $location, $scope, $routeParams) {
        $scope.default_profile_pic = defaultProfilePic;
        $scope.errored = false;
        $scope.entryModel = {};
        $scope.genders = [{"label": "Undisclosed", "value": 0}, {"label": "Male", "value": 1}, {
            "label": "Female",
            "value": 2
        }];

        $scope.$watch(userService.currentUser, function (currentUser) {
                $scope.entryModel = userService.currentUser;
                if ($scope.entryModel.dob) {
                    $scope.entryModel.dobObj = moment($scope.entryModel.dob);
                }
                if ($scope.entryModel.gender) {
                    for (var i = 0; i < $scope.genders.length; i++) {
                        if ($scope.entryModel.gender == $scope.genders[i].value) {
                            $scope.entryModel.genderObj = $scope.genders[i];
                            break;
                        }
                    }
                } else {
                    $scope.entryModel.genderObj = $scope.genders[0];
                }
            }
        );
        $scope.editProfile = function () {
            $scope.entryModel.errors = [];
            var model = $scope.entryModel;
            model.gender = $scope.entryModel.genderObj.value;
            model.dob = Math.round($scope.entryModel.dobObj.valueOf() / 1000);
            delete model.errors;
            userService.edit(model).then(function (res) {
                if (res.success) {
                    $location.path("app/users/edit-profile");
                } else {
                    $scope.entryModel.errors = res.errors;
                }
            });
        };
        $scope.upload = function (file) {
            $scope.uploaderText = "Uploading...";
            userService.uploadProfilePic(file).then(function (resp) {
                $scope.uploaderText = null;
                if (resp.success) {
                    $scope.uploaderText
                } else {
                    $scope.uploaderText = resp.errors;
                }
            }, function (resp) {
                $scope.uploaderText = resp.errors;
            }, function (progressPercent) {
                $scope.uploaderText = progressPercent + "% uploaded.";
            });
        };

    }]);


})();
