var express = require('express');
var userController = require('../controllers/api/users.controller');
var UserSystem = require('../framework/modules/user_system');
var router = express.Router();

router.post('/users', userController.createUser);
router.get('/users/', UserSystem.APIRequiresAuthentication, userController.getUser);
router.post('/authenticate', userController.authenticateUser);

module.exports = router;
