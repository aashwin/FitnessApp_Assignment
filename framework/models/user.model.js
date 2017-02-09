const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, default: '', select: true},
    username: {type: String, select: true, required: true, lowercase: true, trim: true, unique: true},
    hashed_password: {type: String, required: true, select: false},
    email: {type: String, select: false},
    profile_pic: {type: String, select: true},
    gender: {type: Number, enum: [0, 1, 2], select: false}, //0 for undisclosed, 1 for Male 2 for Female
    weightInKg: {type: Number, select: false},
    dob: {type: Date, select: false}
}, {
    timestamps: true
});

mongoose.model('User', UserSchema);