const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/NodeTodoApp');

// Exporting sTuff
module.exports.mongoose = mongoose;