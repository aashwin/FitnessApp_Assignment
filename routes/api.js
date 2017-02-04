var express = require('express');
var userController = require('../controllers/api/users.controller');
var router = express.Router();

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);

module.exports = router;
