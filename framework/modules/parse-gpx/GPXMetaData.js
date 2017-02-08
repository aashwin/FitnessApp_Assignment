var GPXMetaData = function (metadataArray) {
    if (metadataArray && metadataArray.length > 0) {
        if (metadataArray[0].name && metadataArray[0].name.length > 0) {
            this.name = metadataArray[0].name[0];
        }
        if (metadataArray[0].time && metadataArray[0].time.length > 0) {
            this.time = metadataArray[0].time[0];
        }
    }
};
module.exports = GPXMetaData;