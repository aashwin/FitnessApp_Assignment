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
ActivityDAO.findAll = function (user_id, query, req_info, callback) {
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
    query = Activity.find($queryObject);
    if (req_info.offset) {
        query.skip(req_info.offset);
    }
    if (req_info.limit) {
        query.limit(req_info.limit);
    }
    if (req_info.sort_field) {
        var sortObj = {};
        sortObj[req_info.sort_field] = req_info.sort_by;
        query.sort(sortObj);
    }
    query.exec(function (err, data) {
            if (err) {
                return callback(null);
            }
            Activity.populate(data, {"path": "createdBy"}, function (err, popData) {
                if (err) {
                    return callback(null);
                }
                Activity.count($queryObject, function (err, count) {
                    callback(popData, count || 0);
                });
            });
        }
    );
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
ActivityDAO.updateById = function (id, data, callback) {
    Activity.findOneAndUpdate({_id: id}, data, {upsert: false}, function (err, doc) {
        if (err) {
            callback(err);
        }
        callback(null, doc);
    });

};
module.exports = ActivityDAO;