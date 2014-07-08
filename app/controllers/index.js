
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
	app.post('/user/find', auth.user.user, controllers.user.find);

	// groups
	app.get('/group', auth.user.user, controllers.group.fetch);
	app.post('/group', auth.user.user, controllers.group.create);
	app.put('/group/:id', auth.user.user, controllers.group.update);
	app.get('/group/:id/relationship', auth.user.user, controllers.relationship.fetchForGroup);

	// relationships
	app.get('/relationship', auth.user.user, controllers.relationship.fetch);
	app.post('/relationship', auth.user.user, controllers.relationship.create);
	app.put('/relationship/:id', auth.user.user, controllers.relationship.update);

	// spot
	app.get('/spot', auth.user.user, controllers.spot.fetchActive);
	app.post('/spot', auth.user.user, controllers.spot.create);
	app.post('/spot/:id/comment', auth.user.spot, controllers.spot.comment);
	app.delete('/spot/:id', auth.user.user, controllers.spot.leave);

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