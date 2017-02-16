var mongoose = require('mongoose');
var db = mongoose.connection;
const config = require('../../config');
mongoose.connect(config.database.url);
require('../../framework/modules/bootstrap').loadModels();

require('selenium-cucumber-js');
