/**
 * MongoDB Configuration
 *
 * @param url
 * @returns {Mongo}
 * @constructor
 */
var Mongo = function(url) {

    var mongo = require("mongodb"),
        client = mongo.MongoClient;

    this.url = url;
    this.client  = client;

    if(!(this instanceof Mongo)){
        return new Mongo(url);
    }

    return this;
};

/**
 * MongoDB Methods
 *
 * @type {{connect: Function, disconnect: Function}}
 */
Mongo.prototype = {
    /**
     * Connect to DB
     *
     * @param callback
     */
    connect: function (callback)
    {
        this.client.connect(this.url, function (error, db) {
            if(error){
                console.log('Error connecting to Db');
                return;
            }
            console.log('MongoDB connection established');

            callback(error, db);
        });
    }
};

module.exports = Mongo;