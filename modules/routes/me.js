var express     = require('express'),
    path        = require('path'),
    request     = require("request");

module.exports = function(app, sockets) {
    app.use('/me', express.static(path.join('./', 'public')));

    app.get('/me', function(req, res, next) {
        if(!('_ID' in req.session)){
            res.redirect('http://localhost/');
            return;
        }

        request({
            url: (req.api.url + '/GET/me'),
            headers: {"x-access-token": req.session.token},
            json: true
        },  function (error, response, body) {
            if (error && response.statusCode !== 200) {
                console.log('error');
                return;
            }

            if (JSON.stringify(body) === JSON.stringify([])) {
                res.render('404', {
                    head: {
                        title: 'FreeSockets - 404'
                    }
                });
                return;
            }


            res.render('chat',{
                head: {
                    title: body[0].fullname
                }
            });
        });
    });

    return app;
};