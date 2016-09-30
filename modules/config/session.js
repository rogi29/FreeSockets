module.exports = function(secret, redis) {
    var
        cookie      = require('cookie-parser')(secret),
        session     = require('express-session'),
        redisStore  = require('connect-redis')(session),
        redis       = require('redis').createClient(redis.port, redis.host),
        sessionStore = new redisStore({client: redis}),
        sessionMW = {
            store: sessionStore,
            secret: secret,
            resave: true,
            saveUninitialized: true
        };

    return {cookie: cookie, get: session(sessionMW), middleware: sessionMW, redis: redis};
};