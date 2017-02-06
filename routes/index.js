var express = require('express');
var router = express.Router();

router.get(['/', '/register'], function (req, res, next) {
    res.render('index', {title: 'Fitness Tracker'});
});
router.get(['/app', '/app*'], function (req, res, next) {
    res.render('dashboard', {title: 'Dashboard'});
});

module.exports = router;
