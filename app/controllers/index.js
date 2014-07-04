
var express = require('express')
  , utils = spot.utils
  , config = spot.config
  , Error = spot.error;

module.exports = function(app) {

	// load all controllers
	var controllers = utils.loadFiles(__dirname);

	

	// not found
	app.use(function(req, res, next){
		next(Error.NotFound());
	});

	// handle errors
	app.use(function(err, req, res, next){
		Error.send(res, err);
	});

	return controllers;
}