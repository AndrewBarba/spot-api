
var utils = spot.utils
  , Auth = spot.models.auth
  , User = spot.models.user
  , Group = spot.models.group
  , Relationship = spot.models.relationship
  , Spot = spot.models.spot
  , UserService = spot.services.user
  , SpotService = spot.services.spot
  , Error = spot.error;

exports.user = function (req, res, next) {
	utils.verifyKeys(['auth'], req.query, function(err, body){
		if (err) return next(err);

		Auth
			.findOne({ token: body.auth, valid: true })
			.select('user')
			.lean()
			.exec(function(err, doc){
				if (err) return next(err);
				if (!doc) return next(Error.UnAuthorized());
				res.set(UserService.userHeaderKey(), doc.user);
				next(null, doc.user);
			});
	});
}

exports.group = function(req, res, next) {
	exports.user(req, res, function(err){
		if (err) return next(err);

		var groupId = req.params.id;
		var userId = UserService.userId(res);
		
		Group.count({ _id: groupId, user: userId }, function(err, count){
			if (err) return next(err);
			if (count != 1) next(Error.NotFound());
			next();
		});
	});
}

exports.spot = function(req, res, next) {
	exports.user(req, res, function(err, userId){
		if (err) return next(err);
		
		Spot
			.findById(req.params.id)
			.select('groups user')
			.exec(function(err, doc){
				if (err) return next(err);
				if (!doc) return next(Error.NotFound());
				if (doc.user === userId) return next();

				var query = { to: userId, group: { $in: doc.groups }};
				Relationship.count(query, function(err, count){
					if (err) return next(err);
					if (!count) return next(Error.NotFound());
					next();
				});
			});
	});
}










