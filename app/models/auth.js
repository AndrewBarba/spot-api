
var mongoose = require('mongoose')
  , utils = spot.utils
  , model = require('./_base');

var AuthSchema = model.extend({
	user: { type: String, ref: 'User', requried: true, index: true },
	token: { type: String, default: utils.authToken, index: { unique: true }},
	valid: { type: String, default: true, select: false, index: true }
});

var Auth = mongoose.model('Auth', AuthSchema);
module.exports = Auth;