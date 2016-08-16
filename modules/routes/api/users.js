
var
    express     = require('express'),
    router      = express.Router();

module.exports = function(db, redis) {
    var
        model       = require('../../config/model.js')(db, redis),
        controller  = require('../../config/controller.js')(router, model);

    controller.get('/GET/user/:_ID', '../models/api/users.js');
    controller.post('/POST/user/:_method', '../models/api/users.js');
    controller.put('/PUT/user/:_method', '../models/api/users.js');

    return controller.getRouter();
};
