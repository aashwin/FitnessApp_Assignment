const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityCommentSchema = new Schema({
    commentText: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    activityId: {type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}
}, {
    timestamps: true
});

mongoose.model('ActivityComment', ActivityCommentSchema);