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
module.exports = ActivityTrackPointDAO;