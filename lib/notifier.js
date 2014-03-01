var mailer = require('nodemailer'),
    extend = require('node.extend'),
    Q = require('q'),
    config = require('./config'),
    senderFunctionInited = config._inited.then(function(c) {
        var transport = mailer.createTransport("SMTP", {
            service: "Gmail",
            auth: {
                user: c.sender_email,
                pass: c.sender_password
            }
        });

        var sendFunc = function(mailOptions) {
            var deferred = Q.defer(),
                defaultOptions = {
                    from: c.sender_email,
                    to: c.receiver_email,
                    subject: 'Notification'
                };
            transport.sendMail(
                extend(defaultOptions, mailOptions),
                function(err, resp) {
                    if (err) deferred.reject(err);
                    else deferred.resolve(resp);
                });
            return deferred.promise;
        };
        sendFunc.close = transport.close.bind(transport);
        return sendFunc;
    });

module.exports = {
    sendMessage: function(mailOptions) {
        return senderFunctionInited.then(function(send) {
            return send(mailOptions);
        });
    },
    close: function() {
        senderFunctionInited.then(function(send) {
            send.close();
        });
    },

    anagramFound: function(tweet, group) {
        function makeListItem(tweet) {
            return '<li>' +
                    '<a href="https://twitter.com/' + tweet.user_screen_name +
                            '/statuses/' + tweet.id_str + '">' +
                        '@' + tweet.user_screen_name +
                    '</a>: ' + tweet.text +
                '</li>'
        }
        this.sendMessage({
            subject: 'Новая анаграмма!',
            html:
                '<h1>Найдена новая анаграмма!</h1>' +
                    '<p>Набор букв: <b>' + group._id + '</b></p>' +
                    '<ul>' +
                    makeListItem(tweet) +
                    group.tweets.map(makeListItem).join('') +
                    '</ul>'
        });
    }
};
