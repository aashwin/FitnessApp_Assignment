var xml2js = require('xml2js'), parser = new xml2js.Parser();
var fs = require('fs');
var GPXMetaData = require('./GPXMetaData');
var GPXTrackPoint = require('./GPXTrackPoint');
var GPXObject = require('./GPXObject');
exports.parseGpx = function (filePath, callback) {
    fs.readFile(filePath, function (error, file) {
        if (error) {
            callback(new Error("Could not open file: " + error));
            return;
        }
        exports.parseGpxString(file, callback);
    });
};
exports.parseGpxString = function (gpxString, callback) {
    parser.parseString(gpxString, function (error, result) {
        if (error) {
            callback(new Error("Could not parse XML file: " + error.message));
            return;
        }
        if (!result.gpx) {
            callback(new Error("Could not parse GPX file"));
            return;
        }
        var metadata = new GPXMetaData(result.gpx.metadata);
        var gpxObject = new GPXObject(metadata);
        if (result.gpx.trk && result.gpx.trk.length > 0) {
            var trackSeg = result.gpx.trk[0].trkseg;
            if (trackSeg && trackSeg.length > 0) {
                for (var i = 0; i < trackSeg[0].trkpt.length; i++) {
                    var trackPoint = new GPXTrackPoint(trackSeg[0].trkpt[i]);
                    gpxObject.trackPoints.push(trackPoint);
                }

            }
        }
        callback(null, gpxObject);

    });

};