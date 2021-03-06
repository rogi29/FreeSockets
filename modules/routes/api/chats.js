module.exports = function(app) {
    var model       = require('../../config/model.js')(),
        controller  = require('../../config/controller.js')(model);

    app.get('/api/GET/:_ID/chats', controller.get('../models/api/chats.js'));
    app.get('/api/POST/chats/:_method', controller.post('../models/api/chats.js'));

    return app;
};