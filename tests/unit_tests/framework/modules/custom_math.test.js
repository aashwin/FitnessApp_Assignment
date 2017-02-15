var chai = require('chai');
var mongoose = require('mongoose');
var expect = chai.expect;
var CustomMath = require('../../../../framework/modules/custom_math');

describe('Framework -> Custom Math Tests', function () {
    describe('Tests for distanceBetween()', function () {
        it('distanceBetween() should give valid answer when valid input given.', function () {
            const expectedDistance = 96.74194785413292; //Verified using http://www.movable-type.co.uk/scripts/latlong.html
            return expect(CustomMath.distanceBetween(52.920559, -1.484338, 52.920562, -1.485781)).to.be.equal(expectedDistance);
        });
        it('distanceBetween() should return 0 when both latLong inputs are same', function () {
            return expect(CustomMath.distanceBetween(10, 10, 10, 10)).to.be.equal(0);
        });
    });
    describe('Tests for isNumber()', function () {

        it('isNumber() should return true when a string which is a number is inputted', function () {
            return expect(CustomMath.isNumber("1000")).to.be.true;
        });
        it('isNumber() should return true when a string which is a negative number is inputted', function () {
            return expect(CustomMath.isNumber("-11")).to.be.true;
        });
        it('isNumber() should return true when a string which is a 0 is inputted', function () {
            return expect(CustomMath.isNumber("0")).to.be.true;
        });
        it('isNumber() should return true when a string which is a decimal is inputted', function () {
            return expect(CustomMath.isNumber("1.21")).to.be.true;
        });
        it('isNumber() should return true when a string which begins with a . is inputted', function () {
            return expect(CustomMath.isNumber(".21")).to.be.true;
        });
        it('isNumber() should return false when a string which is not a proper number is inputted', function () {
            return expect(CustomMath.isNumber("1.2.1")).to.be.false;
        });
        it('isNumber() should return false when a string which empty is inputted', function () {
            return expect(CustomMath.isNumber("")).to.be.false;
        });
        it('isNumber() should return false when a string is inputted', function () {
            return expect(CustomMath.isNumber("Hello World")).to.be.false;
        });
    });
    describe('Tests for calculateCalories()', function () {

        it('calculateCalories() should return 0 when weight is zero', function () {
            return expect(CustomMath.calculateCalories(0, 100, 10)).to.be.equal(0);
        });
        it('calculateCalories() should return 0 when distance is zero', function () {
            return expect(CustomMath.calculateCalories(110, 0, 10)).to.be.equal(0);
        });
    });
});