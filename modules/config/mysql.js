/**
 * MySql Configuration
 *
 * @param connection
 * @returns {MySql}
 * @constructor
 */

var MySql = function(connection) {

    if(!(this instanceof MySql)){
        return new MySql(connection);
    }

    var mysql  = require("mysql");
    this.db = mysql.createConnection(connection);

    return this;
};

/**
 * MySql Methods
 *
 * @type {{connect: Function, disconnect: Function}}
 */
MySql.prototype = {
    /**
     *
     */
    connect: function ()
    {
        this.db.connect(function(error){
            if(error){
                console.log('Error connecting to Db');
                return;
            }
            console.log('MySQL connection established');
        });
    },

    /**
     *
     */
    disconnect: function()
    {
        this.db.end(function(err) {
            // The connection is terminated gracefully
            // Ensures all previously enqueued queries are still
            // before sending a COM_QUIT packet to the MySQL server.
        });
    }
};

module.exports = MySql;