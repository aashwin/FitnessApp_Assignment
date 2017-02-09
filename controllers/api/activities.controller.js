var ActivitySystem = require('../../framework/modules/activities_system');
var ActivityCommentSystem = require('../../framework/modules/activity_comments_system');
var ActivityTrackPointSystem = require('../../framework/modules/activity_trackpoints_system');
const config = require('../../config');
const debug = require('debug')(config.application.namespace);
var fs = require('fs');

exports.getAll = function (req, res, next) {
    if (req.currentUser) {
        ActivitySystem.getAll(req.currentUser.get("_id")).then(function (list) {
            res.status(200).json({"success": true, errors: [], "object": list});
        }, function () {
            res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": []});
        });
    }
};
exports.getOne = function (req, res, next) {
    ActivitySystem.getOne(req.params.id).then(function (obj) {
        res.status(200).json({"success": true, errors: [], "object": obj});
    }, function () {
        res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": []});
    });
};
exports.getActivityComments = function (req, res, next) {
    ActivityCommentSystem.getAllForActivity(req.params.id).then(function (obj) {
        res.status(200).json({"success": true, errors: [], "object": obj});
    }, function () {
        res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": []});
    });
};
exports.getActivityTrackPoints = function (req, res, next) {
    ActivityTrackPointSystem.getAllForActivity(req.params.id).then(function (obj) {
        res.status(200).json({"success": true, errors: [], "object": obj});
    }, function () {
        res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": []});
    });
};

exports.addComment = function (req, res, next) {
    if (req.currentUser) {
        var response = {errors: [], success: false, object: null};
        ActivityCommentSystem.validateAndClean(req.params.id, req.body, req.currentUser).then(function (activityComment) {
            activityComment = ActivityCommentSystem.createComment(activityComment);
            response.success = true;
            response.object = activityComment;
            res.status(201).json(response);
        }, function (ret) {
            response.errors = ret || ["Something went wrong!"];
            res.status(400).json(response);
        });

    }
};

exports.createActivity = function (req, res, next) {
    if (req.currentUser) {

        var response = {errors: [], success: false, object: null};
        if (req.file) {
            ActivitySystem.validateAndProcessGPXFile(req.file).then(function (gpxData) {
                req.body.distance = Number(gpxData.distance.toFixed(2));
                req.body.dateTime = Math.round(gpxData.startTime / 1000);
                req.body.distanceType = {"value": 1, "label": "Meters"};
                req.body.elevation = Number(gpxData.elevation.toFixed(2));
                req.body.durationH = gpxData.durationH;
                req.body.durationM = gpxData.durationM;
                req.body.durationS = gpxData.durationS;
                ActivitySystem.validateAndClean(req.body, req.currentUser).then(function (activity) {
                    activity = ActivitySystem.createActivity(activity);
                    for (var i = 0; i < gpxData.trackPoints.length; i++) {
                        gpxData.trackPoints[i].activityId = activity._id;
                    }
                    ActivityTrackPointSystem.createTrackpoints(gpxData.trackPoints, function (err, points) {
                        response.success = true;
                        response.object = activity;
                        res.status(201).json(response);
                    });
                }, function (ret) {
                    response.errors = ret.errors || ["Something went wrong!"];
                    res.status(400).json(response);
                });

            });
            fs.unlink(req.file.path);
        } else {
            ActivitySystem.validateAndClean(req.body, req.currentUser).then(function (activity) {
                activity = ActivitySystem.createActivity(activity);
                response.success = true;
                response.object = activity;
                res.status(201).json(response);
            }, function (ret) {
                response.errors = ret.errors || ["Something went wrong!"];
                res.status(400).json(response);
            });
        }

    }
}
;
