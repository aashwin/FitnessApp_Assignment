var unirest = require('unirest');
var test_config = require('../test.config.json');
var data = require("../modules/data");

module.exports = function () {
    this.Given(/^That I ensure that no test users exists in the database$/, function (done) {
        unirest.get(test_config.url + "api/users/?limit=1000&username=user_test")
            .headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X_AUTH_TOKEN': data.token
            }).end(function (response) {
            "use strict";
            var x = 0;
            for (var i = 0; i < response.body.object.length; i++) {
                var listOfUsers = response.body.object || [];
                unirest.delete(test_config.url + "/api/users/" + listOfUsers[i]._id)
                    .headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X_AUTH_TOKEN': data.token
                    })
                    .end(function (response) {
                        x++;
                        if (x >= listOfUsers.length) {
                            done();
                        }
                    });
            }
        });
    });

    this.Then(/^I delete all activities of this user via the REST API$/, function (done) {
        unirest.get(test_config.url + "api/activities/?createdBy=me&limit=1000")
            .headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X_AUTH_TOKEN': data.token
            }).end(function (response) {
            "use strict";
            var x = 0;
            for (var i = 0; i < response.body.object.length; i++) {
                var listActivities = response.body.object || [];
                unirest.delete(test_config.url + "api/activities/" + listActivities[i]._id)
                    .headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X_AUTH_TOKEN': data.token
                    })
                    .end(function (response) {
                        x++;
                        if (x >= listActivities.length) {
                            done();
                        }
                    });
            }
        });
    })

}
;
