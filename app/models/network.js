var mongoose = require('mongoose');

var networkSchema = mongoose.Schema({
    symbol: String,
    lastTrained: {type: Date, default: new Date},
    network: {
        inputs: {type: [], default: []},
        hiddens: {type: [], default: []},
        outputs: {type: [], default: []},
        options: mongoose.Schema.Types.Mixed,
        weightings: {type: mongoose.Schema.Types.Mixed, default: {}},
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

module.exports = mongoose.model('Network', networkSchema);