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
var Controller = function(model) {
    this.model  = model;

    if(!(this instanceof Controller)){
        return new Controller(model);
    }

    return this;
};

/**
 *
 * @type {{getRouter: Function, get: Function, post: Function, put: Function, delete: Function}}
 */
Controller.prototype = {
    /**
     * Get function
     *
     * @param url
     * @param modelPath
     * @returns {*}
     */
    auth: function(path)
    {
        var model = this.model.use(path, {});
        return model.authenticate;
    },

    /**
     * Get function
     *
     * @param url
     * @param modelPath
     * @returns {*}
     */
    get: function(path)
    {
        return function(req, res) {
            req['fields'] = URL.parse(req.url, true).query;
            var model = this.model.use(path, req);

            model.find(function(data) {
                data = JSON.stringify(data, null, 3);
                res.setHeader('Content-Type', 'application/json');
                res.send(data);
            });
        };
    },

    /**
     *
     * @param url
     * @param modelPath
     * @returns {*}
     */
    post: function(path)
    {
        return function(req, res) {
            req['fields'] = URL.parse(req.url, true).query;
            var model = this.model.use(path, req);

            model.insert(function(data){
                data = JSON.stringify(data, null, 3);
                res.setHeader('Content-Type', 'application/json');
                res.send(data);
            })
        };
    },

    /**
     *
     * @param url
     * @param modelPath
     * @returns {*}
     */
    put: function(path)
    {
        return function(req, res) {
            req['fields'] = URL.parse(req.url, true).query;
            var model = this.model.use(path, req);

            model.update(function(data){
                data = JSON.stringify(data, null, 3);
                res.setHeader('Content-Type', 'application/json');
                res.send(data);
            })
        };
    },

    /**
     *
     * @param url
     * @param modelPath
     * @returns {*|OrderedBulkOperation}
     */
    delete: function(path)
    {
        return function(req, res) {
            req['fields'] = URL.parse(req.url, true).query;
            var model = this.model.use(path, req);

            model.remove(function(data){
                data = JSON.stringify(data, null, 3);
                res.setHeader('Content-Type', 'application/json');
                res.send(data);
            })
        };
    }
};

module.exports = Controller;