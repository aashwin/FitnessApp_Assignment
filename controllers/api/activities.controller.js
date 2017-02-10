var ActivitySystem = require('../../services/activities');
var ActivityCommentSystem = require('../../services/activity_comments');
var ActivityTrackPointSystem = require('../../services/activity_trackpoints');
const config = require('../../config');
const debug = require('debug')(config.application.namespace);
var fs = require('fs');

exports.getAll = function (req, res, next) {
    var user = req.currentUser.get("_id") ? req.currentUser.get("_id") : null;
    if (req.query && req.query.createdBy === 'me') {
        req.query.createdBy = req.currentUser._id;
    }
    ActivitySystem.getAll(user, req.query).then(function (list) {
        res.status(200).json({"success": true, errors: [], "object": list});
    }, function () {
        res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": []});
    });
};
exports.getOne = function (req, res, next) {
    ActivitySystem.getOne(req.params.id).then(function (obj) {
            res.status(200).json({"success": true, errors: [], "object": obj});

        },
        function () {
            res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": []});
        }
    )
    ;
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
};

exports.canSee = function (req, res, next) {
    var user = req.currentUser;
    if (!user || !user._id) {
        res.status(403).json({
            "success": false,
            errors: ["Your not authorised to view this activity"],
            "object": null
        });
    }

    ActivitySystem.getOne(req.params.id).then(function (activity) {
            if (!activity) {
                res.status(403).json({
                    "success": false,
                    errors: ["Your not authorised to view this activity"],
                    "object": null
                });
            }

            var canSee = (user._id.toString() == activity.createdBy._id.toString()) || (activity.visibility === 0);
            if (!canSee && activity.visibility === 1) {
                for (var i = 0; i < activity.shared_with.length; i++) {
                    if (activity.shared_with[i].toString() == user._id.toString()) {
                        canSee = true;
                        break;
                    }
                }
            }
            if (canSee) {
                next()
            } else {
                res.status(403).json({
                    "success": false,
                    errors: ["Your not authorised to view this activity"],
                    "object": null
                });
            }
        },
        function () {
            res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": []});
        }
    );
};