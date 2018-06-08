const {SHA256} = require('crypto-js');

var message = "I am user number 2 asshole";

var hash = SHA256(message).toString();

console.log(hash);
