const mongoose = require('mongoose');
const Activity = mongoose.model('Activity');
var ActivityDAO = {};
ActivityDAO.findById = function (id, callback) {
    Activity.findById(id, function (err, data) {
        if (err) {
            return callback(null);
        }
        Activity.populate(data, {"path": "createdBy"}, function (err, popData) {
            if (err) {
                return callback(null);
            }
            callback(popData);
        });
    });
};
ActivityDAO.findAll = function (user_id, query, callback) {
    var $queryObject = null;
    if (query) {
        $queryObject = {$and: query};
    }
    var $restricterQuery = {$or: [{visibility: 0}]};
    if (user_id) {
        $restricterQuery.$or.push({$and: [{visibility: 2}, {createdBy: user_id}]});
        $restricterQuery.$or.push({$and: [{visibility: 1}, {$or: [{createdBy: user_id}, {shared_with: user_id}]}]});
    }
    if ($queryObject) {
        $queryObject.$and.push($restricterQuery);
    } else {
        $queryObject = $restricterQuery;
    }
    Activity.find($queryObject, function (err, data) {
        if (err) {
            return callback(null);
        }
        Activity.populate(data, {"path": "createdBy"}, function (err, popData) {
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
ActivityDAO.delete = function (activity_id, callback) {
    var deleteArray = activity_id;
    if (!(activity_id instanceof Array)) {
        deleteArray = [activity_id];
    }
    Activity.remove({_id: {$in: deleteArray}}, function (err) {
        if (err) {
            return callback(err);
        }
        callback();
    });
};
module.exports = ActivityDAO;