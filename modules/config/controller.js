/**
 * Url module
 *
 * @type {exports}
 */
var URL = require('url');

/**
 * Controller configuration
 *
 * @param router
 * @param model
 * @returns {Controller}
 * @constructor
 */
var Controller = function(router, model) {
    this.router = router;
    this.model = model;

    if(!(this instanceof Controller)){
        return new Controller(router, model);
    }

    return this;
};

/**
 *
 * @type {{getRouter: Function, get: Function, post: Function, put: Function, delete: Function}}
 */
Controller.prototype = {
    /**
     *
     * @returns {*}
     */
    getRouter: function()
    {
      return this.router;
    },

    /**
     * Get function
     *
     * @param url
     * @param modelPath
     * @returns {*}
     */
    get: function(url, modelPath)
    {
        return this.router.get(url, function(req, res, next) {
            var fields = URL.parse(req.url, true),
                model = this.model.use(modelPath, req.params, fields.query);

            model.find(function(data, db){
                data = JSON.stringify(data, null, 3);

                res.setHeader('Content-Type', 'application/json');
                res.send(data);
            })
        });
    },

    /**
     *
     * @param url
     * @param modelPath
     * @returns {*}
     */
    post: function(url, modelPath)
    {
        return this.router.get(url, function(req, res, next) {
            var fields = URL.parse(req.url, true),
                model = this.model.use(modelPath, req.params, fields.query);

            model.insert(function(data) {
                data = JSON.stringify(data, null, 3);

                res.setHeader('Content-Type', 'application/json');
                res.send(data);
            });
        });
    },

    /**
     *
     * @param url
     * @param modelPath
     * @returns {*}
     */
    put: function(url, modelPath)
    {
        return this.router.get(url, function(req, res, next) {
            var fields = URL.parse(req.url, true),
                model = this.model.use(modelPath, req.params, fields.query);

            model.update(function(data) {
                data = JSON.stringify(data, null, 3);

                res.setHeader('Content-Type', 'application/json');
                res.send(data);
            });
        });
    },

    /**
     *
     * @param url
     * @param modelPath
     * @returns {*|OrderedBulkOperation}
     */
    delete: function(url, modelPath)
    {
        return this.router.get(url, function(req, res, next) {
            var fields = URL.parse(req.url, true),
                model = this.model.use(modelPath, req.params, fields.query);//model

            model.remove(function(data) {
                data = JSON.stringify(data, null, 3);

                res.setHeader('Content-Type', 'application/json');
                res.send(data);//view
            });
        });
    }
};

module.exports = Controller;