var chai = require('chai');
var mongoose = require('mongoose');
var expect = chai.expect;
var baseController = require("../../../framework/modules/base_controller");

describe('Framework -> Base Controller Tests', function () {

    it('baseController should return a valid EXPRESS middleware function', function () {
        return expect(baseController()).to.be.a('function').and.lengthOf(3);
    });
    it('baseController middleware function updates the request object with valid data', function () {
        var request = {query: {limit: 100, page: 99, sort_field: 'testField', sort_by: 'desc'}};
        var middleware = baseController({default_limit_per_page: 10, max_limit_per_page: 1000});

        middleware(request, {}, function () {
        });

        //Offset should be limit * page - limit
        var expected = {limit: 100, offset: 9800, page: 99, sort_by: 'desc', sort_field: 'testField'};
        return expect(request.request_info).to.deep.include(expected);
    });
    it('baseController middleware must set limit property to MAX LIMIT SIZE if the input limit exceeds it', function () {
        var request = {query: {limit: 100, page: 2, sort_field: 'val', sort_by: "unknown"}};
        var middleware = baseController({default_limit_per_page: 10, max_limit_per_page: 10});

        middleware(request, {}, function () {
        });

        var expected = {limit: 10, offset: 10, page: 2, sort_field: 'val', sort_by: "asc"};
        return expect(request.request_info).to.deep.include(expected);
    });
    it('baseController middleware must set default properties to request_info if invalid parameters are passed in', function () {
        var request = {query: {limit: -10, page: -100}};
        var middleware = baseController({default_limit_per_page: 10, max_limit_per_page: 10});

        middleware(request, {}, function () {
        });

        var expected = {limit: 10, offset: 0, page: 1};
        return expect(request.request_info).to.deep.include(expected);
    });
    it('baseController middleware must remove (ONLY REQUEST INFO) properties from the query property of the request object', function () {
        var request = {query: {limit: 100, page: 99, sort_field: 'testField', sort_by: 'desc', createdBy: 'aashwin'}};
        var middleware = baseController({default_limit_per_page: 10, max_limit_per_page: 10});

        middleware(request, {}, function () {
        });
        expect(request.query).to.not.have.all.keys('limit', 'page', 'sort_field', 'sort_by');
        return expect(request.query).to.have.property('createdBy');
    });
});