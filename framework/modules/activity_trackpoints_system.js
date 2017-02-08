const mongoose = require('mongoose');
const ActivityTrackPoint = mongoose.model('ActivityTrackPoint');

exports.createTrackpoints = function (trackpoints, callback) {
    ActivityTrackPoint.create(trackpoints, function (err, points) {
        if (err) {
            callback(err);
        }
        callback(null, points);
    });
};