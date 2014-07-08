
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
    app.use(log);

    // Start the server
    server.listen(port, function() {        
        if (next) {
            next(app);
        }
    });

    return {
        app: app,
        server: server,
        port: port
    }
}

function defaultHeaders(req, res, next) {
    res.header('Content-Type', 'application/json; charset=UTF-8');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    next();
}

function log(req, res, next) {
    if (!spot.config.env.TEST) {
        var path = req.url.split('?')[0];
        spot.log(req.method, path, req.params, req.query, req.body);
    }
    next();
}


