
var utils = spot.utils
  , Task = spot.models.task;

exports.postTask = function(name, data, next) {
	return Task.create({
		name: name,
		data: data || {}
	}, next);
}

exports.completeTask = function(task, next) {
	task.state = Task.STATES.COMPLETE;
	task.save(next);
}