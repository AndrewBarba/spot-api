
var _ = require('underscore');

// GLOBAL
spot = {};

// logging
spot.log = console.log;

// config
spot.config = require('./config');

// errors
spot.error = require('./errors');

// utlities
spot.utils = require('./utils');

// libs
spot.lib = require('./lib');

// database
spot.database = require('./database');

// models
spot.models = require('./models');

// services
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