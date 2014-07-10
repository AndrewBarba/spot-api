
var mongoose = require('mongoose')
  , _ = require('underscore')
  , utils = spot.utils
  , model = require('./_base');

var ContactSchema = model.extend({
	user: { type: String, ref: 'User', select: false, requried: true, index: true },
	phone: { type: String, index: true },
	nickname: { type: String }
});

var Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;