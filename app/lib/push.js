
var _ = require('underscore')
  , apn = require('apn')
  , config = spot.config
  , utils = spot.utils
  , Error = spot.error;

var ios = new apn.Connection({
	gateway : config.apns.gateway,
	cert    : config.apns.cert,
	key     : config.apns.key
});

exports.sendPush = function(tokens, message, payload, next) {
	_.each(tokens, function(token){
		var push = new apn.Notification();
		push.expiry = Math.floor(Date.now() / 1000) + (12 * 60 * 60); // Expires x hours from now.
		push.sound = "ping.aiff";
		push.alert = message;
		push.payload = _.extend({}, payload);
		ios.pushNotification(push, token);
	});
	next();
}