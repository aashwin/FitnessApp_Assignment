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
    ActivityTrackPoint.find({"activityId": activity_id},'-_id lat long', function (err, data) {
        if (err) {
            return callback(null);
        }
        callback(data);
    });
};
module.exports = ActivityTrackPointDAO;