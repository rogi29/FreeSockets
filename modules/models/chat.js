var request = require("request");
var users 	= [];
var chats 	= [];
var sockets = {};

/**
 *
 * @param mysql
 * @returns {Function}
 */
module.exports = function(socket, req) {
    console.log('User ' + req.session._ID + 'has connected to a socket '+ socket.id +' in the chat ' + req.session._chatID);
    if(chats.indexOf(req.session._chatID) == -1) {
        chats.push(req.session._chatID);
    }

    if(users.indexOf(req.session._ID) == -1){
        users.push(req.session._ID);
    }

    sockets[socket.id] = {userid: req.session._ID, chats: req.session._chatID, socket : socket };

    socket.on('chat message send', function(data) {
        for(var key in sockets){
            if(sockets[key].chats == req.session._chatID){
                sockets[key].socket.emit('chat message receive',
                    {
                        message : data.message,
                        from : req.session._ID
                    }
                );
            }
        }
    });

    socket.on('disconnect', function () {
        console.log('Sockets disconnected');
        delete sockets[socket.id];
    });
};