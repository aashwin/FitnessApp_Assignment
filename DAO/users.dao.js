const mongoose = require('mongoose');
const User = mongoose.model('User');

var UserDAO = {};
UserDAO.findByUsername = function (username, showPassword, callback) {
    showPassword = showPassword || false;
    User.findOne({username: username}, showPassword ? '+hashed_password' : '', function (err, data) {
        if (err) {
            return callback();
        }
        callback(data);
    });
};
UserDAO.findByListOfUsername = function (listOfUsernames, callback) {
    var ids = [], names = [];
    for (var i = 0; i < listOfUsernames.length; i++) {
        if (mongoose.Types.ObjectId.isValid(listOfUsernames[i])) {
            ids.push(listOfUsernames[i]);
        } else {
            names.push(listOfUsernames[i]);
        }
    }
    User.find({$or: [{username: {$in: names}}, {_id: {$in: ids}}]}, function (err, data) {
        if (err) {
            return callback();
        }
        callback(data);
    });
};
UserDAO.findById = function (id, callback, internal) {
    internal = internal || false;
    User.findById(id, !internal ? 'name username' : 'createdAt name username dob weightInKg email profile_pic gender', function (err, data) {
        if (err) {
            return callback();
        }
        callback(data);
    });
};
UserDAO.updateById = function (id, data, callback) {
    User.findOneAndUpdate({_id: id}, data, {upsert: false}, function (err, doc) {
        if (err) {
            callback(err);
        }
        callback(null, doc);
    });

};
UserDAO.deleteById = function (id, callback) {
    User.remove({_id: id}, function (err, doc) {
        if (err) {
            callback(err);
        }
        callback(null, doc);
    });

};
UserDAO.findAll = function (query, req_info, internal, callback) {
    var $queryObject = null;
    if (query) {
        $queryObject = {$and: query};
    }
    if ($queryObject.$and.length == 0) {
        $queryObject = {};
    }
    query = User.find($queryObject, !internal ? 'name username' : 'createdAt name username dob weightInKg email profile_pic gender');
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
            User.count($queryObject, function (err, count) {
                callback(data, count || 0);
            });
        }
    );
};
module.exports = UserDAO;