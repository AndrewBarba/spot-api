
var utils = spot.utils
  , Task = spot.models.task
  , tasks = Task.TASKS.SPOT
  , User = spot.models.user
  , Group = spot.models.group
  , Relationship = spot.models.relationship
  , Spot = spot.models.spot
  , PushService = spot.services.push
  , Error = spot.error;

exports.process = function(task, next) {
	
	if (task.name == tasks.CREATE) {
		return processSpotCreated(task.data, next);
	}

	next();
}

function processSpotCreated(data, next) {
	Spot
		.findOne({ _id: data._id })
		.select('+user +groups')
		.populate('user')
		.exec(function(err, spot){
			if (err) return next(err);
			if (!spot) return next(Error.NotFound('Could not find spot with id: '+data._id));

			var query = Relationship.find({ 
				from: spot.user._id, 
				group: { $in: spot.groups }
			});
			
			utils.asyncStream(
				query,
				function(relationship, done) {
					var message = messageForSpot(spot);
					PushService.sendPushForUser(relationship.to, message, {
						spot: spot._id
					}, done);
				},
				next);
		});
}

function messageForSpot(spot) {
	return spot.user.firstName + ' - ' + spot.message;
}