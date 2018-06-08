const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI).then((pataNahi) => {
}).catch((error) => {
    console.log(error);
});

// Exporting sTuff
module.exports.mongoose = mongoose;