const mongoose = require('mongoose');
const Activity = mongoose.model('Activity');
var ActivityDAO = {};
ActivityDAO.findById = function (id, callback) {
    Activity.findById(id, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, data);
    });
};
ActivityDAO.findByUserId = function (user_id, callback) {
    Activity.find({"createdBy": user_id}, function (err, data) {
        if (err) {
            return callback();
        }
        callback(data);
    });
};
module.exports = ActivityDAO;