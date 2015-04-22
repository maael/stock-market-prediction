var cluster = require('cluster'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    dbConfig = require('../../config/db'),
    netConfig = require('../network/configuration'),
    Network = require('../models/network'),
    Company = require('../models/company'),
    Process = require('../models/process'),
    firstTimeSetUp = require('../firstTime/setup');
/**
 * The Artifical Neural Network Manager Process
 * @module annManager
 */
(function() {
    var process = new Process({
            name: 'annManager',
            started: moment().toISOString()
        });
    /**
     * Runs first time set up
     * @function firstTimeSetup
     */
    firstTimeSetUp(run);
    /**
     * Uses moment to calculate time to the end of the day in milliseconds
     * @returns {number}
     */
    function timeUntilEndOfDay() {
        var now = moment(),
            endOfDay = moment().endOf('day');
        return endOfDay - now;
    }
    /**
     * The main function that the process performs at intervals
     */
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
        if(mongoose.connection.readyState === 0) {
            mongoose.connect(dbConfig.url);
        }
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
                    console.log('Creating Network for ' + doc.symbol);
                    operationsBeforeClose += 1;
                    newSymbolNetwork = netConfig.generate();
                    var networkInfo = newSymbolNetwork.getNetwork();
                    newNetwork = new Network({
                        symbol: doc.symbol,
                        network: {
                            netOptions: networkInfo.options,
                            layers: networkInfo.layers,
                            perceptrons: networkInfo.perceptrons,
                            weightMatrix : networkInfo.weightMatrix,
                            activations: networkInfo.activations,
                            deltas: networkInfo.deltas
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