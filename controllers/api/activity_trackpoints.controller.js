var ActivityTrackPointSystem = require('../../services/activity_trackpoints');
const config = require('../../config');

exports.getActivityTrackPoints = function (req, res, next) {
    ActivityTrackPointSystem.getAllForActivity(req.params.id).then(function (obj) {
        res.status(200).json({"success": true, errors: [], "object": obj});
    }, function () {
        res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": []});
    });
};