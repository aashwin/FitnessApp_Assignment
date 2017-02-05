var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var UserSystem = require('../../../framework/modules/user_system');
chai.use(chaiAsPromised);

const GOOD_STRONG_PASSWORD = "Y@rdNB@!A$jj";
const GOOD_STRONG_PASSWORD_2 = "a/SXlq£/e%ol";
const GOOD_USERNAME = "test-User_123";
const SHORT_USERNAME = "aa";
const SHORT_PASSWORD = "pass1";

describe('Framework -> User System Tests', function () {
    it('validateUser() should reject short username with 1 error message.', function () {
        const expectedReturn = {"errors": ["Username has to be between 3-50 characters"], "alreadyExists": false};
        var validationPromise = UserSystem.validateUser(SHORT_USERNAME, GOOD_STRONG_PASSWORD, GOOD_STRONG_PASSWORD);

        return expect(validationPromise).to.be.rejected.and.become(expectedReturn);
    });
    it('validateUser() should reject short password with 1 error message.', function () {
        const expectedReturn = {"errors": ["Password has to be atleast 6 characters"], "alreadyExists": false};
        var validationPromise = UserSystem.validateUser(GOOD_USERNAME, SHORT_PASSWORD, SHORT_PASSWORD);
        return expect(validationPromise).to.be.rejected.and.become(expectedReturn);
    });
    it('validateUser() should reject passwords that don\'t match with 1 error message.', function () {
        const expectedReturn = {"errors": ["Passwords must match!"], "alreadyExists": false};
        var validationPromise = UserSystem.validateUser(GOOD_USERNAME, GOOD_STRONG_PASSWORD, GOOD_STRONG_PASSWORD_2);
        return expect(validationPromise).to.be.rejected.and.become(expectedReturn);
    });
});