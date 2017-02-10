const fs = require('fs');
const path = require('path');
const modelsDirectory = path.join(__dirname, 'models/');
const routersDirectory = path.join(__dirname, 'routes/');
const debug = require('debug')("fitness.app.aashwin");
const config = require('./config');
var framework = require("./framework");

var init = function (app) {
    debug("Framework Bootstrapping has begun...");
    //Source: http://expressjs.com/en/api.html#req.query
    var files = fs.readdirSync(modelsDirectory);
    for (var i = 0; i < files.length; i++) {
        if (files[i].endsWith(".js")) {
            require(path.join(modelsDirectory, files[i]));
            debug("Loaded Model: %s", path.join(modelsDirectory, files[i]));

        }
    }
    if (app) {
        app.use(function (req, res, next) {
            debug("%s %s by %s", req.method, req.originalUrl, req.ip);
            next();
        });
        app.use(framework.Authenticator.authenticatorMW(config.authentication, require("./services/users").getOnePrivate));

        files = [];
        i = 0;
        files = fs.readdirSync(routersDirectory);
        for (i = 0; i < files.length; i++) {
            if (files[i].endsWith(".js")) {
                var req = require(path.join(routersDirectory, files[i]));
                var route = "/" + files[i].substring(0, files[i].length - 3);
                if (route == '/index') {
                    route = ["/index", "/"];
                }
                app.use(route, req);
                debug("Loaded Router: %s and linked to %s", path.join(routersDirectory, files[i]), route);

            }
        }

        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            if (req.originalUrl.startsWith("/api")) {
                if (err.status == 401) {
                    res.json({
                        "success": false,
                        "object": null,
                        "errors": ["You are not authorized to request this information."]
                    });
                } else {
                    res.json({"success": false, "object": null, "errors": ["Resource not found."]});
                }
            } else {
                res.render('error');
            }
        });
    }
};
module.exports = {'init': init};