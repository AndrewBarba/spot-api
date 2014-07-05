
var express = require('express')
  , utils = spot.utils
  , config = spot.config
  , Error = spot.error
  , auth = spot.auth;

module.exports = function(app) {

	// load all controllers
	var controllers = utils.loadFiles(__dirname);

	// root
	app.get('/', controllers.root.root);
	app.get('/status', controllers.root.status);

	// user
	app.get('/me', controllers.user.me);

	// not found
	app.use(function(req, res, next){
		next(Error.NotFound());
	});

	// handle errors
	app.use(function(err, req, res, next){
		Error.send(err, res);
	});

	return controllers;
}