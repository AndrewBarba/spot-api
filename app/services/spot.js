
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Relationship = spot.models.relationship
  , Group = spot.models.group
  , Spot = spot.models.spot
  , Comment = spot.models.comment
  , _ = require('underscore');

exports.createSpot = function(userId, message, location, groupIds, next) {
	Group.count({ user: userId, _id: { $in: groupIds }}, function(err, count){
		if (err) return next(err);
		if (count != groupIds.count) return next(Error.BadRequest('You cannot post to these groups'));

		Spot.create({
			user: userId,
			message: message,
			location: location,
			groups: groupIds
		}, next);
	});
}

exports.fetchActiveSpots = function(userId, location, distance, next) {

	Relationship.distinct('group', { to: userId }, function(err, groupIds){
		if (err) return next(err);
		if (!groupIds || !groupIds.length) return next(null, []); 

		var query = { active: true, groups: { $in: groupIds }};

		if (location) {
			query.location = {
				$near: location,
				$maxDistance: (distance / 69) // divide by 69 because 1 degree is about 69 miles
			};
		}

		Spot
			.find(query)
			.select('+user')
			.populate('user')
			.exec(next);
	});
}

exports.commentsForSpot = function(spotId, next) {
	
	Comment
		.find({ spot: spotId })
		.select('+user')
		.populate('user')
		.sort('created')
		.exec(next);
}

exports.commentOnSpot = function(userId, spotId, message, next) {

	Comment.create({
		spot: spotId,
		user: userId,
		message: message
	}, function(err, doc){
		if (err) return next(err);
		next(null, doc);
	});
}

exports.leaveSpot = function(spotId, userId, next) {
	
	var query = { _id: spotId, user: userId };
	var update = { active: false };
	
	Spot.spot().findOneAndUpdate(query, update, function(err, doc){
		if (err) return next(err);
		if (!doc) return next(Error.NotFound('Could not find your spot with id: ' + spotId));
		next(null, doc);
	});
}












