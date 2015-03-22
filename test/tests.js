var chai = require('chai'),
    should = chai.should(),
    mongoose = require('mongoose'),
    dbConfig = require('../config/db');

describe('models', function() {
    describe('company', function() {

    });
    describe('feed', function() {
        
    });
    describe('following', function() {
        
    });
    describe('marketData', function() {
        
    });
    describe('network', function() {
        
    });
    describe('news', function() {
        
    });
    describe('process', function() {
        
    });
    describe('users', function() {
        
    });
    describe('words', function() {
        
    });
});

describe('Background Processes', function() {
    var Process = require('../app/models/process');
    describe('annManager', function() {

    });
    describe('lexicalAnalyser', function() {
        var analyser = require('../app/background/lexicalAnalyser'),
            Word = require('../app/models/word');
        before(function(done) {
            mongoose.connect(dbConfig.testURL);
            if(dbConfig.url !== dbConfig.testURL) {
                Word.remove({}, function() {
                    Process.remove({}, function() {
                        done(); 
                    });  
                });
            } else {
                done();
            }
        });
        it('should save a process correctly', function(done) {
            analyser('', function() {
                Process.findOne({name: 'lexicalAnalyser'}, function(err, process) {
                    should.not.exist(err);
                    console.log(process.name);
                    process.should.be.an('object');
                    process.name.should.be.a('string');
                    process.lastUpdated.should.be.a('date');
                    process.lastRun.should.be.a('date');
                    process.started.should.be.a('date');
                    done();
                });
            });
        });
        it('should add words from new texts correctly', function(done) {
            analyser('this is a test', function() {
                Word.find(function(err, words) {
                    should.not.exist(err);
                    words.should.be.length(4);
                    done();
                });
            });
        });
        it('should add words from multiple new texts correctly', function(done) {
            analyser('this is another test', function() {
                Word.find(function(err, words) {
                    should.not.exist(err);
                    words.should.be.length(5);
                    for(var i = 0; i < words.length; i++) {
                        if(words[i].word === 'test') {
                            words[i].count.should.equal(2);
                        } else if(words[i].word === 'a') {
                            words[i].count.should.equal(1);
                        } else if(words[i].word === 'is') {
                            words[i].count.should.equal(2);
                        } else if(words[i].word === 'this') {
                            words[i].count.should.equal(2);
                        } else if(words[i].word === 'another') {
                            words[i].count.should.equal(1);
                        }
                    }
                    done();
                });
            });
        });
    });
    describe('marketQuoter', function() {

    });
    describe('newsWatcher', function() {

    });
    describe('tokenizer', function() {
        var tokenizer = require('../app/background/tokenizer'),
            testValue;
        it('should tokenize words correctly', function() {
            testValue = tokenizer('Test').toString();
            testValue.should.equal('84101115116')
        });
        it('should tokenize anagrams differently', function() {
            tokenizer('esTt').toString().should.not.equal(testValue);
        });
    });
});

describe('api', function() {
    describe('user', function() {
        describe('put', function() {

        });
    });
    describe('company', function() {
        describe('get', function() {

        });
        describe('put', function() {

        });
    });
    describe('news', function() {
        describe('get', function() {

        });
    });
});