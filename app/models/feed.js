var mongoose = require('mongoose');

var feedSchema = mongoose.Schema({
    title: String,
    description: String,
    link: String,
    lastBuildDate: {type: Date, default: new Date}
    image: {
        url: String,
        title: String
    }
});

module.exports = mongoose.model('Feed', feedSchema);