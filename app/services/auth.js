
var utils = spot.utils
  , Error = spot.error
  , SMS = spot.lib.sms
  , User = spot.models.user
  , Auth = spot.models.auth;

exports.initiateLoginForUser = function(user, next) {
	user.ensureVerificationCode(function(err, user){
		if (err) return next(err);
		var phone = user.phone;
		var message = verificationCodeMessage(user.verificationCode);
		SMS.sendText(phone, message, next);
	});
}

exports.authForUser = function(user, next) {
	var userId = user.id;
	Auth.findOne({ user: userId, valid: true }, function(err, auth){
		if (err) return next(err);
		if (auth) return next(null, auth);
		Auth.create({
			user: userId
		}, next);
	});
}

// HELPERS
function verificationCodeMessage(code) {
	return "Code: " + code + "\nEnter your verification to login.";
}