var config = require("../test.config.json")
module.exports = {
    token: "",
    convertVariables: function (variable) {
        "use strict";
        if (variable == '{{TEST_USERNAME}}') {
            return config.test_user;
        } else if (variable == '{{TEST_PASSWORD}}') {
            return config.test_password;
        }
        return variable;
    }
};