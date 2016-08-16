var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    /*
    Check if user is signed in
     */
    res.render('index',{
        head: {
            title: 'hello world'//{{head.title}}
        }
    });
});

module.exports = router;
