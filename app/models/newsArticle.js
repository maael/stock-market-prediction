var mongoose = require('mongoose');

var newsArticleSchema = mongoose.Schema({
	guid: { type: String, unique: true },
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

newsArticleSchema.index({guid: 1});

module.exports = mongoose.model('NewsArticle', newsArticleSchema);