
var _ = require('underscore')
  , async = require('async');

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
exports.server = function() {
	spot.database(function(){
		
		// start the server
		var server = require('./server')();
		
		// init controllers
		var controllers = require('./controllers')(server.app);

		// add server to global
		_.extend(spot, server);
	});
};

// Jobs server
exports.jobs = function() {
	spot.database(function(){

		// start jobs server
		var jobs = require('./jobs');
	});
};