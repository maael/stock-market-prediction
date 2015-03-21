var mongoose = require('mongoose');

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

module.exports = mongoose.model('NewsArticle', newsArticleSchema);