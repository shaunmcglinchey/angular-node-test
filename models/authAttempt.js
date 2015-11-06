var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Define our authentication attempt schema
var AuthAttemptSchema = new mongoose.Schema({
    ip: {
        type: String
    },
    username: {
        type: String
    },
    action: {
        type: String
    },
    datetime: Date
});

// on every save, add the date
AuthAttemptSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // if created_at doesn't exist, add to that field
    if (!this.datetime)
        this.datetime = currentDate;

    next();
});

// Export the Mongoose model
module.exports = mongoose.model('AuthAttempt', AuthAttemptSchema);