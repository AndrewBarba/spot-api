
var utils = spot.utils
  , Task = spot.models.task
  , User = spot.models.user
  , TaskService = spot.services.task;


module.exports = function(next) {
	run(next);
	return spot.utils.loadFiles(__dirname);
};

/**
 * Process a single task
 */
function process(task, next) {
	next = next || utils.noop;

	if (task.state != Task.STATES.PENDING) {
		return next();
	}

	var query = { _id: task.id, state: Task.STATES.PENDING };
	var update = { state: Task.STATES.OPERATING };

	Task.findOneAndUpdate(query, update, function(err, task){
		if (task) {
			var job = task.name.split('.')[0];
			var operator = spot.jobs[job];
			if (operator) {
				operator.process(task, function(err){
					TaskService.completeTask(!err, task, next);
				});
			} else {
				TaskService.completeTask(true, task, next);
			}
		} else {
			next();
		}
	});
}

/**
 * Startup process
 */
function run(next) {
	next = next || utils.noop;

	init(function(err){
		if (err) throw err;
		
		// start stream
		stream();

		// load unprocessed tasks
		loadTasks(next);
	});
}

/**
 * Initializes the jobs server by posting a task
 */
function init(next) {
	resetTasks(function(){
		TaskService.postTask(Task.TASKS.JOBS.START, null, next);
	});
}

/**
 * Listens for new tasks
 */
function stream(next) {
	Task.stream(function(err, task){
		if (err) {
			spot.err(err);
			return setTimeout(run, 1000);
		}

		process(task);
	});
}

/**
 * Loads all pending tasks
 */
function loadTasks(next) {
	var query = Task.find({ state: Task.STATES.PENDING }).sort('created');
	utils.asyncStream(query, process, next);
}

/**
 * Attempts to reset hanging tasks
 */
function resetTasks(next) {
	next = next || utils.noop;

	var diff = 30 * 1000;
	var date = new Date(Date.now() - diff);

	var query = { state: Task.STATES.OPERATING, created: { $lte: date }};
	var update = { state: Task.STATES.PENDING };
	var options = { multi: true };

	Task.update(query, update, options,  next);

	setTimeout(resetTasks, diff);
}
