/**
 *
 * @param req
 * @returns {{find: find}}
 */
module.exports = function(req) {
    var
        fields      = req.fields        || {},
        params      = req.params        || {},
        objects     = req.objects       || {},
        utils       = require('./utils.js')(params, fields, objects, {});


    /**
     * Find Message/s
     *
     * @param callback
     */
    function find(callback)
    {
        var
            mongo       = req.mongo         || {},
            api         = req.api['$auth']  || {},
            queryList   = api['queries'],
            collection  = mongo.collection('users'),
            fieldList   = api['get']['fields'],
            paramList   = api['get']['params'],
            param       = utils.validParam(params._token, params, paramList) ? params._token : false,
            queries     = utils.filterObj(fields, queryList),
            token       = null;

        if(param != 'token') {
            callback({errors: [utils.error('Unsupported get request', 'apiInvalidParam', 'quries')]});
            return;
        }

        if(Object.keys(queries).length != Object.keys(queryList).length) {
            callback({errors: [utils.error('Some fields are missing', 'apiMissingFields', 'quries')]});
            return;
        }

        collection.find({email: queries['email']}, {_id: 1, password: 1}).toArray(function(err, docs) {
            if(err || !docs) {
                callback({errors: [utils.error(err.message.split(':')[0], 'apiDatabaseException', 'find')]});
                return;
            }

            if(JSON.stringify(docs) === JSON.stringify([])) {
                callback({errors: [utils.error('User not found, would you like to sign up?', 'apiNoMatch', 'find')]});
                return;
            }

            if(queries.password != docs[0].password) {
                callback({errors: [
                    utils.error('Password doesn\'t match the email provided!', 'apiInvalidData', 'find'),
                    utils.error('Email address is already in use!', 'apiDuplicatedData', 'find')
                ]});
                return;
            }

            delete queries.password;
            token = req.jwt.sign({_ID: docs[0]._id}, req.secret);
            callback({
                success: true,
                message: 'api token expires in 24 hours',
                token: token,
                _ID: docs[0]._id
            });
        });
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    function authenticate(req, res, next)
    {
        var
            token = req.body.token || req.headers['x-access-token'] || (('session' in req) ? req.session.token : false) || false,
            data = null;

        if (!token) {
            data = JSON.stringify({errors: [
                utils.error('Unsupported get request', 'apiInvalidToken', 'auth')
            ]}, null, 3);

            res.setHeader('Content-Type', 'application/json');
            return res.status(403).send(data);
        }

        req.jwt.verify(token, req.secret, function(err, decoded) {
            if (err) {
                console.log(err);
                data = JSON.stringify({errors: [
                    utils.error('Unsupported get request', 'apiInvalidToken', 'auth')
                ]}, null, 3);

                res.setHeader('Content-Type', 'application/json');
                return res.status(403).send(data);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }

    return {
        find:  find,
        authenticate: authenticate
    };
};