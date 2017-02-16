var mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function () {
    this.Given(/^That I ensure that no test users exists in the database$/, function () {
        return new Promise(function (resolve, reject) {
                {
                    User.remove({"username": /user_test_.*/i}, function (err, data) {
                        if (err) {
                            return reject();
                        }
                        resolve();
                    });
                }
            }
        );
    });
    this.Then(/^I verify that user with username "([^"]*)" exists in the database$/, function (username) {
        return new Promise(function (resolve, reject) {
                {
                    User.count({"username": username}, function (err, count) {
                        if (err) {
                            return reject();
                        }
                        resolve(count);
                    });
                }
            }
        ).then(function (count) {
            return expect(count).to.be.equal(1);
        });
    })

};
