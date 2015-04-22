var mongoose = require('mongoose');
/**
 * Mongo schema for Following model
 * @class followingSchema
 */
var followingSchema = mongoose.Schema({
    user: String,
    company: String
});
/**
 * @module Following
 */
module.exports = mongoose.model('Following', followingSchema);