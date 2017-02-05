var express = require('express');
var userController = require('../controllers/api/users.controller');
var router = express.Router();

router.post('/users', userController.createUser);
router.post('/authenticate', userController.authenticateUser);

module.exports = router;
