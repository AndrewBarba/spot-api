
var mongoose = require('mongoose')
  , Error = spot.error;

exports.root = function(req, res, next) {
    res.json(spot.info);
}

exports.status = function(req, res, next) {

    // check if we are connected to mongohq
    var connected = mongoose.connection.readyState == 1;

    if (connected) {
        res.json({ 
            'status' : 'OK',
            'environment' : process.env.NODE_ENV,
            'node' : process.version,
            'database' : mongoose.connection.db.databaseName
        });
    } else {
        Error.send(res, Error.ServerError('Lost connection to database'));
    }
}