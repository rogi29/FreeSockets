module.exports = function(app) {
    var model       = require('../../config/model.js')(),
        controller  = require('../../config/controller.js')(model);

    app.get('/api/authenticate/:_token', controller.get('../models/api/auth.js'));
    app.get('/api/POST/:_method', controller.post('../models/api/users.js'));
    app.use('/api/*', controller.auth('../models/api/auth.js'));
    app.get('/api/GET/:_ID', controller.get('../models/api/users.js'));

    return app;
};
