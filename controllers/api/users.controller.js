var UserSystem = require('../../services/users');
const config = require('../../config');
const debug = require('debug')(config.application.namespace);
const fs = require('fs');
const path = require('path');
exports.getUser = function (req, res, next) {
    if (req.currentUser) {
        res.status(200).json({"success": true, errors: [], "user": req.currentUser});
        return;
    }
    res.status(401).json({"success": false, errors: ["You are not authorized to request this information."]});
};
exports.getOne = function (req, res, next) {
    UserSystem.getOne(req.params.id).then(function (user) {
        res.status(200).json({"success": true, errors: [], "object": user});
    }, function () {
        res.status(404).json({"success": false, errors: ["No user found."]});
    });
};

exports.APIRequiresAuthentication = function (req, res, next) {
    var decodedToken = UserSystem.getDecodedToken(req.get(config.application.auth_token_header));
    if (decodedToken && UserSystem.isAuthorised(decodedToken)) {
        UserSystem.getLoggedInUser(req.get(config.application.auth_token_header)).then(function (currentUser) {
            req.currentUser = currentUser;
            next();
        }, function () {
            res.status(401).json({"success": false, errors: ["You are not authorized to request this information."]});
        });
    } else {
        res.status(401).json({"success": false, errors: ["You are not authorized to request this information."]});
    }
};
exports.authenticateUser = function (req, res, next) {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    var response = {errors: [], success: false, token: null, user: null};
    UserSystem.authenticateUser(username, password).then(function (user) {
        debug("Authenticated User: %s", username);
        response.success = true;
        response.token = UserSystem.generateJWT(user._id);
        response.user = user;
        res.status(200).json(response);
    }, function (err) {
        if (err) {
            debug("Authenticating user: %s failed because: " + err, username);
        } else {
            debug("Authentication failed for user %s", username);
        }
        response.errors.push("Username/Password incorrect, try again!");
        res.status(403).json(response);
    });

};
exports.createUser = function (req, res, next) {
    var response = {errors: [], success: false};
    UserSystem.validateUser(req.body, false)
        .then(function () {
            UserSystem.hashPassword(req.body.password).then(function (hash) {
                UserSystem.createUser(req.body.username, hash);
                response.success = true;
                res.status(201).json(response);
            }, function (error) {
                debug("Password hashing error: ", error);
                response.errors.push("Something went wrong, try again!");
                res.status(500).json(response);
            });

        }, function (ret) {
            var statusCode = ret.alreadyExists ? 409 : 403;
            response.errors = ret.errors || ["Something went wrong!"];
            res.status(statusCode).json(response);
        });
};
exports.updateProfilePic = function (req, res, next) {
    var response = {errors: [], success: false};
    if (req.currentUser._id.toString() !== req.params.id) {
        response.errors.push("You are not authorized to update this user!");
        res.status(403).json(response);
        return;
    }
    if (req.file) {
        if (req.file.size > 2097152) {
            response.errors.push("Too big!");
        }
        if (req.file.mimetype.indexOf("image/") !== 0) {
            response.errors.push("Invalid type");
        }
    }
    else {
        response.errors.push('Malformed data');
    }
    if (response.errors.length === 0) {
        var filename = req.file.filename + path.extname(req.file.originalname);
        fs.rename(req.file.path, path.join(__dirname, '../../public/assets/uploads/profile/' + filename), function (err) {
            if (!err) {
                UserSystem.updateUser(req.currentUser._id, {profile_pic: 'uploads/profile/' + filename}, true).then(function (data) {
                    if (fs.existsSync(path.join(path.join(__dirname, "../../public/assets/"), req.currentUser.profile_pic)))
                        fs.unlinkSync(path.join(path.join(__dirname, "../../public/assets/"), req.currentUser.profile_pic));
                    response.success = true;
                    res.status(201).json(response);

                }, function (err) {
                    if (fs.existsSync(path.join(__dirname, '../../public/assets/uploads/profile/' + filename)))
                        fs.unlinkSync(path.join(__dirname, '../../public/assets/uploads/profile/' + filename));
                    response.errors.push("Something went wrong, try again!");
                    res.status(500).json(response);
                });
            } else {
                response.errors.push("Something went wrong, try again!");
                res.status(400).json(response);
            }
        });
    } else {
        res.status(400).json(response);
    }
};
exports.updateUser = function (req, res, next) {
    var response = {errors: [], success: false};
    if (req.currentUser._id.toString() !== req.params.id || req.currentUser._id.toString() !== req.body._id) {
        response.errors.push("You are not authorized to update this user!");
        res.status(403).json(response);
        return;
    }
    UserSystem.validateUser(req.body, true)
        .then(function () {
            const plainText = req.body.password || "--";
            UserSystem.hashPassword(plainText).then(function (hash) {
                req.body.hashed_password = null;
                if (req.body.password) {
                    req.body.hashed_password = hash;
                }
                UserSystem.updateUser(req.currentUser._id, req.body).then(function (data) {
                    response.success = true;
                    response.object = data;
                    res.status(200).json(response);
                }, function (err) {
                    response.errors.push("Something went wrong, try again!");
                    res.status(500).json(response);
                });

            }, function (error) {
                debug("Password hashing error: ", error);
                response.errors.push("Something went wrong, try again!");
                res.status(500).json(response);
            });

        }, function (ret) {
            var statusCode = 400;
            response.errors = ret.errors || ["Something went wrong!"];
            res.status(statusCode).json(response);
        });
};