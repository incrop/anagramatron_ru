var streamer = require('./streamer');

var STATUS = {
    STREAMING: {
        icon: 'ok',
        title: 'In progress. Click to stop.'
    },
    STOPPED: {
        icon: 'remove',
        title: 'Stopped. Click to start.'
    },
    ERROR: {
        icon: 'transfer',
        title: 'Something gone wrong. Click to reconnect.'
    },
    UNAUTHORIZED: {
        icon: 'user',
        title: 'Authentication required. Click to authorize app.'
    },
    LIMIT: {
        icon: 'hdd',
        title: 'Limit for tweets reached. Make some retweets to free storage.'
    }
};

module.exports = {
    config: require('./config'),
    getStatus: function() {
        return STATUS[streamer.status];
    }
};