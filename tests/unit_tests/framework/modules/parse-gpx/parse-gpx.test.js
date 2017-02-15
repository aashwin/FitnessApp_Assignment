var gpxParser = require('../../../../../framework/modules/parse-gpx');
var chai = require('chai');
var expect = chai.expect;
const path = require('path');

describe('Framework -> Parse GPX', function () {

    it('parseGpx should return an GPXObject with expected values when a GPX file is loaded', function (done) {
        gpxParser.parseGpx(path.join(__dirname, '../../../../resources/gpx_test_file_1.gpx'), function (err, obj) {
            expect(err).to.be.null;
            expect(obj).to.not.be.null;
            expect(obj).to.be.a('Object');
            expect(obj.metadata).to.not.be.null;
            expect(obj.metadata.name).to.be.equal('Derby Run');
            expect(obj.trackPoints).to.not.be.null;
            expect(obj.trackPoints).to.be.lengthOf(3096); // This file contains 3096 trackpoints
            done();
        });
    });
    it('parseGpx should return error if file does not exist', function (done) {
        gpxParser.parseGpx(path.join(__dirname, '../../../../resources/SOME_NON_EXISTENT.gpx'), function (err, obj) {
            expect(err).to.not.be.null;
            expect(err).to.be.a('error');
            expect(err.message).to.contain("no such file");
            done();
        });
    });
    it('parseGpx should return error if file is not an xml file', function (done) {
        gpxParser.parseGpx(path.join(__dirname, '../../../../resources/random.json'), function (err, obj) {
            expect(err).to.not.be.null;
            expect(err).to.be.a('error');
            expect(err.message).to.contain("Could not parse XML file");
            done();
        });
    });
});