const mongoose = require('mongoose');
const Activity = mongoose.model('Activity');
var ActivityDAO = {};
ActivityDAO.findById = function (id, callback) {
    Activity.findById(id, function (err, data) {
        if (err) {
            return callback(null);
        }
        Activity.populate(data, {"path":"createdBy"}, function(err, popData){
            if (err) {
                return callback(null);
            }
            callback(popData);
        });
    });
};
ActivityDAO.findByUserId = function (user_id, callback) {
    Activity.find({"createdBy": user_id}, function (err, data) {
        if (err) {
            return callback(null);
        }
        callback(data);
    });
};
module.exports = ActivityDAO;