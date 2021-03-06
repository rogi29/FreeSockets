var express     = require('express'),
    path        = require('path'),
    request     = require("request");

module.exports = function(app, sockets) {
    app.use('/chat', express.static(path.join('./', 'public')));

    app.get('/chat/:_chatID', function(req, res, next) {
        var title = null;
        if(!('_ID' in req.session)){
            res.redirect('http://localhost/');
            return;
        }
        request({
            url: (req.api.url + '/GET/me/chats?get_fields=title&_id=' + req.params._chatID),
            headers: {"x-access-token": req.session.token},
            json: true
        },  function (error, response, body) {
            if (error && response.statusCode !== 200) {
                console.log('error');
                return;
            }

            if (JSON.stringify(body) === JSON.stringify([]) ||  'errors' in body) {
                res.render('404', {
                    head: {
                        title: 'FreeSockets - 404'
                    }
                });
                return;
            }

            res.render('chat', {
                title: body[0].title,
                head: {
                    title: 'FreeSockets - '
                }
            });

            sockets.use('./modules/models/chat.js', req);
        });
    });

    return app;
};