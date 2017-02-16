var unirest = require('unirest');
var test_config = require('../test.config.json');
var data = require("../modules/data");
module.exports = function () {
    this.BeforeFeatures(function (feature, done) {
        
        unirest.post(test_config.url + "api/authenticate/")
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
            .send({"username": test_config.test_user, "password": test_config.test_password})
            .end(function (response) {
                data.token = response.body.token;
                data.user_id = response.body._id;
                done();
            });
    });
};
