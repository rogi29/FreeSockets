/**
 * MongoDB ObjectID
 *
 * @type {connect.ObjectID|*}
 */
var ObjectID    = require('mongodb').ObjectID,
    validator = require('validator');

/**
 * API Utilities
 *
 * @param params
 * @param fields
 * @param objects
 * @param session
 * @returns {{getID: getID, strToObj: strToObj, filterObj: filterObj, validParam: validParam, compileStr: compileStr, compileObj: compileObj}}
 */
module.exports = function(params, fields, objects, session) {
    /**
     *
     * @param message
     * @param type
     * @param position
     * @returns {{message: *, type: *, position: *}}
     */
    function errorMsg(message, type, position)
    {
        return {message: message, type: type, position: position};
    }

    /**
     * Convert string to object
     *
     * @param list
     * @param split
     * @returns {*}
     */
    function strToList(str, split) {
        return str.replace(/\s+/g, '').split(split).reduce(function (obj, value) {
            obj[value] = 1;
            return obj;
        }, {});
    }

    /**
     * Convert string to object
     *
     * @param list
     * @param split
     * @returns {*}
     */
    function strToObj(str, split, key, callback) {
        var array = str.replace(/\s+/g, '').split(split);

        return array.reduce(function (obj, value, index) {
            obj = array;
            obj[index] = {};
            obj[index][key] = value;

            return callback(obj, index);
        }, {});
    }

    /**
     * Filter an Object
     *
     * @param obj
     * @param whitelist
     * @returns {*}
     */
    function filterObj(obj, whitelist) {
        var key;

        for (key in obj) {
            if (!(key in whitelist)) {
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
    function validParam(param, params, list) {
        var key;

        if (param in list) {
            return list[param];
        }

        for (key in list) {
            if (key[0] == '_' && key in params) {
                return list[key];
            }
        }

        return false;
    }

    /**
     *
     */
    function validateType(value, type) {
        switch(type) {
            case 'string':
                return (typeof value == 'string');
                break;

            case 'int':
                return validator.isInt(value);
                break;

            case 'bool':
                return validator.isBoolean(value);
                break;

            case 'alphaSpace':
                return value.match(new RegExp("^[A-Za-z ]+$"));
                break;

            case 'alpha':
                return validator.isAlpha(value);
                break;

            case 'json':
                return validator.isJSON(value.toString());
                break;

            case 'object':
                return (typeof value == 'object');
                break;

            case 'hex':
                //return validator.isHexadecimal(value);
                return (value.match(new RegExp("^[0-9a-fA-F]{24}$")) != null);
                break;

            case 'email':
                return validator.isEmail(value);
                //return (value.match(new RegExp("^[0-9a-fA-F]{24}$")) != null);
                break;

            case 'date':
                return validator.isDate(value);
                break;
        }

        return false;
    }

    /**
     *
     * @param value
     * @param min
     * @param max
     * @returns {*}
     */
    function validateLen(value, min, max)
    {
        return validator.isLength(value, {min: min, max: max})
    }


    /**
     *
     * @param query
     * @param list
     */
    function validateQuery(value, key, list)
    {
        var errors = [];

        if(!validateType(value, list[key]['type'])) {
            errors.push(errorMsg('Invalid ' + key + ' provided', 'apiInvalidDataType', key));
        }

        if('len' in list[key] && !validateLen(value, list[key]['len']['min'], list[key]['len']['max'])) {
            errors.push(errorMsg(key + ' must be ' + list[key]['len']['min'] + ' - ' + list[key]['len']['max'] + ' characters long', 'apiInvalidDataLength', key));
        }

        if(errors.length > 0) {
            return {errors: errors};
        }

        if('escape' in list[key]) {
            value = validator.escape(value);
        }

        if('ObjectID' in list[key]) {
            value = ObjectID(value);
        }

        return value;
    }

    /**
     *
     * @param queries
     * @param list
     */
    function validateQueries(queries, list)
    {
        var key, query, respond = {}, errors = [];

        if(!queries)  {
            errors['errors'].push(errorMsg('Invalid data provided', 'apiInvalidData', 'queries'));
        }

        for(key in queries) {
            query = validateQuery(queries[key], key, list);
            if(typeof query === 'object' && 'errors' in query) {
                errors = errors.concat(query.errors);
                continue;
            }
            respond[key] = query;
        }

        if(errors.length > 0) {
            return {errors: errors};
        }

        return respond;
    }

    /**
     * Compile a string to Javascript
     *
     * @param str
     * @returns {*}
     */
    function compileStr(str)
    {
        var array, obj, key;

        if(typeof str == 'string' && str[0] == '$') {
            array   = str.replace(/\s+/g, '').split(':');
            obj     = array[0].replace('$', '');
            key     = array[1];

            switch(obj) {
                case 'Session':
                    obj = session;
                    break;

                case 'Params':
                    obj = params;
                    break;

                case 'Object':
                    obj = objects;
                    break;

                case 'Fields':
                    obj = fields;
                    break;

                default:
                    break;
            }

            str = (key in obj) ? obj[key] : str;
        }

        return str;
    }

    /**
     * Compile a list of strings to Javascript
     *
     * @param obj
     * @returns {*}
     */
    function compileObj(obj)
    {
        var key;

        for(key in obj) {
            obj[key] = compileStr(obj[key]);
        }

        return obj;
    }

    return {
        error:      errorMsg,
        strToList:  strToList,
        strToObj:   strToObj,
        filterObj:  filterObj,
        validParam: validParam,
        validateQuery: validateQuery,
        validateQueries: validateQueries,
        compileStr: compileStr,
        compileObj: compileObj
    };
};