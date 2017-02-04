var db = require('../modules/database');
const COLLECTION = 'users';
var User = function (data) {
    if (data) {
        this.data = data;
    }
};

User.prototype.data = null;

User.prototype.get = function (name) {
    return this.data[name];
};

User.prototype.set = function (name, value) {
    if (this.data === null) {
        this.data = {};
    }
    this.data[name] = value;
};

User.prototype.create = function (callback) {
    db.get().collection(COLLECTION).insertOne(this.data, function (err, count) {
        if (err) {
            return callback(err);
        }
        callback(null, count);
    });
};

User.findByUsername = function (username, callback) {
    db.get().collection(COLLECTION).findOne({username: username}, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, new User(data));
    });
};
User.findById = function (id, callback) {
    db.get().collection(COLLECTION).findOne({_id: id}, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, new User(data));
    });
};

module.exports = User;