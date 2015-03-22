var bigInt = require('big-integer');
var tokenizer = function(word) {
   var token = '';
   for(var i = 0; i < word.length; i++) {
    token += word.charCodeAt(i).toString();
   }
   return bigInt(token);
};

module.exports = tokenizer;