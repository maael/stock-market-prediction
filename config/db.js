var dbURL = process.env.MONGOLAB_URI || 'mongodb://localhost/stock-market-prediction',
    testDbURL = process.env.MONGOLAB_URI || 'mongodb://localhost/stock-market-prediction-test';
/**
 * Manages database settings
 * @module db
 * @author Matthew Elphick
 */
module.exports = {
    url: dbURL,
    testURL: testDbURL
};