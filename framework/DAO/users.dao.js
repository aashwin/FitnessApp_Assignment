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
    User.findById(id, !internal ? 'name username' : '', function (err, data) {
        if (err) {
            return callback();
        }
        callback(data);
    });
};
module.exports = UserDAO;