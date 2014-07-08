
var mongoose = require('mongoose')
  , _ = require('underscore')
  , utils = spot.utils
  , model = require('./_base');

var AuthSchema = model.extend({
	user: { type: String, ref: 'User', select: false, requried: true, index: true },
	token: { type: String, default: utils.authToken, select: false, index: { unique: true }},
	valid: { type: String, default: true, select: false, index: true }
});

_.extend(AuthSchema.methods, {
	
	getHiddenKeys: function() {
		return [ 'user', 'valid' ];
	}
});

var Auth = mongoose.model('Auth', AuthSchema);
module.exports = Auth;