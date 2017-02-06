var express = require('express');
var userController = require('../controllers/api/users.controller');
var activityController = require('../controllers/api/activities.controller');
var router = express.Router();

router.post('/users', userController.createUser);
router.get('/users/', userController.APIRequiresAuthentication, userController.getUser);
router.post('/authenticate', userController.authenticateUser);

router.get('/activities/', userController.APIRequiresAuthentication, activityController.getAll);
router.post('/activities/', userController.APIRequiresAuthentication, activityController.createActivity);

module.exports = router;
