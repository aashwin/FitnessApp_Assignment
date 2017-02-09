var express = require('express');
var userController = require('../controllers/api/users.controller');
var activityController = require('../controllers/api/activities.controller');
var router = express.Router();
var multer  = require('multer')
var path  = require('path')
var upload = multer({
    dest: path.join(__dirname, '../tmp/')
});

router.post('/users', userController.createUser);
router.get('/users/', userController.APIRequiresAuthentication, userController.getUser);
router.get('/users/:id([A-z0-9]+)', userController.APIRequiresAuthentication, userController.getOne);
router.post('/authenticate', userController.authenticateUser);

router.get('/activities/', userController.APIRequiresAuthentication, activityController.getAll);
router.post('/activities/', userController.APIRequiresAuthentication, upload.single('file'), activityController.createActivity);
router.get('/activities/:id([A-z0-9]+)', userController.APIRequiresAuthentication, activityController.getOne);
router.get('/activities/:id([A-z0-9]+)/comments', userController.APIRequiresAuthentication, activityController.getActivityComments);
router.get('/activities/:id([A-z0-9]+)/trackpoints', userController.APIRequiresAuthentication, activityController.getActivityTrackPoints);
router.post('/activities/:id([A-z0-9]+)/comments', userController.APIRequiresAuthentication, activityController.addComment);

module.exports = router;
