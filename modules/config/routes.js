/**
 * Routes Configuration
 *
 * @param errorHandler
 * @param app
 * @param routes
 */
module.exports = function (errorHandler, app, sockets, routes) {
    /**
     * Route key/value to string
     */
    for(var url in routes) {
        url = url.toString();
        routes[url] = routes[url].toString();
    }

    /**
     * Use in loop
     */
    for(var url in routes) {
        var realURL = url.replace('*', '');
        app.get(realURL, require(routes[url])(app, sockets));
    }

    /**
     * 404 error handler
     */
    app.use(errorHandler.notFoundError(routes, '404'));

    return app;
};