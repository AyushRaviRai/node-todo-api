const mongoose = require('mongoose');

var User = mongoose.model('User', {
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        trime : true
    },
    password : {
        type : String,
        required : true
    }
});

module.exports.User = User;