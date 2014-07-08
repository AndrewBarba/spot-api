
var mongoose = require('mongoose')
  , config = spot.config
  , utils = spot.utils;

var _connected = false;

module.exports = function(onConnect, options) {
    options = options || {};

    // check for current connection
    if (_connected) {
        return onConnect();
    }

    // connection options
    var dbOptions = {
        server: {
            socketOptions : { keepAlive : 1 } // keep the connection open even if inactive
        }
    };

    // connect to database
    mongoose.connect(config.db, dbOptions, function(err){
        _connected = !err;

        if (options.dropDatabase) {
            mongoose.connection.db.dropDatabase(onConnect);
        } else {    
            onConnect(err);
        }
    });

    return mongoose;
}