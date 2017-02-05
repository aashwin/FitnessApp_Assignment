var User = require('../../framework/models/user');
var bcrypt = require('bcrypt');
const config = require('../../config');

exports.validateUser = function (username, password, confirmPassword) {
    var errors = [];
    return new Promise(function (resolve, reject) {
        if (username.length < 3 || username > 50) {
            errors.push('Username has to be between 3-50 characters');
        }
        if (!username.match(/^[a-z0-9_-]+$/)) {
            errors.push('Username can only contain alphanumerics, underscores and hyphens');
        }
        if (password.length < 6) {
            errors.push('Password has to be atleast 6 characters');
        }
        if (password != confirmPassword) {
            errors.push('Passwords must match!');
        }
        if (errors.length === 0) {
            User.findByUsername(username, function (err, usr) {
                var alreadyExists = false;
                if (err) {
                    errors.push("Something went wrong, try again!")
                } else {
                    if (usr && usr.data) {
                        errors.push("Username already exists, try another!");
                        alreadyExists = true;
                    }
                }
                if (errors.length === 0) {
                    resolve();
                } else {
                    reject({"errors": errors, "alreadyExists": alreadyExists});
                }
            });
        } else {
            reject({"errors": errors, "alreadyExists": false});
        }
    });
};
//Source: https://github.com/kelektiv/node.bcrypt.js
exports.hashPassword = function (password) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(password, config.application.hashing.salt_work_factor, function (err, hash) {
            if (err) {
                reject(err);
                return;
            }
            resolve(hash);
        });
    });

};

exports.createUser = function (username, password) {
    return new Promise(function (resolve, reject) {
        var user = new User();
        user.set("username", username);
        user.set("password", password);
        user.create(function (err, count) {
            if (err || count.insertedCount !== 1) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};