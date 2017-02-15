const fs = require('fs');
const path = require('path');
const modelsDirectory = path.join(__dirname, '../../models/');
const routersDirectory = path.join(__dirname, '../../routes/');
const debug = require('debug')("fitness.app.framework");
var loadedModels = false, loadedRouters = false;

var loadModels = function () {
    var files = fs.readdirSync(modelsDirectory);
    for (var i = 0; i < files.length; i++) {
        if (files[i].endsWith(".js")) {
            require(path.join(modelsDirectory, files[i]));
            debug("Loaded Model: %s", path.join(modelsDirectory, files[i]));
        }
    }
    loadedModels = true;
};
var loadRouters = function (app) {
    if (!app) {
        throw new Error("App is required");
    }
    var files = fs.readdirSync(routersDirectory);
    for (var i = 0; i < files.length; i++) {
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
    loadedRouters = true;
};
var init = function (app, options) {
    debug("Framework Bootstrapping has begun...");
    //Source: http://expressjs.com/en/api.html#req.query
    if (!loadedModels) {
        loadModels();
    }
    if (app) {
        var Authenticator = require("./fp-authentication/Authenticator");
        if(Authenticator.isReady()){
            app.use(Authenticator.authenticatorMW());
        }
        app.use(require("./base_controller")(options));
        if (!loadedRouters) {
            loadRouters(app);
        }


        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }
};
module.exports = {'loadModels': loadModels, 'loadRouters': loadedRouters, 'startup': init};