var app = require('../angora-mantra');

exports.index = function(req, res){
    console.log(app);
    var data = { config: app.config };

    if (req.query.t !== app.config.token) {
        res.render('unauthorized', data);
        return;
    }

    data.status = app.getStatus();
    res.render('index', data);

};