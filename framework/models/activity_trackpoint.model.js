const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityTrackPointSchema = new Schema({
    lat: {type: Number, required: true},
    long: {type: Number, required: true},
    dateTime: {type: Date, required: true, select:false},
    elevation: {type: Number, select:false},
    activityId: {type: mongoose.Schema.Types.ObjectId, ref: 'Activity', select:false}
});

mongoose.model('ActivityTrackPoint', ActivityTrackPointSchema);