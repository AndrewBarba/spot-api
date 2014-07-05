
var utils = spot.utils
  , Auth = spot.models.auth
  , User = spot.models.user
  , Error = spot.error;

exports.user = function(req, res, next) {
	utils.verifyKeys(['auth'], req.query, function(err, body){
		if (err) return next(err);

		Auth.count({ token: body.auth, valid: true }, function(err, count){
			if (err) return next(err);
			if (count != 1) return next(Error.UnAuthorized());
			next();
		});
	});
}