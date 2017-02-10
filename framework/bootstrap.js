const fs = require('fs');
const path = require('path');
const modelsDirectory = path.join(__dirname, 'models/');
const routersDirectory = path.join(__dirname, '../routes/');
const debug = require('debug')("fitness.app.aashwin");

var init = function (app) {
    debug("Framework Bootstrapping has begun...");
    var files = fs.readdirSync(modelsDirectory);
    for (var i = 0; i < files.length; i++) {
        if (files[i].endsWith(".js")) {
            require(path.join(modelsDirectory, files[i]));
            debug("Loaded Model: %s", path.join(modelsDirectory, files[i]));

        }
    }
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
};
module.exports = {'init': init};