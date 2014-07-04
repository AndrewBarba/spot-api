
var twilio = require('twilio')
  , config = spot.config
  , client = twilio(config.twilio.sid, config.twilio.token);

exports.sendText = function(phone, message, next) {
    if (!config.env.LOCAL) {
        client.sms.messages.create({
            from: config.twilio.number,
            to: phone,
            body: message
        }, next);
    } else {
        next();
    }
}