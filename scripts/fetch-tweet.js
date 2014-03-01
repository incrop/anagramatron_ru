var twitter = require('twitter'),
    db = require('../lib/db'),
    config = require('../lib/config');

db.open();
config._inited.then(function(c) {
    db.close();
    var id = process.argv[2];
    if (!id) {
        console.log('Tweet ID should be passed as an argument');
        process.exit(1);
    }
    var t = new twitter({
        consumer_key: c.consumer_key,
        consumer_secret: c.consumer_secret,
        access_token_key: c.access_token_key,
        access_token_secret:  c.access_token_secret
    });
    t.showStatus(id, function(data) {
        console.log(data);
    });
});