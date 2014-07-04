
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Auth = spot.models.auth;

exports.userForPhoneNumber = function(phone, next) {
	phone = utils.setPhone(phone);
	User.find({ phone: phone }, function(err, doc){
		if (err) return next(err);
		if (doc) return next(null, doc);
		User.create({
			phone: phone
		}, next);
	});
}

exports.verifyUser = function(user, code, next) {
	if (user.verificationCode === code && code) {

	} else {
		next(Error.BadRequest('Invalid verification code'));
	}
}