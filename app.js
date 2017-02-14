//Load all needed modules
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require('body-parser');
const config = require('./config');
var mongoose = require('mongoose');
var db = mongoose.connection;
const debug = require('debug')(config.application.namespace);
var framework = require("./framework");

var app = express();

//Configure our Application
mongoose.connect(config.database.url);


app.set('views', path.join(__dirname, 'public/views'));
app.use(express.static(path.join(__dirname, 'public/assets')));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
framework.Bootstrap.loadModels();
framework.Authenticator.init(config.authentication, require("./services/users").getOnePrivate);
framework.Bootstrap.startup(app, config.application.data_handling);

app.use(function (err, req, res, next) {
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
debug('Booting up %s', config.application.name);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    debug("Connect to database successfully");
    var server = app.listen(config.server.port, function () {
        var host = server.address().address;
        var port = server.address().port;
        debug("Server started listening at http://%s:%s", host, port);
    });
});

module.exports = app;
