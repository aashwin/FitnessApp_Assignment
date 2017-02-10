var express = require('express');
var userController = require('../controllers/api/users.controller');
var activityController = require('../controllers/api/activities.controller');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var upload = multer({
    dest: path.join(__dirname, '../tmp/')
});
router.post('/authenticate', userController.authenticateUser);

router.get('/users/', userController.getUser);
router.post('/users', userController.createUser);
router.get('/users/:id([A-z0-9]+)', userController.getOne);
router.put('/users/:id([A-z0-9]+)', userController.updateUser);
router.put('/users/:id([A-z0-9]+)/profile_pic', upload.single('file'), userController.updateProfilePic);

router.get('/activities/', activityController.getAll);
router.post('/activities/', upload.single('file'), activityController.createActivity);
router.get('/activities/:id([A-z0-9]+)', activityController.canSee, activityController.getOne);
router.get('/activities/:id([A-z0-9]+)/comments', activityController.canSee, activityController.getActivityComments);
router.get('/activities/:id([A-z0-9]+)/trackpoints', activityController.canSee, activityController.getActivityTrackPoints);
router.post('/activities/:id([A-z0-9]+)/comments', activityController.canSee, activityController.addComment);

module.exports = router;
