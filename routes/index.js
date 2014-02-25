var view = require('../lib/view');

exports.index = function(req, res){
    var data = { config: view.config };

    if (req.query.t !== view.config.token) {
        res.render('unauthorized', data);
        return;
    }

    data.status = view.getStatus();
    res.render('index', data);
};