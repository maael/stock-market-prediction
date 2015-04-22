var mongoose = require('mongoose'),
    newsArticle = require('./newsArticle');
/**
 * Mongo schema for News model
 * @class newsSchema
 */
var newsSchema = mongoose.Schema({
    date: {type: Date, default: new Date, unqiue: true, index: true},
    articles: {type: [newsArticle.schema], default: []}
});
/**
 * @module News
 */
module.exports = mongoose.model('News', newsSchema);