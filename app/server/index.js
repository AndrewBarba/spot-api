
var port = process.env.PORT || 3000
  , app = require('express')()
  , server = require('http').Server(app)
  , bodyParser = require('body-parser')
  , responseTime = require('response-time')
  , utils = spot.utils

module.exports = function(next) {

    // middle ware
    app.use(responseTime(0));
    app.use(defaultHeaders);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true })); 

    // Start the server
    server.listen(port, function() {
        
        spot.log('Listening on port: '+port);
        
        if (next) {
            next(app);
        }
    });

    return {
        app: app,
        server: server
    }
}

function defaultHeaders(req, res, next) {
    res.header('Content-Type', 'application/json; charset=UTF-8');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    next();
}