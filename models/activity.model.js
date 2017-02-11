const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    dateTime: {type: Number},
    activityType: {type: Number, default: 0, enum: [0, 1, 2]},
    distanceInMeters: {type: Number, default: 0},
    elevationInMeters: {type: Number, default: 0},
    durationInSeconds: {type: Number, default: 0},
    notes: {type: String},
    visibility: {type: Number, enum: [0, 1, 2], select: true}, //0 for public, 1 for Selected 2 for me
    shared_with: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', select: true}],
    kCalBurnt: {type: Number}
}, {
    timestamps: true
});

mongoose.model('Activity', ActivitySchema);