var DB_URL = "mongodb://127.0.0.1:27017/anagramatron",
    mongoose = require('mongoose');

mongoose.connect(DB_URL);

module.exports = {
    ConfigItem: mongoose.model('ConfigItem', { key: String, value: String })
}