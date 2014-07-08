
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Relationship = spot.models.relationship
  , Group = spot.models.group
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
		.populate('group user')
		.sort('-created')
		.exec(function(err, rels){
			if (err) return next(err);
			res.json(rels);
		});
}

/**
 * Fetch all relationships in a given group
 */
exports.fetchForGroup = function(req, res, next) {
	
	var groupId = req.params.id;
	var userId = UserService.userId(res);
	var query = { group: groupId, from: userId  };

	Relationship
		.find(query)
		.select('-from -group')
		.popluate('to')
		.exec(function(err, docs){
			if (err) return next(err);
			res.json(docs);
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

		RelationshipService.formRelationships(from, users, group, function(err, rels){
			if (err) return next(err);
			res.json(rels);
		});
	});
}

/**
 * Update a relationship
 */
exports.update = function(req, res, next) {
	var ALLOWED_UPDATES = [ 'blocked', 'nickname', 'group' ];

	var relId = req.params.id;
	var userId = UserService.userId(res);
	var query = { _id: relId, from: userId };
	var update = utils.select(ALLOWED_UPDATES, req.body);

	Relationship.spot().findOneAndUpdate(query, update, function(err, doc){
		if (err) return next(err);
		if (!doc) return next(Error.NotFound('Could not find your relationship with id: ' + relId));
		res.json(doc);
	});
}





















