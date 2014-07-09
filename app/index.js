
var _ = require('underscore')
  , winston = require('winston')
  , logger = logger('info')
  , newrelic = require('newrelic');

// GLOBAL
spot          = {};
spot.log      = logger.info;
spot.warn     = logger.warn;
spot.err      = logger.error;
spot.info     = require('../package');
spot.config   = require('./config');
spot.error    = require('./errors');
spot.utils    = require('./utils')
spot.lib      = require('./lib');
spot.database = require('./database');

function init() {
	spot.models   = require('./models');
	spot.services = require('./services');
	spot.auth     = require('./authorization');
}

// Web application server
exports.server = function(next, options) {
	options = options || {};

	spot.database(function(err){
		if (err) throw err;
		
		// load dependencies
		init();

		// start the server
		var server = require('./server')(next);
		
		// init controllers
		spot.controllers = require('./controllers')(server.app);

		// add server to global
		_.extend(spot, server);

	}, options.database);

	spot.log('SPOT WEB SERVER');
};

// Jobs server
exports.jobs = function(next, options) {
	options = options || {};

	spot.database(function(err){
		if (err) throw err;

		// load dependencies
		init();

		// start jobs server
		spot.jobs = require('./jobs')(next);
		
	}, options.database);

	spot.log('SPOT JOBS SERVER');
};

// logger
function logger(level) {
    var transports = [new winston.transports.Console({
        level: level || 'info',
        colorize: true
    })];

    return new winston.Logger({
        transports: transports
    });
}

