
var fs      = require('fs'),
    config  = JSON.parse(fs.readFileSync('./config.json', 'utf8')),
    express = require('express'),
    router  = express.Router(),
    redis   = require('redis').createClient(config['redis']['port'], config['redis']['host']),
    mongo   = require('../config/mongodb.js')(config['mongodb']);

router.get('/', function (req, res) {
    res.render('api',{
        head: {
            title: 'FreeSockets - api'
        },
        json: 'FreeSockets API'
    });
});

mongo.connect(function(error, db) {
    router.use(require('./api/users.js')(db, redis));
});

module.exports = router;
