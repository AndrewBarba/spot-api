
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Relationship = spot.models.relationship
  , Group = spot.models.group
  , Spot = spot.models.spot
  , Task = spot.models.task
  , Comment = spot.models.comment
  , _ = require('underscore');

exports.createSpot = function(userId, message, location, groupIds, next) {
	Group.count({ user: userId, _id: { $in: groupIds }}, function(err, count){
		if (err) return next(err);
		if (count != groupIds.length) return next(Error.BadRequest('You cannot post to these groups'));
		
		Spot.create({
			user: userId,
			message: message,
			location: location,
			groups: groupIds
		}, function(err, doc){
			if (err) return next(err);
			next(null, doc);

			TaskService = spot.services.task;
			TaskService.postTask(Task.TASKS.SPOT.CREATE, doc);
		});
	});
}

exports.fetchActiveSpots = function(userId, location, distance, next) {

	Relationship.distinct('to', { from: userId }, function(err, userIds){
		if (err) return next(err);
		if (!userIds || !userIds.length) return next(null, []);

		var query = { to: userId, blocked: { $ne: true }, from: { $in: userIds }};

		Relationship.distinct('group', query, function(err, groupIds){
			if (err) return next(err);
			if (!groupIds || !groupIds.length) return next(null, []); 

			var query = { 
				active: true, 
				user: { $ne: userId }, 
				groups: { $in: groupIds }
			};

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

		TaskService = spot.services.task;
		TaskService.postTask(Task.TASKS.SPOT.COMMENT, doc);
	});
}

exports.leaveSpot = function(spotId, userId, next) {
	
	var query = { _id: spotId, user: userId };
	var update = { active: false };
	
	Spot.spot().findOneAndUpdate(query, update, function(err, doc){
		if (err) return next(err);
		if (!doc) return next(Error.NotFound('Could not find your spot with id: ' + spotId));
		next(null, doc);

		TaskService = spot.services.task;
		TaskService.postTask(Task.TASKS.SPOT.LEAVE, doc);
	});
}












