
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , UserService = spot.services.user
  , AuthService = spot.services.auth;

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

/**
 * Initiates login for a user with a given phone number
 *
 * @phone - phone number of the user logging in
 */
exports.initiateLogin = function(req, res, next) {
 	utils.verifyKeys(['phone'], req.body, function(err, body){
 		if (err) return next(err);

 		UserService.userForPhone(body.phone, function(err, user){
 			if (err) return next(err);	
 			
 			AuthService.initiateLoginForUser(user, function(err){
 				if (err) return next(err);

 				res.json(utils.ok());
 			});
 		});
 	});
}

/**
 * Verifies a users phone number and return their auth token
 *
 * @phone - phone number of user
 * @verificationCode - verification code sent to user in text
 */
exports.verifyUser = function(req, res, next) {
	utils.verifyKeys(['phone', 'verificationCode'], req.body, function(err, body){
		if (err) return next(err);

		UserService.userForPhone(body.phone, function(err, user){
			if (err) return next(err);

			UserService.verifyUser(user, body.verificationCode, function(err){
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

