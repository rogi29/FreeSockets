/**
 * Require Node Modules
 * @type {exports}
 */
var
    fs              = require('fs'),
    config          = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
    errorHandler    = require('./modules/middlewares/errorHandler'),
    app             = require('./modules/config/express.js')(errorHandler, config['express']),
    routes          = require('./modules/config/routes.js')(errorHandler, app, config['routes']),
    sockets         = require('./modules/config/sockets.js')(app);

sockets.use('./modules/models/index.js');

/**
 * Init app
 */
sockets.http.listen(app.get('port'), function() {
    console.log('Server is listening on *:' + app.get('port'));
});
