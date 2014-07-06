
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Auth = spot.models.auth;

exports.userForAuth = function(token, next) {
	Auth
		.findOne({ token: token, valid: true })
		.select('user')
		.exec(function(err, doc){
			if (err) return next(err);
			if (!doc) return next(Error.UnAuthorized());
			
			User
				.findById(doc.user) 
				.select('+phone')
				.exec(function(err, user){
					if (err) return next(err);
					if (!doc) return next(Error.BadRequest('Could not find user with _id: '+doc.user));
					next(null, user);
				});
		});
}

exports.userForPhone = function(phone, next) {
	phone = utils.setPhone(phone);
	if (!phone) {
		return next(Error.BadRequest('Invalid phone number'));
	}
	
	User
		.findOne({ phone: phone })
		.select('+phone')
		.select('+verificationCode')
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