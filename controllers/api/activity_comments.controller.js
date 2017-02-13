var ActivityCommentSystem = require('../../services/activity_comments');
const config = require('../../config');
exports.getActivityComments = function (req, res, next) {
    ActivityCommentSystem.getAllForActivity(req.params.id, req.request_info).then(function (obj) {
        res.status(200).json({"success": true, errors: [], "object": obj.list, "count": obj.count});
    }, function () {
        res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": []});
    });
};
exports.addComment = function (req, res, next) {
    var response = {errors: [], success: false, object: null};
    ActivityCommentSystem.validateAndClean(req.params.id, req.body, req.currentUser).then(function (activityComment) {
        activityComment = ActivityCommentSystem.createComment(activityComment);
        response.success = true;
        response.object = activityComment;
        res.status(201).json(response);
    }, function (ret) {
        response.errors = ret || ["Something went wrong!"];
        res.status(400).json(response);
    });
};
exports.deleteComment = function (req, res, next) {
    if (req.activity) {
        ActivityCommentSystem.getOne(req.params.comment_id).then(function (activityComment) {
            if (activityComment.createdBy && activityComment.createdBy._id.toString() == req.currentUser._id.toString()) {

                ActivityCommentSystem.delete(req.params.comment_id).then(function () {
                    res.status(200).json({"success": true, errors: [], "object": null});
                }, function () {
                    res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": null});
                });

            } else {
                res.status(403).json({
                    "success": false,
                    errors: ["Your not authorised to delete this."],
                    "object": null
                });
            }
        }, function () {

        });


    } else {
        res.status(404).json({"success": false, errors: ["Something went wrong!"], "object": null});
    }
};
