var cluster = require('cluster'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    dbConfig = require('../../config/db'),
    netConfig = require('../network/configuration'),
    Network = require('../models/network'),
    Company = require('../models/company'),
    Process = require('../models/process');

(function() {
    var interval = 1800000,
        process = new Process({
            name: 'annManager',
            started: moment().toISOString()
        });
    run();
    function timeUntilEndOfDay() {
        var now = moment(),
            endOfDay = moment().endOf('day');
        return endOfDay - now;
    }
    function run() {
        var operationsDone = 0,
            operationsBeforeClose = 0;
        function closeCheck() {
            if(operationsDone === operationsBeforeClose) {
                mongoose.connection.close();
            } else {
                setTimeout(function() { closeCheck() }, 1000);
            }
        }
        mongoose.connect(dbConfig.url);
        var companyStream,
            networkStream = Network.find().stream(),
            networkSymbols = [],
            newSymbolNetwork,
            newNetwork,
            networks = [];
        networkStream.on('data', function(doc) {
            networks.push(doc);
            networkSymbols.push(doc.symbol);
        });
        networkStream.on('close', function() {
            companyStream = Company.find().stream();
            companyStream.on('data', function(doc) {
                if(networkSymbols.indexOf(doc.symbol) === -1) {
                    //Initialise and save new network
                    operationsBeforeClose += 1;
                    newSymbolNetwork = netConfig.generate();
                    console.log(newSymbolNetwork.getLayer(0));
                    newNetwork = new Network({
                        symbol: doc.symbol,
                        network: {
                            inputs: newSymbolNetwork.getLayer(0),
                            hiddens: newSymbolNetwork.getLayer(1),
                            outputs: newSymbolNetwork.getLayer(2)
                        }
                    });
                    newNetwork.save(function(err) {
                        if(err) { throw err; }
                        operationsDone += 1;
                    });
                } else {
                    //Existing Network
                }
            });
            companyStream.on('close', function() {
                closeCheck();
            });
        });
        Process.incrementRuns('annManager', function(err) {
            if(err) { throw err; }
        });
        setTimeout(run, timeUntilEndOfDay());
    }
})();