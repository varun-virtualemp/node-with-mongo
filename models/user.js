const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required : true
    },
    first_name : {
        type: String,
        required : true
    },
    last_name : {
        type: String,
        required : true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    password : {
        type: String,
        required : true
    },
    created_by : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
}, {timestamps : true});

module.exports = mongoose.model('User', userSchema);