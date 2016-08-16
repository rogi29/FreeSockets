
var
    express     = require('express'),
    router      = express.Router(),
    model       = require('../../config/model.js');
    controller  = require('../../config/controller.js')(router, model);

module.exports = function() {
    controller.get('/contact/:_userID', 'users', {filename: 'api', data: { head: { title: req.params._user }}});
    controller.post('/contact/:_userID', 'users', {filename: 'api', data: { head: { title: req.params._user }}});
    controller.put('/contact/:_userID', 'users', {filename: 'api', data: { head: { title: req.params._user }}});
    controller.delete('/contact/:_userID', 'users', {filename: 'api', data: { head: { title: req.params._user }}});

    return controller.getRouter();
};
