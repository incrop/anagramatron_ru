var DB_URL = "mongodb://127.0.0.1:27017/anagramatron",
    Q = require('q'),
    deferOpened = Q.defer(),
    mongoose = require('mongoose');

var db = {
    ConfigItem: mongoose.model('ConfigItem', {
        key: String,
        value: String
    }),
    TweetGroup: mongoose.model('TweetGroup', {
        _id: String,
        tweets: [{
            id_str: Number,
            created_at: String,
            text: String
        }]
    }),

    open: function(drop) {
        mongoose.connect(DB_URL, function (err) {
            if (err) throw err;
            console.log('Connected to database');
            if (drop) {
                 mongoose.connection.db.dropDatabase(function(err) {
                     if (err) throw err;
                     console.log('Database dropped');
                     deferOpened.resolve(db);
                 });
            } else {
                deferOpened.resolve(db);
            }
        });
        return this._opened;
    },

    close: function() {
        mongoose.connection.close(function(err) {
            if (err) throw err;
            console.log('Disconnected from database');
            deferOpened = Q.defer();
            this._opened = deferOpened.promise;
        }.bind(this));
    },

    _opened: deferOpened.promise
};

module.exports = db;