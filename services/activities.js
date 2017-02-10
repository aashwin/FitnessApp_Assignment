var ActivityDAO = require('../DAO/activities.dao.js');
var ActivityTrackPointService = require("../services/activity_trackpoints")
var ActivityCommentService = require("../services/activity_comments")
var UserDAO = require('../DAO/users.dao.js');
const mongoose = require('mongoose');
const Activity = mongoose.model('Activity');
const validator = require('validator');
var parseGpx = require('../framework/modules/parse-gpx/parse-gpx');
var CustomMath = require('../framework/modules/custom_math');
exports.getAll = function (userId, query) {
    return new Promise(function (resolve, reject) {
        var queryNew = [];
        if (query) {
            for (var q in query) {
                if (query.hasOwnProperty(q)) {
                    var obj = {};
                    obj[q] = query[q];
                    queryNew.push(obj);
                }
            }
        }
        ActivityDAO.findAll(userId, queryNew, function (activitiesList) {
            if (!activitiesList || !(activitiesList instanceof Array)) {
                reject();
                return;
            }
            resolve(activitiesList);
        });
    });
};
exports.getOne = function (id) {
    return new Promise(function (resolve, reject) {
        ActivityDAO.findById(id, function (activity) {
            if (!activity) {
                reject();
                return;
            }
            resolve(activity);
        });
    });
};

