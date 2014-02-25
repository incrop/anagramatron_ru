var db = require('../db'),
    XRegExp = require('xregexp').XRegExp;

var reAnagramable = XRegExp('^(\\p{Cyrillic}|[^\\p{N}\\p{L}])+$'),
    reNotCyrillic = XRegExp('\\p{^Cyrillic}+');

function makeId(text) {
    var freq = {};
    text.toLowerCase().replace('ё', 'е').split('').forEach(function(char) {
        freq[char] = 1 + (freq[char] || 0);
    });
    return Object.keys(freq).sort()
        .map(function(char) {
            return char + (freq[char] === 1 ? '' : freq[char].toString());
        }).join('');
}

module.exports = function(tweet) {
    if (!reAnagramable.test(tweet.text)) return;

    var cyrillic = XRegExp.replace(tweet.text, reNotCyrillic, '', 'all');
    if (cyrillic.length < 10) return;

    var id = makeId(cyrillic);
    console.log(id + ": " + tweet.text);
}
