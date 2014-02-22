var db = require('./db'),
    Q = require('q'),
    deferInited = Q.defer(),
    config = {
        title: "Anagramatron control panel",
        token: "tatatatitata",
        _inited: deferInited.promise
    };

// Filling config with entries from database
db._opened.then(function(db) {
    db.ConfigItem.find({}, function(err, entries) {
        if (err) throw err;
        console.log('Config loaded from database. Number of entries: ' + entries.length);
        entries.forEach(function(entry) {
            config[entry.key] = entry.value;
        });
        deferInited.resolve(config);
    });
});

module.exports = config;