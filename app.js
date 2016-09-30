/**
 * Require Node Modules
 * @type {exports}
 */
var
    fs              = require('fs'),
    config          = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
    api             = JSON.parse(fs.readFileSync('./api.json', 'utf8')),
    errorHandler    = require('./modules/middlewares/errorHandler'),
    app             = require('./modules/config/express.js')(errorHandler, config['express']),
    mongo           = require('./modules/config/mongodb.js')(config['mongodb']),
    session         = require('./modules/config/session.js')(config['express']['secret'], {port: config['redis']['port'], host: config['redis']['host']}),
    jwt             = require('jsonwebtoken'),
    objects         = {Date: new Date()},
    redis           = session.redis,
    sockets;

mongo.connect(function(error, db) {
    app.use(function(req, res, next){
        req.mongo   = db;
        req.redis   = redis;
        req.api     = api;
        req.objects = objects;
        req.jwt     = jwt;
        req.secret  = config.express.secret;
        next();
    });

    app.use(session.cookie);
    app.use(session.get);

    sockets = require('./modules/config/sockets.js')(app, session.get);
    app = require('./modules/config/routes.js')(errorHandler, app, sockets, config['routes']);

    /**
     * Init app
     */
    sockets.http.listen(app.get('port'), function() {
        console.log('Server is listening on *:' + app.get('port'));
    });
});
