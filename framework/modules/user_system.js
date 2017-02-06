var UserDAO = require('../../framework/DAO/users.dao');
var bcrypt = require('bcrypt');
const config = require('../../config');
const debug = require('debug')(config.application.namespace);
var jwt = require('jwt-simple');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.isAuthorised = function (decoded) {
    if (decoded) {
        if (decoded.expiry && decoded.expiry > (new Date).getTime()) {
            if (decoded.user) {
                return true;
            }

        }
    }
    return false;
};
exports.getDecodedToken = function (encodedToken) {
    try {
        if (encodedToken) {
            return jwt.decode(encodedToken, config.application.jwt_token_secret);
        }
    } catch (e) {
        debug("Failed decoding %s auth token.", encodedToken, e);
    }
    return null;
};
exports.getOne = function (id) {
    return new Promise(function (resolve, reject) {
        UserDAO.findById(id, function (usr) {
            if (!usr) {
                reject();
                return;
            }
            resolve(usr);
            return;
        });
    });
};
exports.getLoggedInUser = function (encodedToken) {
    return new Promise(function (resolve, reject) {
        var decodedToken = exports.getDecodedToken(encodedToken);
        if (decodedToken.user) {
            UserDAO.findById(decodedToken.user, function (usr) {
                if (!usr) {
                    reject();
                    return;
                }
                resolve(usr);
                return;
            }, true);
        } else {
            reject();
        }
    });
};
exports.validateUser = function (username, password, confirmPassword) {
    var errors = [];
    username = username.toLowerCase();
    return new Promise(function (resolve, reject) {
        if (!username || username.length < 3 || username > 50) {
            errors.push('Username has to be between 3-50 characters');
        } else if (!username.match(/^[a-z0-9_-]+$/)) {
            errors.push('Username can only contain alphanumerics, underscores and hyphens');
        }
        if (!password || password.length < 6) {
            errors.push('Password has to be atleast 6 characters');
        }
        if (password != confirmPassword) {
            errors.push('Passwords must match!');
        }
        if (errors.length === 0) {
            UserDAO.findByUsername(username, false, function (usr) {
                var alreadyExists = false;

                if (usr) {
                    errors.push("Username already exists, try another!");
                    alreadyExists = true;
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
    var user = new User();
    user.username = username;
    user.hashed_password = password;
    user.save();
    return user;
};

exports.authenticateUser = function (username, password) {
    return new Promise(function (resolve, reject) {
        UserDAO.findByUsername(username, true, function (usr) {

            if (usr) {
                bcrypt.compare(password, usr.hashed_password, function (err, res) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (res) {
                        resolve(usr);
                    } else {
                        reject(null);
                    }
                    return;
                });
            } else {
                reject(null);
                return;
            }
        });
    });
};

exports.generateJWT = function (_id, expiry) {
    expiry = expiry || (new Date).getTime() + (86400 * 1000); //Defaults to 1 day.
    var token = {"user": _id, "expiry": expiry};
    return jwt.encode(token, config.application.jwt_token_secret);
};