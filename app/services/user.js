
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Auth = spot.models.auth
  , Contact = spot.models.contact
  , Task = spot.models.task
  , async = require('async');

var USER_HEADER_KEY = 'spot-user';

exports.userHeaderKey = function() {
	return USER_HEADER_KEY;
};

exports.userForAuth = function(token, next) {
	Auth
		.findOne({ token: token, valid: true })
		.select('user')
		.exec(function(err, doc){
			if (err) return next(err);
			if (!doc) return next(Error.UnAuthorized());
			
			User
				.findById(doc.user) 
				.select('+phone')
				.exec(function(err, user){
					if (err) return next(err);
					if (!doc) return next(Error.BadRequest('Could not find user with _id: '+doc.user));
					next(null, user);
				});
		});
};

exports.userForPhone = function(phone, next) {
	phone = utils.setPhone(phone);
	if (!phone) {
		return next(Error.BadRequest('Invalid phone number'));
	}
	
	User
		.findOne({ phone: phone })
		.select('+phone')
		.select('+verificationCode')
		.exec(function(err, doc){
			if (err) return next(err);
			if (doc) return next(null, doc);
			User.create({
				phone: phone
			}, function(err, user){
				if (err) return next(err);
				next(null, user);

				TaskService = spot.services.task;
				TaskService.postTask(Task.TASKS.USER.CREATE, user);
			});
		});
};

exports.verifyUserByPhone = function(phone, code, next) {
	User.findOne({ phone: phone, verificationCode: code }, function(err, user){
		if (err) return next(err);
		if (!user) return next(Error.BadRequest('Invalid verification code'));
		user.verificationCode = null;
		user.save(next);
	});
}

exports.usersWithPhones = function(phones, next) {
	User
		.find({ phone: { $in: phones }})
		.exec(next);
};

exports.userId = function(res) {
	return res.get(USER_HEADER_KEY);
};

exports.storeContactsForUser = function(userId, contacts, next) {
	next = next || utils.noop;

	var count = 0;

	async.each(contacts, function(contact, done){

		var nickname = contact.nickname;
		var phone = utils.setPhone(contact.phone);

		var query = { user: userId, phone: phone };
		var update = { user: userId, phone: phone, nickname: nickname };
		var options = { upsert: true, select: '_id' };

		Contact.findOneAndUpdate(query, update, options, function(err){
			if (err) return done(err);
			count++;
			done();
		});	

	}, function(err){
		if (err) return next(err);
		next(null, count);
	});
}

















