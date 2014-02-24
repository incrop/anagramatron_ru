var config = require('../config'),
    twitter = require('twitter');

var t, stream;

var streamer = {

    toggle: function() {
        var status = this.status;
        this.status = 'TOGGLING';

        switch (status) {
            case 'UNAUTHORIZED':
                config._inited.then(function(c) {
                    t = new twitter({
                        consumer_key: c.consumer_key,
                        consumer_secret: c.consumer_secret,
                        access_token_key: c.access_token_key,
                        access_token_secret:  c.access_token_secret
                    });
                    streamer.status = 'STOPPED';
                    streamer.toggle();
                });
                break;

            case 'STOPPED':
            case 'ERROR':
                t.stream('statuses/sample', { language: 'ru' }, function(newStream) {
                    stream = newStream;
                    stream.on('data', function(tweet) {
                        console.log(tweet.text);
                        streamer.status = 'STREAMING';
                    });
                    stream.on('error', function(err) {
                        console.error('Error while streaming tweets: ' + JSON.stringify(err));
                        streamer.status = 'ERROR';
                    });
                    stream.on('end', function(resp) {
                        switch (resp.statusCode) {
                            case 200:
                                console.log('End of tweet stream');
                                streamer.status = 'STOPPED';
                                break;
                            case 401:
                                console.error('Wrong OAuth credentials');
                                streamer.status = 'UNAUTHORIZED';
                                break;
                            default:
                                console.log('Unexpected end of tweet stream. Status code: ' + resp.statusCode);
                                streamer.status = 'ERROR';
                        }
                    });
                });
                break;

            case 'STREAMING':
                console.log('Stopping streaming tweets');
                stream.destroy();
                break;

            default:
                console.warn('Attempt to toggle streamer while in ' + status + ' state. Ignoring');
                this.status = status;
        }
    }
};

(function() {
    var status = 'UNAUTHORIZED';
    streamer.__defineGetter__("status", function() {
        return status;
    });
    streamer.__defineSetter__("status", function(newStatus) {
        if (newStatus !== 'STREAMING') stream = null;
        if (newStatus === 'UNAUTHORIZED') t = null;
        status = newStatus;
    });
})();

streamer.toggle();

module.exports = streamer;