
var mongoose = require('mongoose')
  , _ = require('underscore')
  , utils = spot.utils
  , model = require('./_base');

var TOKEN_TYPES = [ 'ios', 'android' ];

var PushSchema = model.extend({
	user: { type: String, ref: 'User', select: false, requried: true, index: true },
	token: { type: String, default: utils.authToken, index: { unique: true }},
	type: { type: String, default: TOKEN_TYPES[0], enum: TOKEN_TYPES }
});

_.extend(PushSchema.methods, {
	
	getHiddenKeys: function() {
		return [ 'user' ];
	}
});

var Push = mongoose.model('Push', PushSchema);
module.exports = Push;