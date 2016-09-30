/**
 * Express Variable
 * @type {exports}
 */
var express = require('express');

/**
 * Express Configuration
 *
 * @param errorHandler
 * @param config
 * @returns {*}
 */
module.exports = function (errorHandler, config) {
    /**
     * Define
     */
    var
        app             = express(),
        path            = require('path'),
        bodyParser      = require('body-parser'),
        mustache        = require('mustache-express'),
        cookie          = require('cookie-parser');

    /**
     * Set
     */
    app.engine('html', mustache());
    app.set('env', config['env']);
    app.set('port', process.env.PORT || config['port']);
    app.set('view engine', 'html');
    app.set('views', path.join('./', config['views']));

    /**
     * Use
     */
    if(app.get('env') == 'development') {
        app.use(errorHandler.devError());
    } else {
        app.use(errorHandler.userError());
    }

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookie());

    /**
     * return app object
     */
    return app;
};