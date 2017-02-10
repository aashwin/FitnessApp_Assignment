const mongoose = require('mongoose');
const ActivityComment = mongoose.model('ActivityComment');
var ActivityCommentDAO = {};
ActivityCommentDAO.findById = function (id, callback) {
    ActivityComment.findById(id, function (err, data) {
        if (err) {
            return callback(null);
        }
        ActivityComment.populate(data, {"path":"createdBy"}, function(err, popData){
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
        ActivityComment.populate(data, {"path":"createdBy"}, function(err, popData){
            if (err) {
                return callback(null);
            }
            callback(popData);
        });
    });
};
ActivityCommentDAO.findByActivityId = function (activity_id, callback) {
    ActivityComment.find({"activityId": activity_id}, function (err, data) {
        if (err) {
            return callback(null);
        }
        ActivityComment.populate(data, {"path":"createdBy"}, function(err, popData){
            if (err) {
                return callback(null);
            }
            callback(popData);
        });
    });
};
module.exports = ActivityCommentDAO;