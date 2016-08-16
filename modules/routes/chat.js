var express = require('express'),
    router = express.Router(),
    path = require('path');

router.use(express.static(path.join('./', 'public')));

router.get('/:_name', function(req, res) {
    /*
     Check if user is signed out
     */
    res.render('chat',{
        head: {
            title: 'FreeSockets - Chat'
        }
    });
});

module.exports = router;