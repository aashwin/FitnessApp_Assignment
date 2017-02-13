var ActivityCommentDAO = require('../DAO/activity_comments.dao.js');
var ActivityDAO = require('../DAO/activities.dao.js');
const mongoose = require('mongoose');
const ActivityComment = mongoose.model('ActivityComment');
var validator = require('validator');

exports.getOne = function (id) {
    return new Promise(function (resolve, reject) {
        ActivityCommentDAO.findById(id, function (activityComment) {
            if (!activityComment) {
                reject();
                return;
            }
            resolve(activityComment);
        });
    });
};
exports.getAllForActivity = function (id, request_info) {
    return new Promise(function (resolve, reject) {
        ActivityCommentDAO.findByActivityId(id, request_info, function (activitiesList, count) {
            if (!activitiesList || !(activitiesList instanceof Array)) {
                reject();
                return;
            }
            resolve({"list": activitiesList, "count": count});
        });
    });
};

exports.createComment = function (comment) {
    comment = new ActivityComment(comment);
    comment.save();
    return comment;
};

exports.validateAndClean = function (activityId, data, user) {
    var errors = [];
    return new Promise(function (resolve, reject) {
        if (data) {
            data.commentText = validator.trim(data.commentText) || "";
            if (data.commentText.length < 8) {
                errors.push("Comment text must be more than 8 characters long.");
            }
            if (data.commentText.length > 300) {
                errors.push("Comment text must be less than 300 characters.");
            }
            if (!data.activityId || !validator.isAlphanumeric(data.activityId)) {
                errors.push("Activity ID is malformed");
            } else if ((data.activityId !== activityId)) {
                errors.push("Activity ID is malformed");
            }
            data.commentText = validator.escape(data.commentText);
        } else {
            errors.push('Malformed data');
        }
        if (errors.length === 0) {
            ActivityDAO.findById(data.activityId, function (activity) {
                if (!activity) {
                    errors.push("Invalid activity ID");
                }
                if (errors.length === 0) {
                    var activityComment = {
                        commentText: data.commentText,
                        activityId: activity._id,
                        createdBy: user._id
                    };
                    resolve(activityComment);
                } else {
                    reject(errors);
                }
            });
        } else {
            reject(errors);
        }
    });
};
exports.deleteByActivityId = function (ids) {
    return new Promise(function (resolve, reject) {
        ActivityCommentDAO.deleteByActivityId(ids, function (err) {
            if (err) {
                reject();
            }
            resolve();
        });
    });
};
exports.delete = function (ids) {
    return new Promise(function (resolve, reject) {
        ActivityCommentDAO.delete(ids, function (err) {
            if (err) {
                reject();
            }
            resolve();
        });
    });
};