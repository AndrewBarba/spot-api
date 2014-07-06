
var mongoose = require('mongoose')
  , utils = spot.utils
  , model = require('./_base');

var RelationshipSchema = model.extend({
	from: { type: String, ref: 'User', requried: true, index: true },
	to: { type: String, ref: 'User', requried: true, index: true },
	group: { type: String, ref: 'Group', index: { sparse: true }},
	nickname: { type: String }
});

var Relationship = mongoose.model('Relationship', RelationshipSchema);
module.exports = Relationship;