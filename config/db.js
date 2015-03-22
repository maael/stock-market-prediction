var dbURL = process.env.MONGOLAB_URI || 'mongodb://localhost/stock-market-prediction',
    testDbURL = process.env.MONGOLAB_URI || 'mongodb://localhost/stock-market-prediction-test';
module.exports = {
    url: dbURL,
    testURL: testDbURL
};