var tokenizer = require('../background/tokenizer');
    frequency = require('word-frequency'),
    Word = require('../models/word');
var newLexical = function(text, callback) {
    var operationsDone = 0,
        operationsBeforeClose = 0,
        articleTitles = '';
    function closeCheck() {
        if(operationsDone === operationsBeforeClose) {
            callback();
        } else {
            setTimeout(function() { closeCheck() }, 1000);
        }
    }
    var frequencies = frequency(text);
    console.log(frequencies);
    operationsBeforeClose = Object.keys(frequencies).length;
    for(var word in frequencies) {
        var newWord = new Word();
        newWord.word = word;
        newWord.count = frequencies[word];
        newWord.token = tokenizer(word);
        console.log(newWord);
        newWord.save(function(err) {
            if(err) { throw err; }
            operationsDone += 1;
        });
    }
    closeCheck();
}

module.exports = newLexical;