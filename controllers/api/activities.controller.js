var ActivitySystem = require('../../framework/modules/activities_system');
const config = require('../../config');
const debug = require('debug')(config.application.namespace);

exports.getAll = function (req, res, next) {
    if (req.currentUser) {
        ActivitySystem.getAll(req.currentUser.get("_id")).then(function (list) {
            res.status(200).json({"success": true, errors: [], "object": list});
        }, function () {
            res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": []});
        });
    }
};
exports.createActivity = function (req, res, next) {
    if (req.currentUser) {

        var response = {errors: [], success: false, object: null};
        ActivitySystem.validateAndClean(req.body, req.currentUser).then(function (activity) {
            ActivitySystem.createActivity(activity);
            response.success = true;
            response.object = activity;
            res.status(201).json(response);
        }, function (ret) {
            response.errors = ret.errors || ["Something went wrong!"];
            res.status(400).json(response);
        });

    }
};
