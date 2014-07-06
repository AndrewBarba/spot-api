
var utils = spot.utils
  , Auth = spot.models.auth
  , User = spot.models.user
  , Error = spot.error;

exports.user = function(req, res, next) {
	utils.verifyKeys(['auth'], req.query, function(err, body){
		if (err) return next(err);

		Auth
			.findOne({ token: body.auth, valid: true })
			.select('user')
			.exec(function(err, doc){
				if (err) return next(err);
				if (!doc) return next(Error.UnAuthorized());
				res.set('spot-user', doc.user);
				next();
			});
	});
}