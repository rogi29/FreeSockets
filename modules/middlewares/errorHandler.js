var express = require('express');
var router = express.Router();

module.exports = {
    devError: function () {
        return function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        };
    },

    userError: function () {
        return function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        };
    },

    notFoundError: function(routes, view) {
        return router.get('*', function(req, res, next) {
            var url = req.originalUrl;

            for(var key in routes){
                if(key.indexOf('/*') != -1 && url.indexOf(key.replace('/*', '')) != -1){
                    next();
                    return;
                }
            }

            if(routes[url] == undefined){
                res.render(view, {
                    head: {
                        title: '404 - page not found!'
                    }
                });
                return;
            }

            next();
        });
    }
}