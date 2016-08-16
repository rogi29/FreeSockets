var request = require("request");

/**
 *
 * @param mysql
 * @returns {Function}
 */
module.exports = function(app, socket) {
    console.log('Sockets connecteion established');

    /**
     *
     */
    socket.on('authentication', function(data) {
        request({
            url: ('http://localhost/api/GET/user/public?email=' + data.email + '&password=' + data.password),
            json: true
        },  function (error, response, body) {
            if (error && response.statusCode !== 200) {
                console.log('error');
                return;
            }

            if(JSON.stringify(body) === JSON.stringify([])) {
                request({
                    url: ('http://localhost/api/GET/user/public?email=' + data.email),
                    json: true
                },  function (error, response, body) {
                    if (error && response.statusCode !== 200) {
                        console.log('error');
                        return;
                    }

                    if(JSON.stringify(body) === JSON.stringify([])) {
                        socket.emit('signin_errors', [{type: 'data_not_found', message: 'User not found, would you like to sign up?'}]);
                        socket.emit('new_user', data);
                    } else {
                        socket.emit('signin_errors', [
                            {type: 'data_no_match', message: 'Password doesn\'t match the email provided!'},
                            {type: 'data_dulication', message: 'Email address is already in use!'}
                        ]);
                    }
                });
            } else {
                socket.emit('authenticated', 'george.qubty&roni.nimer');
            }
        });
    });

    /**
     *
     */
    socket.on('sign_up_auth', function(data) {
        request({
            url: ('http://localhost/api/POST/user/json?insert='+JSON.stringify(data)),
            json: true
        },  function (error, response, body) {
            if (error && response.statusCode !== 200) {
                console.log('error');
                return;
            }

            if('error' in body) {
                console.log(body);
            } else if('ok' in body && body.ok == 1) {
                socket.emit('authenticated', body);
            }
        });
    });

    /**
     *
     */
    socket.on('signout', function(data) {
        socket.emit('signout_respond', true)
    });
};