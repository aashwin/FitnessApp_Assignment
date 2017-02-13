var UserDAO = require('../DAO/users.dao');
var ActivityService = require('../services/activities');
var bcrypt = require('bcrypt');
const config = require('../config');
const debug = require('debug')(config.application.namespace);
const mongoose = require('mongoose');
const User = mongoose.model('User');
var validator = require('validator');
var CustomMath = require('../framework/modules/custom_math');

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
exports.getAll = function (query, request_info) {
    var queryNew = [];
    if (query) {
        for (var q in query) {
            if (query.hasOwnProperty(q)) {
                var obj = {};
                if (CustomMath.isNumber(query[q])) {
                    obj[q] = parseInt(query[q]);
                } else if (mongoose.Types.ObjectId.isValid(query[q])) {
                    obj[q] = query[q];
                } else {
                    obj[q] = new RegExp(query[q], "i");
                }
                queryNew.push(obj);
            }
        }
    }
    return new Promise(function (resolve, reject) {
        UserDAO.findAll(queryNew, request_info, function (usersList, count) {
            if (!usersList || !(usersList instanceof Array)) {
                reject();
                return;
            }
            count = count || usersList.length || 0;
            resolve({"list": usersList, "count": count});
        });
    });
};
exports.getOnePrivate = function (id) {
    return new Promise(function (resolve, reject) {
        UserDAO.findById(id, function (usr) {
            if (!usr) {
                reject();
                return;
            }
            resolve(usr);
            return;
        }, true);
    });
};
exports.validateUser = function (data, isUpdate) {
    var errors = [];
    if (!isUpdate) {
        data.username = data.username.toLowerCase();
    }
    return new Promise(function (resolve, reject) {
        const now = (new Date).getTime() / 1000;
        if (!isUpdate) {
            if (!data.username || data.username.length < 3 || data.username > 50) {
                errors.push('Username has to be between 3-50 characters');
            } else if (!data.username.match(/^[a-z0-9_-]+$/)) {
                errors.push('Username can only contain alphanumerics, underscores and hyphens');
            }
        }
        if ((isUpdate && data.password) || (!isUpdate)) {
            if (!data.password || data.password.length < 6) {
                errors.push('Password has to be atleast 6 characters');
            }
            if (data.password != data.confirmPassword) {
                errors.push('Passwords must match!');
            }
        }
        if (data.name && data.name.length > 50) {
            errors.push("Name has to be less than 50 characters")
        }
        if (data.name && !data.name.match(/^[A-z0-9 ]+$/)) {
            errors.push('Name can only contain alphanumerics and spaces');
        }
        if (data.email && !validator.isEmail(data.email)) {
            errors.push('Email is not valid, try again');
        }
        if (data.gender && (data.gender !== 0 && data.gender !== 1 && data.gender !== 2)) {
            errors.push('Gender is not valid. [0 = Undefined, 1 = Male and 2 = Female]');
        }
        if (data.dob && (!data.dob.toString().match(/^[0-9\.]+$/) || data.dob > now)) {
            errors.push('Date of Birth cannot be in the future');
        }
        if (data.weight && !validator.isNumeric("" + data.weight)) { //validator validates string only...
            errors.push("Weight must be numeric");
        }

        if (errors.length === 0) {
            if (data.dob) {
                data.dob = new Date(data.dob * 1000);
            }
            if (!isUpdate) {
                UserDAO.findByUsername(data.username, false, function (usr) {
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
                resolve();
            }
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
    return user.save();
};

exports.updateUser = function (id, data, onlyProfilePic) {
    onlyProfilePic = onlyProfilePic || false;
    delete data.createdAt;
    delete data.username;
    delete data._id;
    delete data.__v;
    delete data.updatedAt;
    if (!onlyProfilePic) {
        delete data.profile_pic;
    }
    if (!data.hashed_password) {
        delete data.hashed_password;
    }
    return new Promise(function (resolve, reject) {
        UserDAO.updateById(id, data, function (err, user) {
            if (err) {
                reject(err);
            }
            resolve(user);
        });
    });
};

exports.deleteUser = function (id) {
    return new Promise(function (resolve, reject) {
        ActivityService.deleteByUserId(id).then(function () {
            UserDAO.deleteById(id, function (err) {
                if (err) {
                    reject();
                }
                resolve();
            });
        }, function () {
            reject();
        });
    });
}
;

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
