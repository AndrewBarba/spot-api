
var utils = spot.utils
  , Error = spot.error
  , Group = spot.models.group
  , UserService = spot.services.user
  , GroupService = spot.services.group;

/**
 * Fetch groups for current user
 */
exports.fetch = function(req, res, next) {
	Group
		.find({ user: UserService.userId(res) })
		.select('-user')
		.exec(function(err, docs){
			if (err) return next(err);
			res.json(docs);
		});
}

/**
 * Create a new Group
 */
exports.create = function(req, res, next) {
	var ALLOWED_KEYS = [ 'name', 'priority' ];
	
	var data = utils.select(ALLOWED_KEYS, req.body);
	data.user = UserService.userId(res);
	
	Group.create(data, function(err, doc){
		if (err) return next(err);
		res.json(doc);
	});
}

/**
 * Update an existing Group
 */
exports.update = function(req, res, next) {
	var ALLOWED_KEYS = [ 'name', 'priority' ];

	var groupId = req.params.id;
	var userId = UserService.userId(res);
	var query = { _id: groupId, user: userId };
	var update = utils.select(ALLOWED_KEYS, req.body);

	Group.spot().findOneAndUpdate(query, update, function(err, doc){
		if (err) return next(err);
		if (!doc) return next(Error.NotFound('Could not find your group with id: ' + groupId));
		res.json(doc);
	});
}