/**
 * Model configuration
 *
 * @param mongoDB
 * @returns {*|exports}
 */
var Model = function() {
    //this.req = req;

    if(!(this instanceof Model)){
        return new Model();
    }

    return this;
};

Model.prototype = {
    use: function(path, req)
    {
        return require(path)(req);
    }
};

module.exports = Model;