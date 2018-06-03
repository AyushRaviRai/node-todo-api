const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text : {
        type : String,
        required : true,
        minLength : 2,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    }, 
    status : {
        type : Number,
        default : 0
    },
    completedAt : {
        type : Number,
        default : null
    }
});


// Export Stuff
module.exports.Todo = Todo;