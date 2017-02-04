//Load all needed modules
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
const config = require('./config');
var db = require('./framework/modules/database');
const debug = require('debug')(config.application.namespace);
var app = express();
//Configure our Application

app.set('views', path.join(__dirname, 'public/views'));
app.use(express.static(path.join(__dirname, 'public/assets')));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Source: http://expressjs.com/en/api.html#req.query
app.use(function (req, res, next) {
    debug("%s %s by %s", req.method, req.originalUrl, req.ip);
    next();
});

app.use('/', indexRouter);
app.use('/api', apiRouter);


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

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
debug('Booting up %s', config.application.name);

db.connect(function () {
    debug("Connect to database successfully")
    var server = app.listen(config.server.port, function () {
        var host = server.address().address;
        var port = server.address().port;

        debug("Server started listening at http://%s:%s", host, port);
    });
});
module.exports = app;
