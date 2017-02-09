const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    dateTime: {type: Number},
    distanceInMeters: {type: Number, default: 0},
    elevationInMeters: {type: Number, default: 0},
    durationInSeconds: {type: Number, default: 0},
    notes: {type: String},
    visibility: {type: Number, enum: [0, 1, 2], select: true},
    shared_with: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', select: true}]
}, {
    timestamps: true
});

mongoose.model('Activity', ActivitySchema);