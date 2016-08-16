/**
 * Routes Configuration
 *
 * @param errorHandler
 * @param app
 * @param routes
 */
module.exports = function (errorHandler, app, routes) {
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
        app.use(realURL, require(routes[url]));
    }

    /**
     * 404 error handler
     */
    app.use(errorHandler.notFoundError(routes, '404'));
};