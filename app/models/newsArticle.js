var mongoose = require('mongoose');

var newsArticleSchema = mongoose.Schema({
	guid: String,
    title: String,
    description: String,
    summary: String,
    date: String,
    link: String,
    auther: String,
    image: String,
    source: String,
    categories: [String],
    thumbnail: String
});

module.exports = mongoose.model('NewsArticle', newsArticleSchema);