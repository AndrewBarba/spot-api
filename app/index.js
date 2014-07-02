
var _ = require('underscore')
  , async = require('async')
  , utils = require('./utils')
  , config = require('./config')

// GLOBALS
spot = {

	// helpers
	config: config,
	utils: utils,

	// logging
	log: console.log,
	error: console.log
};

_.extend(spot, {
	database: require('./database'),
	models: require('./models')
});

// Web application server
exports.server = function() {
	spot.database(function(){
		
		// start the server
		var server = require('./server')();
		
		_.extend(spot, server);
	});
};

// Jobs server
exports.jobs = function() {
	spot.database(function(){

	});
};