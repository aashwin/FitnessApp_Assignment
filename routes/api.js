var express = require('express');
var UserSystem = require('../framework/modules/user_system');
var router = express.Router();

router.get('/users', function (req, res, next) {
    UserSystem.test();
    res.send("GOT A GET REQUEST");
});

module.exports = router;
