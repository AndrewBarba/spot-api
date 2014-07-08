
var utils = spot.utils
  , Task = spot.models.task
  , User = spot.models.user;

function stream() {
	Task.stream(function(err, task){
		if (err) {
			spot.err(err);
			return start(stream);
		}
		process(task);
	});
}

function process(task, next) {
	next = next || utils.noop;

	if (task.state != Task.STATES.PENDING) {
		return next();
	}

	var query = { _id: task.id, state: Task.STATES.PENDING };
	var update = { state: Task.STATES.OPERATING };

	Task.findOneAndUpdate(query, update, function(err, doc){
		if (doc) {
			doc.state = Task.STATES.COMPLETE;
			doc.save(next);
		} else {
			next();
		}
	});
}

function start(next) {
	var query = Task.find({ state: Task.STATES.PENDING }).sort('created');
	utils.asyncStream(query, process, next);
}

module.exports = function(next) {
	next = next || utils.noop;

	Task.create({
		name: Task.TASKS.JOBS.START,
		state: Task.STATES.COMPLETE
	}, function(err, doc){
		if (err) throw err;
		
		start(stream);

		next();
	});
}