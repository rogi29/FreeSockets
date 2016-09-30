/**
 * Sockets IO Configuration
 *
 * @param app
 * @returns {*|exports}
 */
var Sockets = function(app, session) {
    this.http   = require('http').Server(app);
    this.io     = require('socket.io')(this.http);
    this.io.set('authorization', function(handshake, accept) {
        session(handshake, {}, function (err) {
            if (err) return accept(err)
            var session = handshake.session;
            // check the session is valid
            accept(null, session)
        })
    });

    if(!(this instanceof Sockets)){
        return new Sockets(app, session);
    }

    return this;
};

/**
 *
 * @type {{use: Function}}
 */
Sockets.prototype = {

    /**
     *
     * @param path
     * @returns {*}
     */
    use: function(path, req){
        this.io.on('connection', function(socket) {
            console.log(socket.id);

            require('../.' + path)(socket, req);
        });
    }
};

module.exports = Sockets;