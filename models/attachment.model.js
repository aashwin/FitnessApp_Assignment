const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttachmentSchema = new Schema({
    url: {type: String},
    type: {type: Number, enum: [0, 1, 2]} //0 is blog posts or direct links, 1 is image 2 is video
}, {
    timestamps: true
});

mongoose.model('Attachment', AttachmentSchema);