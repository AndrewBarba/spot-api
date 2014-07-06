
var mongoose = require('mongoose')
  , utils = spot.utils
  , model = require('./_base');

var SpotSchema = model.extend({
	user: { type: String, ref: 'User', required: true, index: true },
	message: { type: String, trim: true },
	groups: { type: [String], required: true, index: true },
	location: { type: [Number], index: '2d', sparse: true }, // [ longitude, latitude ]
});

var Spot = mongoose.model('Spot', SpotSchema);
module.exports = Spot;