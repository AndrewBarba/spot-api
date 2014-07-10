
var utils = spot.utils
  , Task = spot.models.task;

exports.postTask = function(name, data, next) {
	return Task.create({
		name: name,
		data: data ? data.toJSON() : {}
	}, next);
}

exports.completeTask = function(err, task, next) {
	task.state = err ? Task.STATES.FAILED : Task.STATES.COMPLETE;
	task.error = err ? err.toString() : null;
	task.save(next);
}