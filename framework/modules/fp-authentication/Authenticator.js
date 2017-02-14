var jwt = require("jwt-simple");
var options = {};
var isReady = false;
var func = null;
var init = function (opts, usrObjFunction) {
    options = opts;
    options.token_field = options.token_field || "X_AUTH_TOKEN";
    options.whitelist = options.whitelist || [];
    options.expiry = options.expiry || 86000;
    if (!options.jwt_token_secret) {
        throw new Error("JWT Token not valid");
    }

    if (!(options.whitelist instanceof Array)) {
        throw new Error("Whitelist must be an array.")
    }
    if (!usrObjFunction) {
        throw new Error(" Func is required");
    }
    func = usrObjFunction;
    isReady = true;
};
var authenticatorMW = function () {
    if (!isReady) {
        throw new Error("Authenticator has not been initialized");
    }
    if (!func || typeof func != 'function') {
        throw new Error("Please define User Object Function");
    }
    return function (req, res, next) {
        req.isAuthorised = false;
        if (options.whitelist) {
            var currentUrl = req.originalUrl.split("?")[0].replace(/\/+$/, "");
            var matchRegex;
            for (var i = 0; i < options.whitelist.length; i++) {
                if (typeof options.whitelist[i] == 'string') {
                    options.whitelist[i] = options.whitelist[i].replace(/\/+$/, "");
                    matchRegex = new RegExp("^" + options.whitelist[i].replace("/", "\/") + "\/?$");
                    if (currentUrl.match(matchRegex)) {
                        next();
                        return;
                    }
                } else {
                    if (options.whitelist[i].path && options.whitelist[i].method) {
                        options.whitelist[i].path = options.whitelist[i].path.replace(/\/+$/, "");
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
                            func(decoded.user).then(function (user) {
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
var tokenGenerator = function (user) {
    if (!isReady) {
        throw new Error("Authenticator has not been initialized");
    }
    var expiry = (new Date).getTime() + (options.expiry * 1000); //Defaults to 1 day.
    var token = {"user": user, "expiry": expiry};
    return jwt.encode(token, options.jwt_token_secret);
};

module.exports = {'init': init, 'authenticatorMW': authenticatorMW, 'tokenGenerator': tokenGenerator};