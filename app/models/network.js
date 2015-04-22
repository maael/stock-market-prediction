var mongoose = require('mongoose');
/**
 * Mongo schema for Network model
 * @class networkSchema
 */
var networkSchema = mongoose.Schema({
    symbol: String,
    lastTrained: {type: Date, default: new Date},
    network: {
        layers: [],
        perceptrons: [{
            perOptions: mongoose.Schema.Types.Mixed,
            inputs: [],
            outputs: []
        }],
        netOptions: mongoose.Schema.Types.Mixed,
        weightMatrix: {type: mongoose.Schema.Types.Mixed, default: {}},
        activations: {type: mongoose.Schema.Types.Mixed, default: {}},
        deltas: {type: mongoose.Schema.Types.Mixed, default: {}},
        last: {
            prediction: {type: Number, default: 0},
            error: {
                RMSE: {type: Number, default: 0},
                MSRE: {type: Number, default: 0},
                CE: {type: Number, default: 0},
                RSquared: {type: Number, default: 0}
            }
        }
    }
});
/**
 * @module Network
 */
module.exports = mongoose.model('Network', networkSchema);