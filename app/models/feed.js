var mongoose = require('mongoose');
/**
 * Mongo schema for Feed model
 * @class feedSchema
 */
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
/**
 * @module Feed
 */
module.exports = mongoose.model('Feed', feedSchema);