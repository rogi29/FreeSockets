module.exports = function(app) {
    var model       = require('../../config/model.js')(),
        controller  = require('../../config/controller.js')(model);

    app.get('/api/GET/:_ID/contacts', controller.get('../models/api/contacts.js'));
    app.get('/api/POST/contacts/:_method', controller.post('../models/api/contacts.js'));

    return app;
};
