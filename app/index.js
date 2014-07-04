
var _ = require('underscore')
  , async = require('async')
  , utils = require('./utils')
  , config = require('./config')
  , errors = require('./errors');

// GLOBAL
spot = {
	config: config,
	utils: utils,
	error: errors,
	log: console.log
};

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

	});
};