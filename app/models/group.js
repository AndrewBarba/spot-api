
var mongoose = require('mongoose')
  , utils = spot.utils
  , model = require('./_base');

var GroupSchema = model.extend({
	user: { type: String, ref: 'User', requried: true, index: true },
	priority: { type: Number, default: 0, min: 0, required: true },
	name: { type: String, required: true, trim: true }
});

var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;