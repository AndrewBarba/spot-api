
var twilio = require('twilio')
  , config = spot.config
  , client = twilio(config.twilio.sid, config.twilio.token);

var LOCAL_TEXTS = {};

exports.sendText = function(phone, message, next) {
    if (!config.env.TEST) {
        client.sms.messages.create({
            from: config.twilio.number,
            to: phone,
            body: message
        }, next);
    } else {
        addLocalText(phone, message);
        next();
    }
}

exports.getLocalTexts = function(phone) {
    return LOCAL_TEXTS[phone] || [];
}

function addLocalText(phone, message) {
    var messages = LOCAL_TEXTS[phone] || [];
    messages.push(message);
    LOCAL_TEXTS[phone] = messages;
}