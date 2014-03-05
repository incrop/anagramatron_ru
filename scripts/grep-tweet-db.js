var pattern = process.argv[2],
    mods = process.argv[3];

if (!pattern) {
    console.log('Regex pattern should be passed as an argument');
    process.exit(1);
}
console.log(pattern);

var regexp = new RegExp(pattern, mods);

require('../lib/db').open().then(function(db) {
    db.TweetGroup.find({
        tweets: {$elemMatch: {text: regexp}}
    }, function(err, groups) {
        if (err) throw err;
        groups.forEach(function(group) {
            group.tweets.forEach(function(tweet) {
                if (regexp.test(tweet.text)) {
                    console.log();
                    console.log('@' + tweet.user_screen_name + ' ' + db.TweetGroup.getTweetUrl(tweet));
                    console.log(tweet.text);
                }
            });
        });
        db.close();
    });
});