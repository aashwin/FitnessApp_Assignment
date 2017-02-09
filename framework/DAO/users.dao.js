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
UserDAO.findById = function (id, callback, internal) {
    internal = internal || false;
    User.findById(id, !internal ? 'name username' : 'name username dob weightInKg email profile_pic gender', function (err, data) {
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
module.exports = UserDAO;