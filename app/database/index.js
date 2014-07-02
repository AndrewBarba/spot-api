
var mongoose = require('mongoose')
  , config = spot.config
  , utils = spot.utils

module.exports = function(onConnect, onDisconnect) {

    // connection options
    var dbOptions = {
        server: {
            socketOptions : { keepAlive : 1 } // keep the connection open even if inactive
        }
    };

    // connect to database
    mongoose.connect(config.db, dbOptions, onConnect);

    // handle disconnect
    if (onDisconnect) {
        mongoose.connection.on('disconnected', onDisconnect);
    }
}