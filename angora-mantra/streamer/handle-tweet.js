var db = require('../db'),
    XRegExp = require('xregexp').XRegExp;

var reAnagramable = XRegExp('^(\\p{Cyrillic}|[^\\p{N}\\p{L}])+$'),
    reNotCyrillic = XRegExp('\\p{^Cyrillic}+');

function makeFiniteRide(text) {
    var fr = {};
    text.toLowerCase().replace('ё', 'е').split('').forEach(function(ltr) {
        fr[ltr] = 1 + (fr[ltr] || 0);
    });
    return Object.keys(fr).sort()
        .map(function(ltr) {
            return ltr + (fr[ltr] === 1 ? '' : fr[ltr].toString());
        }).join('');
}

module.exports = function(tweet) {
    if (!reAnagramable.test(tweet.text)) return;

    var cyrillic = XRegExp.replace(tweet.text, reNotCyrillic, '', 'all');
    if (cyrillic.length < 10) return;

    var fr = makeFiniteRide(cyrillic);
    console.log(fr + ": " + tweet.text);
}
