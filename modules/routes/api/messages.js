module.exports = function(app) {
    var model       = require('../../config/model.js')(),
        controller  = require('../../config/controller.js')(model);

    app.get('/api/GET/:_ID/messages', controller.get('../models/api/messages.js'));
    app.get('/api/GET/:_ID/chats/:_chatID/messages', controller.get('../models/api/chat_messages.js'));
    app.get('/api/POST/messages/:_method', controller.post('../models/api/messages.js'));

    return app;
};