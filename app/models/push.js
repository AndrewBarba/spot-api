
var mongoose = require('mongoose')
  , _ = require('underscore')
  , utils = spot.utils
  , model = require('./_base');

var PushSchema = model.extend({
	user: { type: String, ref: 'User', select: false, requried: true, index: true },
	token: { type: String, default: utils.authToken, index: { unique: true }},
	type: { type: String, default: 'ios' }
});

_.extend(PushSchema.methods, {
	
	getHiddenKeys: function() {
		return [ 'user' ];
	}
});

var Push = mongoose.model('Push', PushSchema);
module.exports = Push;