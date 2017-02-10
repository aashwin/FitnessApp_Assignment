var mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function () {
    this.Given(/^That I ensure that no test users exists in the database$/, function () {
        return new Promise(function (resolve, reject) {
                {
                    User.remove({"username": /test_.*/i}, function (err, data) {
                        if (err) {
                            return reject();
                        }
                        resolve();
                    });
                }
            }
        );
    });

};