var express = require('express');
var userController = require('../controllers/api/users.controller');
var activityController = require('../controllers/api/activities.controller');
var activityCommentController = require('../controllers/api/activity_comments.controller');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var upload = multer({
    dest: path.join(__dirname, '../tmp/')
});
router.post('/authenticate', userController.authenticateUser);

//Users
router.get('/users/', userController.getAll);
router.post('/users/', userController.createUser);
//Single User
router.get('/users/:id([A-z0-9]+)', userController.getOne);
router.delete('/users/:id([A-z0-9]+)', userController.deleteUser);
router.put('/users/:id([A-z0-9]+)', userController.updateUser);
router.put('/users/:id([A-z0-9]+)/profile_pic', upload.single('file'), userController.updateProfilePic);

//Activities
router.get('/activities/', activityController.getAll);
router.post('/activities/', upload.single('file'), activityController.createActivity);
//Single Activity
router.get('/activities/:id([A-z0-9]+)', activityController.canSee, activityController.getOne);
router.put('/activities/:id([A-z0-9]+)', activityController.canSee, activityController.editActivity);
router.delete('/activities/:id([A-z0-9]+)', activityController.canSee, activityController.deleteOne);
//Single Activity > Comments
router.get('/activities/:id([A-z0-9]+)/comments', activityController.canSee, activityCommentController.getActivityComments);
router.post('/activities/:id([A-z0-9]+)/comments', activityController.canSee, activityCommentController.addComment);
router.get('/activities/:id([A-z0-9]+)/comments/:comment_id([A-z0-9]+)', activityController.canSee, activityCommentController.getOne);
router.put('/activities/:id([A-z0-9]+)/comments/:comment_id([A-z0-9]+)', activityController.canSee, activityCommentController.updateComment);
router.delete('/activities/:id([A-z0-9]+)/comments/:comment_id([A-z0-9]+)', activityController.canSee, activityCommentController.deleteComment);
router.get('/activities/:id([A-z0-9]+)/trackpoints', activityController.canSee, activityController.getActivityTrackPoints);

module.exports = router;
