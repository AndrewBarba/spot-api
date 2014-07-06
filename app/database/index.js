
var mongoose = require('mongoose')
  , config = spot.config
  , utils = spot.utils;

module.exports = function(onConnect, options) {
    options = options || {};

    // connection options
    var dbOptions = {
        server: {
            socketOptions : { keepAlive : 1 } // keep the connection open even if inactive
        }
    };

    // connect to database
    mongoose.connect(config.db, dbOptions, function(err){
        if (options.dropDatabase) {
            mongoose.connection.db.dropDatabase(onConnect);
        } else {    
            onConnect(err);
        }
    });

    return mongoose;
}