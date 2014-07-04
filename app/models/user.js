
var mongoose = require('mongoose')
  , utils = spot.utils
  , model = require('./_base');

var UserSchema = model.extend({
	firstName: { type: String, trim: true },
	lastName: { type: String, trim: true },
	phone: { type: String,  set: utils.setPhone, select: false, index: { unique: true }},
	verificationCode: { type: String, default:  verificationCode, select: false, index: { sparse: true }}
});

// HELPERS
function verificationCode() {
	return utils.randomHex(6);
}

var User = mongoose.model('User', UserSchema);
module.exports = User;