
var utils = spot.utils
  , User = spot.models.user
  , Auth = spot.models.auth;

exports.authForUser = function(user, next) {
	var userId = user.id;
	Auth.find({ user: userId, valid: true }, function(err, auth){
		if (err) return next(err);
		if (auth) return next(null, auth);
		Auth.create({
			user: userId
		}, next);
	});
}