var GPXTrackPoint = function (trackPoint) {
    if (trackPoint) {
        this.lat = parseFloat(trackPoint.$.lat);
        this.long = parseFloat(trackPoint.$.lon);
        if (trackPoint.name.length > 0) {
            this.name = trackPoint.name[0];
        }
        if (trackPoint.ele.length > 0) {
            this.ele = parseFloat(trackPoint.ele[0]);
        }
        if (trackPoint.time.length > 0) {
            this.time = trackPoint.time[0];
        }
    }
};
module.exports = GPXTrackPoint;