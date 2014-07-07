
var utils = spot.utils
  , Auth = spot.models.auth
  , User = spot.models.user
  , Group = spot.models.group
  , UserService = spot.services.user
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
				res.set('spot-user', doc.user);
				next();
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