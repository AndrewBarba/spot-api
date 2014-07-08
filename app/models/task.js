
var mongoose = require('mongoose')
  , _ = require('underscore')
  , utils = spot.utils
  , model = require('./_base');

var TASKS = {
	USER: {
		CREATE: 'user.create'
	}
};

TASK_STATES = {
	PENDING   : 0,
	OPERATING : 1,
	COMPLETE  : 2,
	FAILED    : 3
};

var TaskSchema = model.extendCapped(4194304, { // 4 megabytes
	name: { type: String, required: true, trim: true },
	state: { type: Number, default: TASK_STATES.PENDING },
	data: Object
});

_.extend(TaskSchema.statics, {

	TASKS: TASKS,

	stream: function(onData) {

		var stream = Task
		             	.find({ created: { $gte: Date.now() }})
		             	.tailable()
		             	.stream();

		if (onData) {
		 	stream.on('data', function (doc) {
		    	onData(null, doc);   
		 	}).on('error', function (err) {
		    	onData(err);
		 	});
		}

		return stream;
	}
});

var Task = mongoose.model('Task', TaskSchema);
module.exports = Task;