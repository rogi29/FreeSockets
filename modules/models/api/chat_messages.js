/**
 *
 * @type {request|exports}
 */
var request = require("request");

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
        mongo       = req.mongo         || {},
        api         = req.api['$messages'] || {},
        session     = req.decoded || req.session || {},
        queryList   = api['queries'],
        collection  = mongo.collection('messages'),
        utils       = require('./utils.js')(params, fields, objects, session);

    /**
     * Find Message/s
     *
     * @param callback
     */
    function find(callback)
    {
        var
            fieldList   = api['get']['fields'],
            paramList   = api['get']['params'],
            paramList2  = api['get']['second_params'],
            get_fields  = ('get_fields' in fields) ? utils.filterObj(utils.strToList(fields['get_fields'], ','), fieldList) : fieldList,
            queries     = false,
            param       = (utils.validParam(params._ID, params, paramList)) ? params._ID : false,
            secParam    = utils.compileStr(utils.validParam(params._chatID, params, paramList2));

        request({
            url: (req.api.url + '/GET/' + param + '/chats?get_fields=_id&_id=' + secParam),
            headers: {"x-access-token": session.token},
            json: true
        },  function (error, response, body) {
            if (error && response.statusCode !== 200) {
                console.log(error);
                callback({errors: [utils.error(error, 'apiDatabaseException', 'find')]});
                return;
            }

            if(JSON.stringify(body) == JSON.stringify([])) {
                callback({errors: [utils.error('Messages not found', 'apiNoMatch', 'find')]});
                return;
            }

            delete fields['get_fields'];
            queries = utils.filterObj(fields, queryList);
            queries['chatid'] = secParam;

            queries = utils.validateQueries(queries, queryList);
            if('errors' in queries) {
                callback({errors: queries.errors});
                return;
            }

            collection.find(queries, get_fields).toArray(function(err, docs) {
                if(err || !docs) {
                    callback({errors: [utils.error(err.message.split(':')[0], 'apiDatabaseException', 'find')]});
                    return;
                }

                callback(docs);
            });
        });
    }

    return {
        find:  find
    };
};