
var utils = spot.utils
  , Task = spot.models.task;

exports.postTask = function(name, data, next) {
	return Task.create({
		name: name,
		data: data || {}
	}, next);
}

exports.completeTask = function(complete, task, next) {
	task.state = complete ? Task.STATES.COMPLETE : Task.STATES.FAILED;
	task.save(next);
}