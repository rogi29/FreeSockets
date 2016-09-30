var express     = require('express'),
    path        = require('path');

module.exports = function(app, sockets) {
    app.use('', express.static(path.join('./', 'public')));

    app.get('/', function(req, res) {
        if('_ID' in req.session){
            if('_chatID' in req.session){
                res.redirect('http://localhost/chat/' + req.session._chatID);
                return;
            }

            res.redirect('http://localhost/me');
            return;
        }
        
        sockets.use('./modules/models/index.js', req);
        res.render('index',{
            head: {
                title: 'Sign In to FreeSockets'
            }
        });
    });

    return app;
};