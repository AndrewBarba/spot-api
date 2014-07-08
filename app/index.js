
var _ = require('underscore')
  , winston = require('winston');

// GLOBAL
spot          = {};
spot.log      = console.log;
spot.warn     = winston.warn;
spot.err      = winston.error;
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
		var controllers = require('./controllers')(server.app);

		// add server to global
		_.extend(spot, server);
	}, options.database);

	spot.log('SPOT WEB SERVER\n');
};

// Jobs server
exports.jobs = function(next, options) {
	options = options || {};

	spot.database(function(err){
		if (err) throw err;

		// load dependencies
		init();

		// start jobs server
		var jobs = require('./jobs');
	}, options.database);

	spot.log('SPOT JOBS SERVER\n');
};