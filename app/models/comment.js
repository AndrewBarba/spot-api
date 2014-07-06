
var mongoose = require('mongoose')
  , utils = spot.utils
  , model = require('./_base');

var CommentSchema = model.extend({
	spot: { type: String, ref: 'Spot', required: true, index: true },
	user: { type: String, ref: 'User' },
	message: { type: String, trim: true },
});

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;