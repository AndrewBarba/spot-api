
var mongoose = require('mongoose')
  , _ = require('underscore')
  , utils = spot.utils
  , model = require('./_base');

var UserSchema = model.extend({
	firstName: { type: String, trim: true },
	lastName: { type: String, trim: true },
	imageUrl: { type: String, trim: true },
	phone: { type: String,  set: utils.setPhone, select: false, required: true, index: { unique: true }},
	verificationCode: { type: String, default:  verificationCode, select: false, index: { sparse: true }},
	location: { type: [Number], index: '2d', sparse: true, select: false }, // [ longitude, latitude ]
});

// static methods
_.extend(UserSchema.statics, {
	verificationCode: verificationCode
});

// instance methods
_.extend(UserSchema.methods, {
	ensureVerificationCode: function(next) {
		if (this.verificationCode) {
			next(null, this);
		} else {
			this.verificationCode = verificationCode();
			this.save(next);
		}
	}
});

// HELPERS
function verificationCode() {
	return utils.randomNumberString(6);
}

var User = mongoose.model('User', UserSchema);
module.exports = User;