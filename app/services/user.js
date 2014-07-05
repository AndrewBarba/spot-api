
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Auth = spot.models.auth;

exports.userForAuth = function(token, next) {
	Auth
		.findOne({ token: token, valid: true })
		.populate('user')
		.exec(function(err, doc){
			if (err) return next(err);
			next(null, doc.user);
		});
}

exports.userForPhone = function(phone, next) {
	phone = utils.setPhone(phone);
	User
		.findOne({ phone: phone })
		.select('+phone')
		.exec(function(err, doc){
			if (err) return next(err);
			if (doc) return next(null, doc);
			User.create({
				phone: phone
			}, next);
		});
}

exports.verifyUser = function(user, code, next) {
	if (code && user.verificationCode === code) {
		user.verificationCode = null;
		user.save(next);
	} else {
		next(Error.BadRequest('Invalid verification code'));
	}
}