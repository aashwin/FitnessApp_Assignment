var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var AuthenticatorLoc = '../../../../../framework/modules/fp-authentication/Authenticator';
describe('Framework -> Authenticator', function () {
    var sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        delete require.cache[require.resolve(AuthenticatorLoc)]; //clear our nodejs module cache which messes up our tests.
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('Tests for AuthenticatorMW()', function () {
        it('authenticatorMW() should return a valid EXPRESS middleware function', function () {
            let Authenticator = require(AuthenticatorLoc);
            Authenticator.init({jwt_token_secret: "RANDOM"}, function (inUser) {
                return new Promise(function (resolve, reject) {
                    resolve({});
                })
            });
            return expect(Authenticator.authenticatorMW()).to.be.a('function').and.lengthOf(3);
        });

        it('authenticatorMW(): Should authenticate a valid token and set the request variable correctly', function (done) {
            let Authenticator = require(AuthenticatorLoc);
            var request = {
                originalUrl: "/api/test",
                get: (s)=> {
                    return 0;
                }
            };
            var expectedUser = {username: 'TestUser'};
            Authenticator.init({jwt_token_secret: "RANDOM", token_field: "X_AUTH_TOKEN"}, function (inUser) {
                return new Promise(function (resolve, reject) {
                    resolve(expectedUser);
                })
            });
            var encodedToken = Authenticator.tokenGenerator(123);

            var requestGetStub = sandbox.stub(request, 'get');
            requestGetStub.withArgs("X_AUTH_TOKEN").returns(encodedToken);

            Authenticator.authenticatorMW()(request, {}, (err) => {
                expect(err).to.be.undefined;
                expect(request.isAuthorised).to.be.true;
                expect(request.currentUser).to.be.deep.equal(expectedUser);
                done();
            });
        });
        it('authenticatorMW(): Should not try and authenticate token when URL is in whitelist', function (done) {
            let Authenticator = require(AuthenticatorLoc);
            var request = {
                originalUrl: "/api/test",
                get: (s)=> {
                    return 0;
                }
            };
            Authenticator.init({jwt_token_secret: "RANDOM", token_field: "X_AUTH_TOKEN", whitelist: ["/api/test"]}, function (inUser) {
                return new Promise(function (resolve, reject) {
                    resolve({});
                })
            });
            var requestGetStub = sandbox.stub(request, 'get');
            requestGetStub.withArgs("X_AUTH_TOKEN").returns("FAKE TOKEN");

            Authenticator.authenticatorMW()(request, {}, (err) => {
                expect(err).to.be.undefined;
                expect(request.isAuthorised).to.be.false;
                expect(request.currentUser).to.be.undefined;
                done();
            });
        });
    });
    describe('Tests for init()', function () {
        it('init() should require that JWT Secret is present in the options provided', function () {
            let Authenticator = require(AuthenticatorLoc);
            return expect(() => {
                Authenticator.init({}, (usr)=> {
                })
            }).to.throw(Error);
        });
        it('init() should make the Authenticator Module Ready after init is run', function () {
            let Authenticator = require(AuthenticatorLoc);
            Authenticator.init({jwt_token_secret: "RANDOM"}, function (inUser) {
                return new Promise(function (resolve, reject) {
                    resolve({});
                })
            });
            return expect(Authenticator.isReady()).to.be.true;
        });
        it('init(): Authenticator should not be ready if init has not been run.', function () {
            let Authenticator = require(AuthenticatorLoc);
            return expect(Authenticator.isReady()).to.be.false;
        });

    });
});