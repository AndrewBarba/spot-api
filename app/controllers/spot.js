
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Spot = spot.models.spot
  , Comment = spot.models.comment
  , UserService = spot.services.user
  , SpotService = spot.services.spot
  , _ = require('underscore');

/**
 * Create a new spot
 */
exports.create = function(req, res, next) {

}

/**
 * Fetch active spots for current user
 */
exports.fetchActive = function(req, res, next) {

}

/**
 * Comment on a spot
 */
exports.comment = function(req, res, next) {
	utils.verifyKeys(['comment'], req.body, function(err, body){
		if (err) return next(err);

		var userId = UserService.userId(res);
		var spotId = req.params.id;
		var text = body.comment;

		Comment.create({
			spot: spotId,
			user: userId,
			message: text
		}, function(err, doc){
			if (err) return next(err);
			res.json(doc);
		});
	});
}

/**
 * Leave a spot by setting it to inactive
 */
exports.leave = function(req, res, next) {
	var spotId = req.params.id;
	var userId = UserService.userId(res);
	var query = { _id: spotId, user: userId };
	var update = { active: false };

	Spot.spot().findOneAndUpdate(query, update, function(err, doc){
		if (err) return next(err);
		if (!doc) return next(Error.NotFound('Could not find your spot with id: ' + spotId));
		res.json(doc);
	});
}