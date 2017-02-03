var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbConfig = require('../config/db.config');
var instance = null;
exports.connect = function (callback) {
    if (instance) {
        callback();
        return;
    }
    MongoClient.connect(dbConfig.url, function (err, dbInstance) {
        if (err) {
            throw err;
        }
        instance = dbInstance;
        if (callback && typeof(callback) == 'function') {
            callback();
        }

    });
};

exports.get = function () {
    if (!instance) {
        exports.connect(function () {
            console.log("Connecting to database successful.");
        });
    }
    if (!instance) {
        console.log("Database connection not successful.");
        return false;
    }
    return instance;
};
exports.close = function (callback) {
    if (instance) {
        instance.close(function (err, result) {
            instance = null;
            callback(err);
        })
    }
};
