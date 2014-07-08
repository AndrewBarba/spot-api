
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Push = spot.models.push
  , apn = spot.lib.push
  , _ = require('underscore');

exports.sendPushForUser = function(userId, message, payload, next) {
	exports.pushTokensForUser(userId, function(err, pushes){
		if (err) return next(err);

		var tokens = _.pluck(pushes, 'token');
		apn.sendPush(tokens, message, payload, next);
	});
}

exports.pushTokensForUser = function(userId, next) {
	Push
		.find({ user: userId })
		.select('-user')
		.exec(next);
}

exports.addPushTokenForUser = function(userId, token, type, next) {

	Push.findOne({ token: token }, function(err, doc){
		if (err) return next(err);
		
		if (doc) {
			doc.user = userId;
			doc.type = type;
			doc.save(next);
		} else {
			Push.create({
				user: userId,
				token: token,
				type: type
			}, next);
		}
	});
}