var UserSystem = require('../../framework/modules/user_system');
const config = require('../../config');
const debug = require('debug')(config.application.namespace);
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
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    var response = {errors: [], success: false};
    UserSystem.validateUser(username, password, confirmPassword)
        .then(function () {
            UserSystem.hashPassword(password).then(function (hash) {
                UserSystem.createUser(username, hash);
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