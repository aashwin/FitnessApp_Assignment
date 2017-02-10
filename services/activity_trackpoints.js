const mongoose = require('mongoose');
const ActivityTrackPoint = mongoose.model('ActivityTrackPoint');
var ActivityTrackPointDAO = require('../DAO/activity_trackpoints.dao.js');
exports.new = function (lat, long, ele, date) {
    var tp = new ActivityTrackPoint();
    tp.lat = lat;
    tp.long = long;
    tp.ele = ele;
    tp.dateTime = date;
    return tp;
};
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
exports.deleteByActivityId = function (ids) {
    return new Promise(function (resolve, reject) {
        ActivityTrackPointDAO.deleteByActivityId(ids, function (err) {
            if (err) {
                reject();
            }
            resolve();
        });
    });
};