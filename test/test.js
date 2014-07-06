process.env.NODE_ENV = 'test';

var should = require('should')
  , mongoose = require('mongoose')
  , _ = require('underscore')
  , async = require('async');

describe('Spot', function(){
	it('should load the app', function(done){
		require('../app').server(function(app){
			should.exist(app);
			spot.test = {};
			done();
		}, {
			database: { dropDatabase: true }
		});
	});

	it('should populate users', function(done){
		var users = [];
		for (var i = 0; i < 100; i++) {
			users.push({
				phone: i + spot.utils.randomNumberString(10)
			});
		}
		spot.models.user.create(users, function(err){
			should.not.exist(err);
			spot.test.users = _.values(arguments).slice(1);
			done();
		});
	});

	it('should populate auth tokens', function(done){
		var auths = {};
		async.each(spot.test.users, function(user, next){
			spot.services.auth.authForUser(user, function(err, auth){
				should.not.exist(err);
				auths[user.id] = auth.token;
				next();
			});
		}, function(){
			spot.test.auths = auths;
			done();
		});
	});

	it('should run tests', function(done){
		require('./controllers');
		require('./jobs');
		done();
	});
});