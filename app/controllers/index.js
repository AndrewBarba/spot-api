
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

	// me
	app.get('/me', controllers.user.me);
	app.put('/me', auth.user.user, controllers.user.updateCurrent);

	// user
	app.post('/user', controllers.user.initiateLogin);
	app.post('/user/verify', controllers.user.verifyUser);
	app.post('/user/find/phone', auth.user.user, controllers.user.find);

	// groups
	app.post('/group', auth.user.user, controllers.group.create);
	app.put('/group/:id', auth.user.user, controllers.group.update);

	// relationships
	app.get('/relationship', auth.user.user, controllers.relationship.fetch);
	app.post('/relationship', auth.user.user, controllers.relationship.create);
	app.put('/relationship/:id', auth.user.user, controllers.relationship.update);

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