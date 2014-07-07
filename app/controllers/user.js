
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , UserService = spot.services.user
  , AuthService = spot.services.auth
  , _ = require('underscore');

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

/**
 * Updates the current user
 */
exports.updateCurrent = function(req, res, next) {
	var ALLOWED_UPDATES = [ 'firstName', 'lastName', 'imageUrl' ];

	var userId = UserService.userId(res);
	var data = utils.select(ALLOWED_UPDATES, req.body);
	
	User.spot().findByIdAndUpdate(userId, data, function(err, doc){
		if (err) return next(err);
		if (!doc) return next(Error.NotFound('Could not find user with id: '+userId));
		res.json(doc);
	});
}

/**
 * Find users with phone number
 */
exports.find = function(req, res, next) {
	var phones = _.map(req.body.phones, utils.setPhone);
	UserService.usersWithPhones(phones, function(err, users){
		if (err) return next(err);
		res.json(users);
	});
}





























