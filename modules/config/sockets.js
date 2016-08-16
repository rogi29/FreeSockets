/**
 * Sockets IO Configuration
 *
 * @param app
 * @returns {*|exports}
 */
var Sockets = function(app) {
    if(!(this instanceof Sockets)){
        return new Sockets(app);
    }

    this.app = app;
    this.http = require('http').Server(app);
    this.io = require('socket.io')(this.http);

    return this;
};

Sockets.prototype = {
    use: function(path){
        return this.io.use(function(socket, next){
            require('../.' + path)(this.app, socket);

            if (socket.request.headers.cookie) return next();
            next(new Error('Authentication error'));
        });
    }
};

module.exports = Sockets;