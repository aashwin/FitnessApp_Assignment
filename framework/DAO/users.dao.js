const mongoose = require('mongoose');
const User = mongoose.model('User');

var UserDAO = {};
UserDAO.findByUsername = function (username, showPassword, callback) {
    showPassword = showPassword || false;
    var q = User.findOne({username: username});
    if (showPassword) {
        q.select("+hashed_password");
    }
    q.exec(function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, data);
    });
};
UserDAO.findById = function (id, callback) {
    User.findById(id, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, data);
    });
};
module.exports = UserDAO;