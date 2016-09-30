module.exports = function(app) {

    app.use('/', function(req, res, next) {
        if(!('_ID' in req.session)) {
            req.session.destroy();
        }
        next();
    });

    app.get('/api', function(req, res, next) {
        res.render('api',{
            head: {
                title: 'FreeSockets - api'
            },
            json: 'FreeSockets API'
        });
    });

    app = require('./api/users.js')(app);
    app = require('./api/contacts.js')(app);
    app = require('./api/chats.js')(app);
    app = require('./api/messages.js')(app);

    return app;
};
