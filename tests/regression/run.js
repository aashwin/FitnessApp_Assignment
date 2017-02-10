var mongoose = require('mongoose');
var db = mongoose.connection;
const config = require('./config');
mongoose.connect(config.database.url);
require('../../bootstrap').init(null);

require('selenium-cucumber-js');