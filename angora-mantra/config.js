var db = require('./db'),
    Q = require('q'),
    i = Q.defer(),
    config = { _inited: i.promise };

db.ConfigItem.find({}, function(err, entries) {
    if (err) throw err;
    entries.forEach(function(entry) {
        config[entry.key] = entry.value;
    });
    i.resolve(config);
    console.log('Config initialized. Number of entries: ' + entries.length);
});

module.exports = config;