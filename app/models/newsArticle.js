var mongoose = require('mongoose');
/**
 * Mongo schema for NewsArticle model
 * @class newsArticleSchema
 */
var newsArticleSchema = mongoose.Schema({
	guid: { type: String, unique: true, index: true },
    title: String,
    description: String,
    date: String,
    link: String,
    author: String,
    categories: [String],
    feed: {
        name: String,
        feed: String,
        feedType: String
    }
}, {_id: false});
/**
 * @module NewsArticle
 */
module.exports = mongoose.model('NewsArticle', newsArticleSchema);