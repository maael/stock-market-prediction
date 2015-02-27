var mongoose = require('mongoose');

var followingSchema = mongoose.Schema({
    user: String,
    company: String
});

module.exports = mongoose.model('Following', followingSchema);