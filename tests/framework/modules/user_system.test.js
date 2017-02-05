var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var chaiAsPromised = require('chai-as-promised');
var UserSystem = require('../../../framework/modules/user_system');
var UserDAO = require('../../../framework/DAO/users.dao');
var User = require('../../../framework/models/user');
chai.use(chaiAsPromised);

const GOOD_STRONG_PASSWORD = "Y@rdNB@!A$jj";
const GOOD_STRONG_PASSWORD_2 = "a/SXlq£/e%ol";
const GOOD_USERNAME = "test-User_123";
const INVALID_USERNAME = "test-@123";
const SHORT_USERNAME = "aa";
const SHORT_PASSWORD = "pass1";

describe('Framework -> User System Tests', function () {
    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

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
    it('validateUser() should reject invalid characters in username with 1 error message.', function () {
        const expectedReturn = {"errors": ["Username can only contain alphanumerics, underscores and hyphens"], "alreadyExists": false};
        var validationPromise = UserSystem.validateUser(INVALID_USERNAME, GOOD_STRONG_PASSWORD, GOOD_STRONG_PASSWORD);
        return expect(validationPromise).to.be.rejected.and.become(expectedReturn);
    });
    it('validateUser() should resolve when all validations passes', function () {
        var findByUsernameStub = sandbox.stub(UserDAO, 'findByUsername');
        findByUsernameStub.yields(null, new User(null));
        var validationPromise = UserSystem.validateUser(GOOD_USERNAME, GOOD_STRONG_PASSWORD, GOOD_STRONG_PASSWORD);
        return expect(validationPromise).to.be.fulfilled;
    });
    it('validateUser() should reject and alreadyExists should be false when username already exists', function () {
        const expectedReturn = {"errors": ["Username already exists, try another!"], "alreadyExists": true};
        var findByUsernameStub = sandbox.stub(UserDAO, 'findByUsername');
        findByUsernameStub.yields(null, new User({"username": GOOD_USERNAME}));
        var validationPromise = UserSystem.validateUser(GOOD_USERNAME, GOOD_STRONG_PASSWORD, GOOD_STRONG_PASSWORD);
        return expect(validationPromise).to.be.rejected.and.become(expectedReturn);
    });
});