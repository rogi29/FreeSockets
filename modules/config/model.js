/**
 * Model configuration
 *
 * @param mongoDB
 * @returns {*|exports}
 */
var Model = function(db, cache) {
    this.db = db;
    this.cache = cache;

    if(!(this instanceof Model)){
        return new Model(db);
    }

    return this;
};

Model.prototype = {
    use: function(path, parameters, fields)
    {
        return require(path)(this.db, this.cache, parameters, fields);
    }
};

module.exports = Model;