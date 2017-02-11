'use strict';
(function () {
    var app = angular.module("app");
    app.controller("editProfileController", ['userService', 'defaultProfilePic', 'Notification', '$location', '$scope', '$routeParams', function (userService, defaultProfilePic, Notification, $location, $scope, $routeParams) {
        $scope.default_profile_pic = defaultProfilePic;
        $scope.errored = false;
        $scope.entryModel = {};
        $scope.genders = [{"label": "Undisclosed", "value": 0}, {"label": "Male", "value": 1}, {
            "label": "Female",
            "value": 2
        }];

        $scope.$watch($scope.currentUser, function (newUser, oldUser, x) {
                $scope.entryModel = $scope.currentUser;
                if ($scope.entryModel.dob) {
                    $scope.entryModel.dobObj = moment($scope.entryModel.dob);
                }
            }
        );
        $scope.deleteAccount = function () {
            var con = confirm("Are you sure you want to delete the account? Everything will be erased.");
            if (con) {
                userService.delete($scope.entryModel._id).then(function () {
                    alert("Account Deleted");
                    location.href = "/";
                }, function () {
                    $scope.entryModel.errors = ["Something went wrong "];
                });
            }
        };
        $scope.editProfile = function () {
            $scope.entryModel.errors = [];
            var model = $scope.entryModel;
            model.gender = $scope.entryModel.genderObj.value;
            if ($scope.entryModel.dobObj) {
                model.dob = Math.round($scope.entryModel.dobObj.valueOf() / 1000);
            }
            delete model.errors;
            userService.edit(model).then(function (res) {
                if (res.success) {
                    Notification.success({message: 'Successfully updated your profile', delay: 5000});
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
                    Notification.success({message: 'Successfully updated your picture', delay: 5000});
                    $scope.uploaderText = null;
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
