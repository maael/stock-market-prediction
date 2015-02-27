var dbURL = process.env.MONGOLAB_URI || 'mongodb://localhost/stock-market-prediction';
module.exports = {
    url: dbURL
};