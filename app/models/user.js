
var mongoose = require('mongoose')
  , _ = require('underscore')
  , utils = spot.utils
  , model = require('./_base');

var UserSchema = model.extend({
	firstName: { type: String, trim: true },
	lastName: { type: String, trim: true },
	phone: { type: String,  set: utils.setPhone, select: false, required: true, index: { unique: true }},
	verificationCode: { type: String, default:  verificationCode, select: false, index: { sparse: true }}
});

// static methods
_.extend(UserSchema.statics, {
	verificationCode: verificationCode
});

// instance methods
_.extend(UserSchema.methods, {
	ensureVerificationCode: function(next) {
		if (self.verificationCode) {
			next(null, self);
		} else {
			self.verificationCode = verificationCode();
			self.save(next);
		}
	}
});

// HELPERS
function verificationCode() {
	return utils.randomHex(6);
}

var User = mongoose.model('User', UserSchema);
module.exports = User;