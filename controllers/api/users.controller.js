var UserSystem = require('../../framework/modules/user_system');
const config = require('../../config');
const debug = require('debug')(config.application.namespace);
exports.getAllUsers = function (req, res, next) {
    res.send("GOT A GET REQUEST");
};
exports.authenticateUser = function (req, res, next) {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    var response = {errors: [], success: false, token: null, user: null};
    UserSystem.authenticateUser(username, password).then(function (user) {
        debug("Authenticated User: %s", username);
        response.success = true;
        response.token = UserSystem.generateJWT(user["_id"]);
        response.user = user.get(null, true);
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
                UserSystem.createUser(username, hash)
                    .then(function () {
                        debug("Created User: %s", username);
                        response.success = true;
                        res.status(201).json(response);

                    }, function (err) {
                        debug("Create user error: ", error);

                        response.errors.push("Something went wrong, try again!");
                        res.status(500).json(response);
                    });
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