/**
 *
 * @type {connect.ObjectID|*}
 */
var fs          = require('fs'),
    ObjectID    = require('mongodb').ObjectID,
    api         = JSON.parse(fs.readFileSync('./api.json', 'utf8'))['$users'],
    queryList   = api['queries'];

/**
 *
 * @param db
 * @param cache
 * @param params
 * @param fields
 * @returns {{find: find, insert: insert, update: update, remove: remove}}
 */
module.exports = function(db, cache, params, fields) {
    /**
     *
     * @type {*|Collection}
     */
    var users = db.collection('users');

    /**
     * Get Object ID
     *
     * @param id
     * @param callback
     * @returns {*}
     */
    function getID(id, callback)
    {
        var id = id.toString(),
            regex = new RegExp("^[0-9a-fA-F]{24}$");

        if((id).match(regex) ==  null){
            callback({});
            return false;
        }

        return ObjectID(id);
    }

    /**
     * Filter an Object
     *
     * @param obj
     * @param whitelist
     * @returns {*}
     */
    function filterObj(obj, whitelist)
    {
        var key;

        for(key in obj) {
            if(!(key in whitelist)) {
                delete obj[key];
            }
        }

        return obj;
    }

    /**
     * Valid a URL Parameter
     *
     * @param param
     * @param params
     * @param list
     * @returns {*}
     */
    function validParam(param, params, list)
    {
        var key;

        for(key in list){
            if(param == key) {
                return list[key];
            }

            if(key[0] == '_' && key in params) {
                return list[key];
            }
        }

        return false;
    }


    /**
     * Find User/s
     *
     * @param callback
     */
    function find(callback)
    {
        var fieldList   = api['get']['fields'],
            paramList   = api['get']['params'],
            get_fields  = ('get_fields' in fields) ? filterObj(fields['get_fields'], fieldList) : fieldList,
            queries     = false;

        switch(validParam(params._ID, params, paramList)) {
            case 'Sesssion:ObjectID':
                queries = getID("57ae70f2c70d66c81dc8f8f8", callback);
                break;

            case 'Params:ObjectID':
                queries = getID(params._ID, callback);
                break;

            case null:
                delete fields['get_fields'];
                queries = filterObj(fields, queryList);
                break;

            default:
                queries = false;
                break;
        }

        if(!queries)  {
            callback({});
            return;
        }

        users.find(queries, get_fields).toArray(function(err, docs){
            if(err || !docs) {
                callback({});
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
        var fieldList   = api['post']['fields'],
            paramList   = api['post']['params'],
            inserList   = api['post']['insert'],
            queries     = false;


        switch(validParam(params._ID, params, paramList)) {
            case '$insert':
                queries = ('insert' in fields) ? filterObj(JSON.parse(fields['insert']), fieldList) : false;
                break;

            case 'object':
                queries = (JSON.stringify(fields) !== JSON.stringify({})) ? filterObj(JSON.parse(fields), fieldList): false;
                break;

            default:
                queries = false;
                break;
        }


        if(!queries)  {
            callback({});
            return;
        }

        users.insertOne(queries, function(err, docs){
            if(err || !docs) {
                callback({});
            }

            callback(docs);
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