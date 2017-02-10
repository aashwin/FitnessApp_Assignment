const mongoose = require('mongoose');
const ActivityTrackPoint = mongoose.model('ActivityTrackPoint');
var ActivityTrackPointDAO = require('../DAO/activity_trackpoints.dao.js');

exports.createTrackpoints = function (trackpoints, callback) {
    ActivityTrackPoint.create(trackpoints, function (err, points) {
        if (err) {
            callback(err);
        }
        callback(null, points);
    });
};
exports.getAllForActivity = function (id) {
    return new Promise(function (resolve, reject) {
        ActivityTrackPointDAO.findByActivityId(id, function (activitiesList) {
            if (!activitiesList || !(activitiesList instanceof Array)) {
                reject();
                return;
            }
            resolve(activitiesList);
        });
    });
};