/**
 *
 * @param req
 * @returns {{find: find, insert: insert, update: update, remove: remove}}
 */
module.exports = function(req) {
    var
        fields      = req.fields        || {},
        params      = req.params        || {},
        objects     = req.objects       || {},
        mongo       = req.mongo         || {},
        api         = req.api['$users'] || {},
        session     = req.decoded || req.session || {},
        queryList   = api['queries'],
        collection  = mongo.collection('users'),
        utils       = require('./utils.js')(params, fields, objects, session);

    /**
     * Find User/s
     *
     * @param callback
     */
    function find(callback)
    {
        var
            fieldList   = api['get']['fields'],
            paramList   = api['get']['params'],
            get_fields  = ('get_fields' in fields) ? utils.filterObj(utils.strToList(fields['get_fields'], ','), fieldList) : fieldList,
            queries     = false,
            param       = utils.compileStr(utils.validParam(params._ID, params, paramList));

        switch(param) {
            case false:
                queries = false;
                break;

            case null:
                delete fields['get_fields'];
                queries = utils.filterObj(fields, queryList);
                break;

            default:
                queries = {_id: param};
                break;
        }

        queries = utils.validateQueries(queries, queryList);
        if('errors' in queries) {
            callback({errors: queries.errors});
            return;
        }

        if('password' in queries && !('email' in queries)) {
            callback({errors: [utils.error('email field is missing', 'missingFields', 'quries')]});
            return;
        }
        collection.find(queries, get_fields).toArray(function(err, docs) {
            if(err || !docs) {
                callback({errors: [utils.error(err.message.split(':')[0], 'apiDatabaseException', 'find')]});
                return;
            }

            callback(docs);
        });
    }

    /**
     * Insert User/s
     *
     * @param callback
     */
    function insert(callback)
    {
        var
            fieldList   = api['post']['fields'],
            paramList   = api['post']['params'],
            insertList  = api['post']['autoInsert'],
            queries     = false,
            param       = utils.compileStr(utils.validParam(params._method, params, paramList));

        switch(param) {
            case false:
                queries = false;
                break;

            case null:
                queries = (JSON.stringify(fields) !== JSON.stringify({})) ? utils.filterObj(fields, fieldList) : false;
                break;

            default:
                queries = utils.filterObj(JSON.parse(param), fieldList);
                break;
        }

        if(Object.keys(queries).length != Object.keys(fieldList).length) {
            callback({errors: [utils.error('Some fields are missing', 'missingFields', 'queries')]});
            return;
        }

        queries = utils.validateQueries(queries, queryList);
        if('errors' in queries) {
            callback({errors: queries.errors});
            return;
        }

        queries = Object.assign(queries, utils.compileObj(insertList));
        collection.createIndex({email:1},{unique:true});
        collection.insertOne(queries, function(err, docs){
            if(err || !docs) {
                callback({errors: [utils.error(err.message.split(':')[0], 'apiDatabaseException', 'insertOne')]});
                return;
            }

            callback(docs);
            collection.dropIndex({email : 1});
        });
    }

    /**
     *
     * @param callback
     */
    function update(callback)
    {
        var data = {};
        callback(data);
    }

    /**
     *
     * @param callback
     */
    function remove(callback)
    {
        var data = {};
        callback(data);
    }

    return {
        find:  find,
        insert: insert,
        update: update,
        remove: remove
    };
};