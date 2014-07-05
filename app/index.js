
var _ = require('underscore');

// GLOBAL
spot          = {};
spot.log      = console.log;
spot.info     = require('../package');
spot.config   = require('./config');
spot.error    = require('./errors');
spot.utils    = require('./utils');
spot.lib      = require('./lib');
spot.database = require('./database');
spot.models   = require('./models');
spot.services = require('./services');

// Web application server
exports.server = function(next) {

	spot.log('Starting application server...');
	
	spot.database(function(err){
		if (err) throw err;
		
		// start the server
		var server = require('./server')(next);
		
		// init controllers
		var controllers = require('./controllers')(server.app);

		// add server to global
		_.extend(spot, server);
	});
};

// Jobs server
exports.jobs = function() {

	spot.log('Starting jobs server...');

	spot.database(function(err){
		if (err) throw err;

		// start jobs server
		var jobs = require('./jobs');
	});
};