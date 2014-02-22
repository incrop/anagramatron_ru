var config = require('../config'),
    twitter = require('twitter'),
    status = 'AUTH_REQUIRED';

config._inited.then(function(c) {
    var t = new twitter({
        consumer_key: c.consumer_key,
        consumer_secret: c.consumer_secret,
        access_token_key: c.access_token_key,
        access_token_secret:  c.access_token_secret
    });
    t.login();
    t.stream('statuses/sample', { language: 'ru' }, function(stream) {
        var counter = 0;
        stream.on('data', function (tweet) {
            console.log(tweet.text);
            if (++counter === 30) stream.destroy();
        });
    });

});


module.exports = {
    getStatus: function() {
        return status;
    }
};