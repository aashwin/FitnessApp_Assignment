const mongoose = require('mongoose');
const ActivityTrackPoint = mongoose.model('ActivityTrackPoint');
var ActivityTrackPointDAO = {};
ActivityTrackPointDAO.findById = function (id, callback) {
    ActivityTrackPoint.findById(id, function (err, data) {
        if (err) {
            return callback(null);
        }

        callback(data);
    });
};

ActivityTrackPointDAO.findByActivityId = function (activity_id, callback) {
    ActivityTrackPoint.find({"activityId": activity_id}, '-_id lat long', function (err, data) {
        if (err) {
            return callback(null);
        }
        callback(data);
    });
};
ActivityTrackPointDAO.deleteByActivityId = function (activity_id, callback) {
    var deleteArray = activity_id;
    if (!(activity_id instanceof Array)) {
        deleteArray = [activity_id];
    }
    ActivityTrackPoint.remove({activityId: {$in: deleteArray}}, function (err) {
        if (err) {
            return callback(err);
        }
        callback();
    });
};
module.exports = ActivityTrackPointDAO;