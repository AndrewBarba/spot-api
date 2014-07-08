
var mongoose = require('mongoose')
  , utils = spot.utils
  , model = require('./_base');

var SpotSchema = model.extend({
	user: { type: String, ref: 'User', select: false, required: true, index: true },
	message: { type: String, trim: true },
	groups: { type: [String], select: false, required: true, index: true },
	location: { type: [Number], index: '2d', sparse: true }, // [ longitude, latitude ]
	active: { type: Boolean, default: true, index: true }
});

var Spot = mongoose.model('Spot', SpotSchema);
module.exports = Spot;