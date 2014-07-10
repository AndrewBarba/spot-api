
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , UserService = spot.services.user
  , AuthService = spot.services.auth
  , PushService = spot.services.push
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

		UserService.verifyUserByPhone(body.phone, body.verificationCode, function(err, user){
			if (err) return next(err);

			AuthService.authForUser(user, function(err, auth){
				if (err) return next(err);

				res.json(auth);
			});
		});
	});
}

/**
 * Updates the current user
 */
exports.updateCurrent = function(req, res, next) {
	var ALLOWED_UPDATES = [ 'firstName', 'lastName', 'imageUrl', 'location' ];

	var userId = UserService.userId(res);
	var update = utils.select(ALLOWED_UPDATES, req.body);
	
	User.spot().findByIdAndUpdate(userId, update, function(err, doc){
		if (err) return next(err);
		if (!doc) return next(Error.NotFound('Could not find user with id: ' + userId));
		res.json(doc);
	});
}

/**
 * Find users with phone number
 */
exports.find = function(req, res, next) {
	utils.verifyKeys(['phones'], req.body, function(err, body){
		if (err) return next(err);

		var phones = _.map(body.phones, utils.setPhone);
		UserService.usersWithPhones(phones, function(err, users){
			if (err) return next(err);
			res.json(users);
		});
	});
}

/**
 * Post contacts for user
 */
exports.addContacts = function(req, res, next) {
	utils.verifyKeys(['contacts'], req.body, function(err, body){
		if (err) return next(err);

		var userId = UserService.userId(res);
		var contacts = req.body.contacts;

		UserService.storeContactsForUser(userId, contacts, function(err, count){
			if (err) return next(err);
			res.json({
				count: count
			});
		});
	});
}

/**
 * Adds a push token to a user
 */
exports.addPushToken = function(req, res, next) {
	utils.verifyKeys(['token', 'type'], req.body, function(err, body){
		if (err) return next(err);

		var userId = UserService.userId(res);
		var token = body.token;
		var type = body.type;

		PushService.addPushTokenForUser(userId, token, type, function(err, push){
			if (err) return next(err);
			res.json(push);
		});
	});
}





























