/**
 *
 * @type {connect.ObjectID|*}
 */
var ObjectID = require('mongodb').ObjectID,
    allowedFields   = {"_id": 1, "fullname": 1, "email": 1, "profile_picture": 1, "status": 1};

/**
 *
 * @param fields
 * @returns {*}
 */
function filterQueries(fields) {
    delete fields['get_fields'];

    if(JSON.stringify(fields) === JSON.stringify({})){
        return {};
    }

    for (var key in fields) {
        if(!allowedFields[key] && key != 'password') {
            delete fields[key];
        }
    }

    return fields;
}

/**
 *
 * @param fields
 * @returns {*}
 */
function filterFields(fields)
{
    var obj = {}, length, i;

    if("get_fields" in fields && fields['get_fields'] != null) {
        get_fields = fields.get_fields.split(",");
        length = get_fields.length;

        for(i = 0; i < length; i++) {
            if(!(get_fields[i] in allowedFields)){
                delete get_fields[i];
            } else {
                obj[get_fields[i]] = 1;
            }
        }

        return obj;
    }

    return allowedFields;
}

/**
 *
 * @param db
 * @param params
 * @param fields
 * @returns {{find: find, insert: insert, update: update, remove: remove}}
 */
module.exports = function(db, params, fields) {
    /**
     *
     * @type {*|Collection}
     */
    var users = db.collection('users');

    /**
     *
     * @param callback
     */
    function find(callback)
    {
        var query = null,
            regex = new RegExp("^[0-9a-fA-F]{24}$"),
            get_fields = filterFields(fields);


        params._ID  = params._ID.toString();

        switch(params._ID) {
            case 'me':
                query = ObjectID("57ae70f2c70d66c81dc8f8f8");
                break;

            case 'public':
                query = filterQueries(fields);
                break;

            default:
                if((params._ID).match(regex) ==  null){
                    callback({});
                    return;
                }

                query = ObjectID(params._ID);
                break;
        }

        users.find(query, get_fields).toArray(function(err, docs){
            callback(docs);
        });
    }

    /**
     *
     * @param callback
     */
    function insert(callback)
    {
        var query = null;
        callback(data);
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