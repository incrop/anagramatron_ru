var db = require('../db'),
    notifier = require('../notifier'),
    XRegExp = require('xregexp').XRegExp;

var reAnagramable = XRegExp('^(\\p{Cyrillic}|[^\\p{N}\\p{L}])+$'),
    reNotCyrillic = XRegExp('\\p{^Cyrillic}+');

function makeId(text) {
    var freq = {};
    text.toLowerCase().split('').forEach(function(char) {
        freq[char] = 1 + (freq[char] || 0);
    });
    return Object.keys(freq).sort()
        .map(function(char) {
            return char + (freq[char] === 1 ? '' : freq[char].toString());
        }).join('');
}

function normalizedText(text) {
    return XRegExp.split(text.toLowerCase(), reNotCyrillic).sort().join('');
}

function pushTweetToGroup(id, tweetRecord) {
    db.TweetGroup.findById(id, function(err, oldGroup) {
        if (err) throw err;

        if (oldGroup.tweets.some(function(existingRecord) {
            return existingRecord.text === tweetRecord.text
                || normalizedText(existingRecord.text) === normalizedText(tweetRecord.text);
        })) {
            console.log('Duplicate tweet for ' + id + ': ' + tweetRecord.id_str);
            return;
        }

        db.TweetGroup.update({
            _id: oldGroup._id,
            count: oldGroup.count
        }, {
            $inc: { count: 1 },
            $push: { tweets: tweetRecord }
        }, function(err, num) {
            if (err) throw err;
            if (num === 0) {
                pushTweetToGroup(id, tweetRecord);
            } else {
                console.log('Anagram found for ' + id);
                notifier.anagramFound(tweetRecord, oldGroup);
            }
        });
    });
}

function saveTweet(id, tweet) {
    var tweetRecord = {
        id_str: tweet.id_str,
        created_at: tweet.created_at,
        text: tweet.text,
        user_id_str: tweet.user && tweet.user.id_str,
        user_screen_name: tweet.user && tweet.user.screen_name
    };

    new db.TweetGroup({
        _id: id,
        count: 1,
        tweets: [tweetRecord]
    }).save(function (err) {
        if (err) {
            if (err.code !== 11000) throw err;
            pushTweetToGroup(id, tweetRecord);
        }
    });
}

module.exports = function(tweet) {
    if (!reAnagramable.test(tweet.text)) return;

    var cyrillic = XRegExp.replace(tweet.text, reNotCyrillic, '', 'all');
    if (cyrillic.length < 10) return;

    var id = makeId(cyrillic);
    console.log(id + ': ' + tweet.text);
    saveTweet(id, tweet);
}
