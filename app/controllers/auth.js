
var utils = spot.utils
  , Error = spot.error
  , UserService = spot.services.user
  , AuthService = spot.services.auth;

/**
 * Finds or creates a user for a given phone number
 * Sends text to number with verification code
 *
 * @phone - phone number of user
 */
exports.initiateLogin = function(req, res, next) {
	utils.verifyKeys(['phone'], req.body, function(err, body){
		if (err) return next(err);

		var phone = body.phone;
		UserService.userForPhone(phone, function(err, user){
			if (err) return next(err);

			AuthService.initiateLoginForUser(user, function(err){
				if (err) return next(err);

				res.json({
					status: 'success'
				});
			});
		});
	});
}

/**
 * Verifies a user returns proper auth token
 *
 * @phone - Phone number of user
 * @verificationCode - verification code sent to user in text
 */
exports.verifyUser = function(req, res, next) {
	utils.verifyKeys(['phone', 'verificationCode'], req.body, function(err, body){
		if (err) return next(err);

		var phone = body.phone;
		var code = body.verificationCode;
		UserService.userForPhone(phone, function(err, user){
			if (err) return next(err);

			UserService.verifyUser(user, code, function(err){
				if (err) return next(err);

				AuthService.authForUser(user, function(err, auth){
					if (err) return next(err);

					res.json({
						token: auth.token
					});
				});
			});
		});
	});
}