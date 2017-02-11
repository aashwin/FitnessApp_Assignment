const mongoose = require('mongoose');
const ActivityComment = mongoose.model('ActivityComment');
var ActivityCommentDAO = {};
ActivityCommentDAO.findById = function (id, callback) {
    ActivityComment.findById(id, function (err, data) {
        if (err) {
            return callback(null);
        }
        ActivityComment.populate(data, {"path": "createdBy"}, function (err, popData) {
            if (err) {
                return callback(null);
            }
            callback(popData);
        });
    });
};
ActivityCommentDAO.findByUserId = function (user_id, callback) {
    ActivityComment.find({"createdBy": user_id}, function (err, data) {
        if (err) {
            return callback(null);
        }
        ActivityComment.populate(data, {"path": "createdBy"}, function (err, popData) {
            if (err) {
                return callback(null);
            }
            callback(popData);
        });
    });
};
ActivityCommentDAO.findByActivityId = function (activity_id, req_info, callback) {
    var queryObj = {"activityId": activity_id};
    var query = ActivityComment.find(queryObj);
    if (req_info.offset) {
        query.skip(req_info.offset);
    }
    if (req_info.limit) {
        query.limit(req_info.limit);
    }
    if (req_info.sort_field) {
        var sortObj = {};
        sortObj[req_info.sort_field] = req_info.sort_by;
        query.sort(sortObj);
    }
    query.exec(function (err, data) {
            if (err) {
                return callback(null);
            }
            ActivityComment.populate(data, {"path": "createdBy"}, function (err, popData) {
                if (err) {
                    return callback(null);
                }
                ActivityComment.count(queryObj, function (err, count) {
                    callback(popData, count || 0);
                });
            });
        }
    );
};
ActivityCommentDAO.deleteByActivityId = function (activity_id, callback) {
    var deleteArray = activity_id;
    if (!(activity_id instanceof Array)) {
        deleteArray = [activity_id];
    }
    ActivityComment.remove({activityId: {$in: deleteArray}}, function (err) {
        if (err) {
            return callback(err);
        }
        callback();
    });
};
module.exports = ActivityCommentDAO;