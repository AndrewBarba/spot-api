
var utils = spot.utils
  , User = spot.models.user
  , UserService = spot.services.user;

/**
 * Gets the current user
 */
exports.me = function(req, res, next) {
	utils.verifyKeys(['auth'], req.query, function(err, body){
		if (err) return next(err);

		UserService.userForAuth(body.auth, function(err, user){
			if (err) return next(err);
			res.json(user);
		});
	});
}