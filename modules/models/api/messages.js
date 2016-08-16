
var
    express     = require('express'),
    router      = express.Router(),
    model       = require('../../config/model.js');
    controller  = require('../../config/controller.js')(router, model);

module.exports = function() {
    controller.get('/message/:_id', 'users', {filename: 'api', data: { head: { title: req.params._user }}});
    controller.post('/message/:_id', 'users', {filename: 'api', data: { head: { title: req.params._user }}});
    controller.put('/message/:_id', 'users', {filename: 'api', data: { head: { title: req.params._user }}});
    controller.delete('/message/:_id', 'users', {filename: 'api', data: { head: { title: req.params._user }}});

    return controller.getRouter();
};
