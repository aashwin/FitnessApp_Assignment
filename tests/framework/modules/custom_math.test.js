var chai = require('chai');
var mongoose = require('mongoose');
var expect = chai.expect;
var CustomMath = require('../../../framework/modules/custom_math');

describe('Framework -> Custom Math Tests', function () {

    it('distanceBetween() should give valid answer when valid input given.', function () {
        const expectedDistance = 96.74194785413292; //Verified using http://www.movable-type.co.uk/scripts/latlong.html
        return expect(CustomMath.distanceBetween(52.920559, -1.484338, 52.920562, -1.485781)).to.be.equal(expectedDistance);
    });
    it('distanceBetween() should return 0 when both latLong inputs are same', function () {
        return expect(CustomMath.distanceBetween(10, 10, 10, 10)).to.be.equal(0);
    });
});