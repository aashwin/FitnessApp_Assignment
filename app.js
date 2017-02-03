var express = require('express');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var api = require('./routes/api');
var config = require('./config');

var app = express();


app.set('views', path.join(__dirname, 'public/views'));
app.use(express.static(path.join(__dirname, 'public/assets')));

//Source for the idea for logging each request: https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
app.use(function (req, res, next) {
    console.log('Something is happening.');
    next();
});

app.use('/', index);
app.use('/api', api);

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

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
var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server started listening at http://%s:%s", host, port);
});

module.exports = app;
