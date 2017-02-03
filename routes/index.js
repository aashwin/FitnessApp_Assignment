var express = require('express');
var router = express.Router();

router.get(['/', '/register'], function(req, res, next) {
    res.render('index', { title: 'Fitness Tracker' });
});

module.exports = router;
