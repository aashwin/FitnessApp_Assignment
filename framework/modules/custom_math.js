//Source: http://www.movable-type.co.uk/scripts/latlong.html
exports.distanceBetween = function(lat1, long1, lat2, long2){
    var R = 6371e3; // metres
    lat1=parseFloat(lat1);
    lat2=parseFloat(lat2);
    long1=parseFloat(long1);
    long2=parseFloat(long2);


    var lat1Radians = (lat1) * Math.PI / 180;
    var lat2Radians = lat2 * Math.PI / 180;
    var latDiffRadians = (lat2 - lat1) * Math.PI / 180;
    var longDiffRadians = (long2 - long1) * Math.PI / 180;

    var a = Math.sin(latDiffRadians / 2) * Math.sin(latDiffRadians / 2) +
        Math.cos(lat1Radians) * Math.cos(lat2Radians) *
        Math.sin(longDiffRadians / 2) * Math.sin(longDiffRadians / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return  R * c;
};