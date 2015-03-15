var mongoose = require('mongoose'),
    newsArticle = require('./newsArticle');

var newsSchema = mongoose.Schema({
    date: {type: Date, default: new Date, unqiue: true, index: true},
    articles: {type: [newsArticle.schema], default: []}
});

module.exports = mongoose.model('News', newsSchema);