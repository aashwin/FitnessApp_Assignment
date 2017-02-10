//Load all needed modules
var framework = require('./framework/bootstrap');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require('body-parser');
const config = require('./config');
var mongoose = require('mongoose');
var db = mongoose.connection;
const debug = require('debug')(config.application.namespace);
var app = express();
//Configure our Application
mongoose.connect(config.database.url);
app.set('views', path.join(__dirname, 'public/views'));
app.use(express.static(path.join(__dirname, 'public/assets')));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

framework.init(app);
//Source: http://expressjs.com/en/api.html#req.query
app.use(function (req, res, next) {
    debug("%s %s by %s", req.method, req.originalUrl, req.ip);
    next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    if (req.originalUrl.startsWith("/api")) {
        res.json({"success": false, "object": null, "errors": ["Resource not found."]});
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
