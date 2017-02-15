var appBootstrap = require('../../../framework/modules/bootstrap').startup(null);
var chai = require('chai');
var mongoose = require('mongoose');
var expect = chai.expect;
var sinon = require('sinon');
var chaiAsPromised = require('chai-as-promised');
var UserSystem = require('../../../services/users');
var UserDAO = require('../../../DAO/users.dao.js');
var User = mongoose.model("User"); //we are only including it to mock it with sinon
var bcrypt = require('bcrypt');
chai.use(chaiAsPromised);

const GOOD_STRONG_PASSWORD = "Y@rdNB@!A$jj";
const GOOD_STRONG_PASSWORD_2 = "a/SXlq£/e%ol";
const GOOD_USERNAME = "test-User_123";
const INVALID_USERNAME = "test-@123";
const SHORT_USERNAME = "aa";
const SHORT_PASSWORD = "pass1";


describe('Services -> Users Tests', function () {
    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('validateUser() should reject short username with 1 error message.', function () {
        const expectedReturn = {"errors": ["Username has to be between 3-50 characters"], "alreadyExists": false};
        const request = {
            'username': SHORT_USERNAME,
            'password': GOOD_STRONG_PASSWORD,
            'confirmPassword': GOOD_STRONG_PASSWORD
        };
        var validationPromise = UserSystem.validateUser(request);

        return expect(validationPromise).to.be.rejected.and.become(expectedReturn);
    });
    it('validateUser() should reject short password with 1 error message.', function () {
        const expectedReturn = {"errors": ["Password has to be atleast 6 characters"], "alreadyExists": false};
        const request = {
            'username': GOOD_USERNAME,
            'password': SHORT_PASSWORD,
            'confirmPassword': SHORT_PASSWORD
        };
        var validationPromise = UserSystem.validateUser(request);
        return expect(validationPromise).to.be.rejected.and.become(expectedReturn);
    });
    it('validateUser() should reject passwords that don\'t match with 1 error message.', function () {
        const expectedReturn = {"errors": ["Passwords must match!"], "alreadyExists": false};
        const request = {
            'username': GOOD_USERNAME,
            'password': GOOD_STRONG_PASSWORD,
            'confirmPassword': GOOD_STRONG_PASSWORD_2
        };
        var validationPromise = UserSystem.validateUser(request);
        return expect(validationPromise).to.be.rejected.and.become(expectedReturn);
    });
    it('validateUser() should reject invalid characters in username with 1 error message.', function () {
        const expectedReturn = {
            "errors": ["Username can only contain alphanumerics, underscores and hyphens"],
            "alreadyExists": false
        };
        const request = {
            'username': INVALID_USERNAME,
            'password': GOOD_STRONG_PASSWORD,
            'confirmPassword': GOOD_STRONG_PASSWORD
        };
        var validationPromise = UserSystem.validateUser(request);
        return expect(validationPromise).to.be.rejected.and.become(expectedReturn);
    });
    it('validateUser() should resolve when all validations passes', function () {
        var findByUsernameStub = sandbox.stub(UserDAO, 'findByUsername');
        findByUsernameStub.yields(null, null);
        const request = {
            'username': GOOD_USERNAME,
            'password': GOOD_STRONG_PASSWORD,
            'confirmPassword': GOOD_STRONG_PASSWORD
        };
        var validationPromise = UserSystem.validateUser(request);
        return expect(validationPromise).to.be.fulfilled;
    });
    it('validateUser() should reject and alreadyExists should be true when username already exists', function () {
        const expectedReturn = {"errors": ["Username already exists, try another!"], "alreadyExists": true};
        var findByUsernameStub = sandbox.stub(UserDAO, 'findByUsername', function (username, showPassword, callback) {
            callback(new User({"username": GOOD_USERNAME, "hashed_password": "hash"}));
        });
        const request = {
            'username': GOOD_USERNAME,
            'password': GOOD_STRONG_PASSWORD,
            'confirmPassword': GOOD_STRONG_PASSWORD
        };
        var validationPromise = UserSystem.validateUser(request);
        return expect(validationPromise).to.be.rejected.and.become(expectedReturn);
    });

    it('authenticateUser() should accept user in the database with matching password', function () {
        var expected = new User({"username": GOOD_USERNAME, "hashed_password": "hash"});
        var findByUsernameStub = sandbox.stub(UserDAO, 'findByUsername', function (username, showPassword, callback) {
            callback(expected);
        });
        var bycryptStub = sandbox.stub(bcrypt, 'compare');
        bycryptStub.yields(null, true);
        var authenticationPromise = UserSystem.authenticateUser(GOOD_USERNAME, GOOD_STRONG_PASSWORD);
        return expect(authenticationPromise).to.be.fulfilled.and.become(expected);
    });
    it('authenticateUser() should reject user who is not in database', function () {
        var findByUsernameStub = sandbox.stub(UserDAO, 'findByUsername');
        findByUsernameStub.yields(null, null);
        var authenticationPromise = UserSystem.authenticateUser(GOOD_USERNAME, "");
        return expect(authenticationPromise).to.be.rejected.and.become(null);
    });
});