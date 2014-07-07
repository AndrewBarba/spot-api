
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Relationship = spot.models.relationship
  , UserService = spot.services.user
  , RelationshipService = spot.services.relationship
  , _ = require('underscore');


/**
 * Get all relationships for current user
 */
exports.fetch = function(req, res, next) {
	var userId = UserService.userId(res);
	Relationship
		.find({ from: userId })
		.select('-from')
		.popluate('group user')
		.sort('-created')
		.exec(function(err, rels){
			if (err) return next(err);
			res.json(rels);
		});
}

/**
 * Create/update relationships from current user to users
 */
exports.create = function(req, res, next) {
	utils.verifyKeys(['users', 'group'], req.body, function(err, body){
		if (err) return next(err);

		var from = UserService.userId(res);
		var users = body.users;
		var group = body.group;

		RelationshipService.formRelationships(form, users, group, function(err, rels){
			if (err) return next(err);
			res.json(rels);
		});
	});
}