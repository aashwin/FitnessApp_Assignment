const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, default: ''},
    username: {type: String, required: true},
    hashed_password: {type: String, required: true, select: false}
},{
    timestamps: true
});

mongoose.model('User', UserSchema);