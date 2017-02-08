const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityTrackPointSchema = new Schema({
    lat: {type: Number, required: true},
    long: {type: Number, required: true},
    dateTime: {type: Date, required: true},
    elevation: {type: Number},
    activityId: {type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}

});

mongoose.model('ActivityTrackPoint', ActivityTrackPointSchema);