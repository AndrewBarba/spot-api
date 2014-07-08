
var mongoose = require('mongoose')
  , _ = require('underscore')
  , utils = spot.utils
  , model = require('./_base');

var SpotSchema = model.extend({
	user: { type: String, ref: 'User', select: false, required: true, index: true },
	message: { type: String, trim: true, index: 'text' },
	groups: { type: [String], select: false, required: true, index: true },
	location: { type: [Number], required: true, index: '2d', sparse: true }, // [ longitude, latitude ]
	active: { type: Boolean, default: true, index: true }
});

_.extend(SpotSchema.methods, {
	
	getHiddenKeys: function() {
		return [ 'groups' ];
	}
})

var Spot = mongoose.model('Spot', SpotSchema);
module.exports = Spot;