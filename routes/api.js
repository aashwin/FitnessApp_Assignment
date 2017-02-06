var express = require('express');
var userController = require('../controllers/api/users.controller');
var router = express.Router();

router.post('/users', userController.createUser);
router.get('/users/', userController.APIRequiresAuthentication, userController.getUser);
router.post('/authenticate', userController.authenticateUser);

module.exports = router;
