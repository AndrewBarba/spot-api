
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
	utils.verifyKeys(['message', 'groups', 'location'], req.body, function(err, body){
		if (err) return next(err);

		var userId = UserService.userId(res);
		var message = body.message;
		var location = body.location;
		var groupIds = body.groups;

		SpotService.createSpot(userId, message, location, groupIds, function(err, spot){
			if (err) return next(err);
			res.json(spot);
		});
	});
}

/**
 * Fetch active spots for current user
 */
exports.fetchActive = function(req, res, next) {
	
	var userId = UserService.userId(res);
	var location = null;
	var distance = 0;

	SpotService.fetchActiveSpots(userId, location, distance, function(err, spots){
		if (err) return next(err);
		res.json(spots);
	});
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