exports.createActivity = function (activity) {
    var activity2 = new Activity(activity);
    activity2.save();
    return activity2;
};
exports.validateAndClean = function (data, user) {
    var errors = [];
    return new Promise(function (resolve, reject) {
            if (data) {
                data.name = validator.trim(data.name || "");
                data.distance = data.distance || 0;
                data.distanceType = data.distanceType || {"value": 0};
                data.distanceType.value = data.distanceType.value || 0;
                data.elevation = data.elevation || 0;
                data.durationH = data.durationH || 0;
                data.durationM = data.durationM || 0;
                data.durationS = data.durationS || 0;
                data.visibility = parseInt(data.visibility || 0);
                data.notes = data.notes || "";
                data.shared_with = data.shared_with || "";
                data.shared_with_processed = [];
                const now = (new Date).getTime() / 1000;
                if (data.name.length < 3 || data.name > 50) {
                    errors.push('Activity name has to be between 3-50 characters');
                } else if (!data.name.match(/^[a-zA-Z0-9_ #()\[\]!@-]+$/)) {
                    errors.push('Activity name contains some invalid characters');
                }
                if (!data.dateTime) {
                    errors.push('Date Time cannot be empty');

                } else if (!data.dateTime.toString().match(/^[0-9\.]+$/) || data.dateTime < now - (3600 * 24) * 2000 || data.dateTime > now) {
                    errors.push('Date Time cannot be in the future or very old');
                }

                if (data.visibility !== 0 && data.visibility !== 1 && data.visibility !== 2) {
                    errors.push("Visibility is not valid");
                }
                if (!data.distanceType.value.toString().match(/^[0-9\.]+$/) || data.distanceType.value > 2000 || data.distanceType.value <= 0) {
                    errors.push('Distance Type not correct, try again!');

                } else if (!data.distance.toString().match(/^[0-9\.]+$/) || data.distance * data.distanceType.value < 0 || data.distance * data.distanceType.value > 999999) {
                    errors.push('Distance is too big, are you sure you did that much?');
                }

                if (!data.elevation.toString().match(/^[0-9\.]+$/) || data.elevation < 0 || data.elevation > 999) {
                    errors.push('Elevation must be between 0-999, are you sure you did that much?');
                }
                if (!data.durationH.toString().match(/^[0-9\.]+$/) || data.durationH < 0 || data.durationH > 99) {
                    errors.push('Hours must be between 0-99, are you sure you did that much?');
                }
                if (!data.durationM.toString().match(/^[0-9\.]+$/) || data.durationM < 0 || data.durationM > 59) {
                    errors.push('Minutes must be between 0-59');
                }
                if (!data.durationS.toString().match(/^[0-9\.]+$/) || data.durationS < 0 || data.durationS > 59) {
                    errors.push('Seconds must be between 0-59');
                }
                if (data.visibility === 1 && data.shared_with.length > 0) {
                    var arrayOfShared = data.shared_with.split(",");
                    for (var i = 0; i < arrayOfShared.length; i++) {
                        var sharedUser = validator.trim(arrayOfShared[i] || "").toLowerCase();
                        if (sharedUser.match(/^[a-z0-9_-]+$/)) {
                            data.shared_with_processed.push(sharedUser);
                        }
                    }
                }
            }
            else {
                errors.push('Malformed data');
            }
            if (errors.length === 0) {
                UserDAO.findByListOfUsername(data.shared_with_processed, function (users) {
                    var activity = {
                        name: validator.escape(data.name),
                        createdBy: user._id,
                        dateTime: data.dateTime,
                        distanceInMeters: data.distance * data.distanceType.value,
                        elevationInMeters: data.elevation,
                        durationInSeconds: data.durationH * 3600 + data.durationM * 60 + data.durationS,
                        notes: validator.escape(validator.trim(data.notes)),
                        visibility: data.visibility,
                        shared_with: []
                    };
                    if (user.weightInKg && user.weightInKg > 0) {
                        activity.kCalBurnt = CustomMath.calculateCalories(user.weightInKg, activity.distanceInMeters, activity.durationInSeconds);
                    }

                    if (users && users.length > 0) {
                        for (var i = 0; i < users.length; i++) {
                            activity.shared_with.push(users[i]._id);
                        }
                    }
                    resolve(activity);
                });
            } else {
                reject({"errors": errors});
            }
        }
    );
};

exports.validateAndProcessGPXFile = function (file) {
    var errors = [];
    return new Promise(function (resolve, reject) {
            if (file) {
                if (file.size > 2097152) {
                    errors.push("GPX file is too big, try a smaller one!");
                }
            }
            else {
                errors.push('Malformed data');
            }
            if (errors.length === 0) {
                var gpxData = {
                    minElevation: null,
                    maxElevation: null,
                    startTime: null,
                    endTime: null,
                    durationH: 0,
                    durationM: 0,
                    durationS: 0,
                    distance: 0,
                    trackPoints: []
                };
                parseGpx.parseGpx(file.path, function (error, data) {
                        if (error) {
                            errors.push("The GPX file you uploaded cannot be parsed.");
                            reject({"errors": errors});
                        } else {
                            for (var i = 0; i < data.trackPoints.length; i++) {
                                var currentTrackPoint = data.trackPoints[i];

                                if (!gpxData.minElevation || gpxData.minElevation > currentTrackPoint.ele) {
                                    gpxData.minElevation = currentTrackPoint.ele;
                                }
                                if (!gpxData.maxElevation || gpxData.maxElevation < currentTrackPoint.ele) {
                                    gpxData.maxElevation = currentTrackPoint.ele;
                                }
                                var currentTime = Date.parse(currentTrackPoint.time);
                                if (!gpxData.startTime || gpxData.startTime > currentTime) {
                                    gpxData.startTime = currentTime;
                                }
                                if (!gpxData.endTime || gpxData.endTime < currentTime) {
                                    gpxData.endTime = currentTime;
                                }
                                if (i > 0) {
                                    var previousTrackPoint = data.trackPoints[i - 1];
                                    gpxData.distance += CustomMath.distanceBetween(previousTrackPoint.lat, previousTrackPoint.long, currentTrackPoint.lat, currentTrackPoint.long);
                                }
                                var tp = ActivityTrackPointService.new(currentTrackPoint.lat, currentTrackPoint.long, currentTrackPoint.ele, new Date(currentTime));
                                gpxData.trackPoints.push(tp);
                            }

                            if (gpxData.endTime !== null && gpxData.startTime !== null) {
                                var leftOver = gpxData.endTime / 1000 - gpxData.startTime / 1000;
                                gpxData.durationH = Math.floor(leftOver / 3600);
                                leftOver %= 3600;
                                gpxData.durationM = Math.floor(leftOver / 60);
                                leftOver %= 60;
                                gpxData.durationS = Math.round(leftOver);
                            }
                            gpxData.elevation = (!gpxData.maxElevation || !gpxData.minElevation ? 0 : gpxData.maxElevation - gpxData.minElevation);
                            resolve(gpxData);
                        }
                    }
                );
            }
            else {
                reject({"errors": errors});
            }
        }
    )
        ;
};

exports.deleteByUserId = function (user_id) {
    return new Promise(function (resolve, reject) {
        exports.getAll(user_id).then(function (listOfActivities) {
                if (!listOfActivities || !(listOfActivities instanceof Array)) {
                    reject();
                    return;
                }
                var activityIdList = [];
                for (var i = 0; i < listOfActivities.length; i++) {
                    activityIdList.push(listOfActivities[i]._id);
                }
                exports.delete(activityIdList).then(function () {
                    resolve(1);
                }, function () {
                    reject();
                });

            }, function () {
                reject();
            }
        );

    });
};
exports.delete = function (ids) {
    return new Promise(function (resolve, reject) {
        ActivityTrackPointService.deleteByActivityId(ids).then(function () {
            ActivityCommentService.deleteByActivityId(ids).then(function () {
                ActivityDAO.delete(ids, function (err) {
                    if (err) {
                        reject();
                    }
                    resolve();
                });
            }, function () {
                reject();

            });
        }, function () {
            reject();
        });
    });
};