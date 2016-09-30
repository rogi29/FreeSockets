var request = require("request");

/**
 *
 * @param mysql
 * @returns {Function}
 */
module.exports = function(socket, req) {
    console.log('sockets connection established');
    var session = socket.request.session, respond;

    socket.on('authentication', function(data) {
        request({
            url: (req.api.url + '/authenticate/token?email=' + data.email + '&password=' + data.password),
            json: true
        },  function (error, response, body) {
            if (error && response.statusCode !== 200) {
                console.log('error');
                return;
            }

            respond = ('errors' in body) ? body.errors[0]['type']: false;
            switch(respond)
            {
                case 'apiNoMatch':
                    socket.emit('signin_errors', body.errors);
                    socket.emit('new_user', true);
                    break;

                case false:
                    session._ID = body._ID;
                    session.token = body.token;
                    session.save(function(err){});

                    socket.emit('authenticated', true);
                    break;

                default:
                    socket.emit('signin_errors', body.errors);
                    break;
            }
        });
    });

    /**
     *
     */
    socket.on('sign_up_auth', function(data) {
        request({
            url: (req.api.url + '/POST/json?insert='+JSON.stringify(data)),
            json: true
        },  function (error, response, body) {
            if (error && response.statusCode !== 200) {
                console.log('error');
                return;
            }

            if('errors' in body && JSON.stringify(body.errors) != JSON.stringify([])) {
                socket.emit('signin_errors', body.errors);
            } else if('ok' in body && body.ok == 1) {
                session._ID = body._ID;
                session.token = body.token;
                session.save(function(err){});

                request({
                    url: (req.api.url + '/authenticate/token?email=' + data.email + '&password=' + data.password),
                    json: true
                },  function (error, response, body) {
                    if (error && response.statusCode !== 200) {
                        console.log('error');
                        return;
                    }

                    respond = ('errors' in body) ? body.errors[0]['type']: false;
                    switch(respond)
                    {
                        case false:
                            session._ID = body._ID;
                            session.token = body.token;
                            session.save(function(err){});

                            socket.emit('authenticated', true);
                            break;

                        default:
                            socket.emit('signin_errors', body.errors);
                            break;
                    }
                });
            }
        });
    });

    /**
     *
     */
    socket.on('disconnect', function () {
        console.log('Sockets disconnected');
    });
};