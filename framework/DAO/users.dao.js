var db = require("../modules/database");
var User = require('../../framework/models/user');
const COLLECTION = 'users';

var UserDAO = {};
UserDAO.findByUsername = function (username, callback) {
    db.get().collection(COLLECTION).findOne({username: username}, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, new User(data));
    });
};
UserDAO.findById = function (id, callback) {
    db.get().collection(COLLECTION).findOne({_id: new db.ObjectID(id)}, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, new User(data));
    });
};
UserDAO.create = function (user, callback) {
    db.get().collection(COLLECTION).insertOne(user.data, function (err, count) {
        if (err) {
            return callback(err);
        }
        callback(null, count);
    });
};
module.exports = UserDAO;