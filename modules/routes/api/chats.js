
var
    express     = require('express'),
    router      = express.Router(),
    model       = require('../../config/model.js');
    controller  = require('../../config/controller.js')(router, model);

module.exports = function() {
    controller.get('/GET/chat/:_ID', '../models/api/chats.js');

    return controller.getRouter();
};
