var ActivityDAO = require('../DAO/activities.dao.js');
var ActivityTrackPointService = require("../services/activity_trackpoints");
var ActivityCommentService = require("../services/activity_comments");
var UserDAO = require('../DAO/users.dao.js');
const mongoose = require('mongoose');
const Activity = mongoose.model('Activity');
const validator = require('validator');
var parseGpx = require('../framework/modules/parse-gpx/parse-gpx');
var CustomMath = require('../framework/modules/custom_math');
exports.getAll = function (userId, query, request_info) {
    return new Promise(function (resolve, reject) {
        var queryNew = [];
        if (query) {
            for (var q in query) {
                if (query.hasOwnProperty(q)) {
                    var obj = {};
                    if (CustomMath.isNumber(query[q])) {
                        obj[q] = parseInt(query[q]);
                    } else if (q === '_id' || q === 'createdBy') {
                        obj[q] = query[q];
                    } else {
                        obj[q] = new RegExp(query[q], "i");
                    }
                    queryNew.push(obj);
                }
            }
        }
        ActivityDAO.findAll(userId, queryNew, request_info, function (activitiesList, count) {
            if (!activitiesList || !(activitiesList instanceof Array)) {
                reject();
                return;
            }
            count = count || activitiesList.length || 0;
            resolve({"list": activitiesList, "count": count});
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
    return activity2.save().then(function (activity2) {
        return activity2;
    }, function(err){
        return null;
    });
};
exports.updateActivity = function (id, data) {

    return new Promise(function (resolve, reject) {
        if (!data) {
            reject("No data");
            return;
        }
        delete data.createdAt;
        delete data._id;
        delete data.__v;
        delete data.updatedAt;
        delete data.createdBy;
        ActivityDAO.updateById(id, data, function (err, activity) {
            if (err) {
                reject(err);
            }
            resolve(activity);
        });
    });
};

exports.validateAndClean = function (data, user) {
    var errors = [];
    return new Promise(function (resolve, reject) {
            if (data) {
                data.name = validator.trim(data.name || "");
                data.distanceInMeters = parseFloat(data.distanceInMeters || 0);
                data.activityType = parseInt(data.activityType || 0);
                data.dateTime = parseInt(data.dateTime || 0);
                data.elevationInMeters = parseFloat(data.elevationInMeters || 0);
                data.durationInSeconds = parseInt(data.durationInSeconds || 0);
                data.visibility = parseInt(data.visibility || 0);
                data.notes = data.notes || "";
                data.shared_with = data.shared_with || [];
                if (!data.attachedMedia || !data.attachedMedia instanceof Array) {
                    data.attachedMedia = []
                }
                if (!data.shared_with || !data.shared_with instanceof Array) {
                    data.shared_with = []
                }
                for (var xi = 0; xi < data.attachedMedia.length; xi++) {
                    if (data.attachedMedia[xi] instanceof Object) {
                        var obj = data.attachedMedia[xi];
                        obj.type = parseInt(obj.type || 0);
                        if (obj.type < 0 || obj.type > 2) {
                            errors.push("One of the attachment type is invalid");
                        }
                        if (!obj.url || !validator.isURL(obj.url)) {
                            errors.push("One of the attachment URL is invalid")
                        }
                        data.attachedMedia[xi] = {url: obj.url, type: obj.type}
                    }
                }
                const now = (new Date).getTime() / 1000;
                if (data.name.length < 3 || data.name > 50) {
                    errors.push('Activity name has to be between 3-50 characters');
                } else if (!data.name.match(/^[a-zA-Z0-9_ #('")\[\]!@-]+$/)) {
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
                if (!data.activityType.toString().match(/^[0-9\.]+$/) || data.activityType < 0 || data.activityType > 2) {
                    errors.push('Activity Type not correct, try again!');

                }
                if (!data.distanceInMeters.toString().match(/^[0-9\.]+$/) || data.distanceInMeters < 0 || data.distanceInMeters > 999999) {
                    errors.push('Distance is too big, are you sure you did that much?');
                }

                if (!data.elevationInMeters.toString().match(/^[0-9\.]+$/) || data.elevationInMeters < 0 || data.elevationInMeters > 999) {
                    errors.push('Elevation must be between 0-999, are you sure you did that much?');
                }
                if (!data.durationInSeconds.toString().match(/^[0-9\.]+$/) || data.durationInSeconds < 0 || data.durationInSeconds > 500000) {
                    errors.push('Duration range is invalid');
                }
                if (data.visibility === 1 && data.shared_with.length > 0) {
                    for (var i = 0; i < data.shared_with.length; i++) {
                        var sharedUser = validator.trim(data.shared_with[i] || "").toLowerCase();
                        if (sharedUser.match(/^[a-z0-9_-]+$/)) {
                            data.shared_with[i] = (sharedUser);
                        }
                    }
                }
            }
            else {
                errors.push('Malformed data');
            }
            if (errors.length === 0) {
                UserDAO.findByListOfUsername(data.shared_with, function (users) {
                    var activity = {
                        name: validator.escape(data.name),
                        createdBy: user._id,
                        dateTime: data.dateTime,
                        distanceInMeters: data.distanceInMeters,
                        elevationInMeters: data.elevationInMeters,
                        durationInSeconds: data.durationInSeconds,
                        notes: validator.escape(validator.trim(data.notes)),
                        visibility: data.visibility,
                        shared_with: [],
                        attachedMedia: data.attachedMedia,
                        activityType: data.activityType
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
                if (file.size > 4194304) {
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
                if (!listOfActivities || !listOfActivities.list || !(listOfActivities.list instanceof Array)) {
                    reject();
                    return;
                }
                var activityIdList = [];
                for (var i = 0; i < listOfActivities.list.length; i++) {
                    activityIdList.push(listOfActivities.list[i]._id);
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