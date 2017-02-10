//Load all needed modules
var appBootstrap = require('./bootstrap');
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
appBootstrap.init(app);

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
