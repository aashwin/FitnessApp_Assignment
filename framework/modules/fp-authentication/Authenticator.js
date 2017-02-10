var jwt = require("jwt-simple");

var authenticatorMW = function (options, usrObjFunction) {
    options.token_field = options.token_field || "X_AUTH_TOKEN";
    options.whitelist = options.whitelist || [];
    if (!options.jwt_token_secret) {
        throw new Error("JWT Token not valid");
    }
    if (!usrObjFunction || typeof usrObjFunction != 'function') {
        throw new Error("Please define User Object Function");
    }
    if (!(options.whitelist instanceof Array)) {
        throw new Error("Whitelist must be an array.")
    }
    return function (req, res, next) {
        req.isAuthorised = false;
        if (options.whitelist) {
            var currentUrl = req.originalUrl.split("?")[0].replace(/\/+$/, "");
            var matchRegex;
            for (var i = 0; i < options.whitelist.length; i++) {
                if (typeof options.whitelist[i] == 'string') {
                    matchRegex = new RegExp("^" + options.whitelist[i].replace("/", "\/") + "\/?$");
                    if (currentUrl.match(matchRegex)) {
                        next();
                        return;
                    }
                } else {
                    if (options.whitelist[i].path && options.whitelist[i].method) {
                        matchRegex = new RegExp("^" + options.whitelist[i].path.replace("/", "\/") + "\/?");
                        if (currentUrl.match(matchRegex) && options.whitelist[i].method.toLowerCase() === req.method.toLowerCase()) {
                            next();
                            return;
                        }
                    }
                }
            }
        }
        var encodedToken = req.get(options.token_field);
        var err = new Error("Not Authorised");
        err.status = 401;
        try {
            if (encodedToken) {
                var decoded = jwt.decode(encodedToken, options.jwt_token_secret);
                if (decoded) {
                    if (decoded.expiry && decoded.expiry > (new Date).getTime()) {
                        if (decoded.user) {
                            usrObjFunction(decoded.user).then(function (user) {
                                req.isAuthorised = true;
                                req.currentUser = user;
                                next();
                            }, function () {
                                var err = new Error("Not Authorised");
                                err.status = 401;
                                next(err);
                            });
                        } else {
                            next(err);
                        }

                    } else {

                        next(err);
                    }
                } else {

                    next(err);
                }
            } else {

                next(err);
            }
        } catch (e) {
            next(e);
        }
    };
};

module.exports = {'authenticatorMW': authenticatorMW};