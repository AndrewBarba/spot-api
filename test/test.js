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
		_.times(5, function(i){
			users.push({
				phone: i + spot.utils.randomNumberString(10)
			});
		});
		spot.models.user.create(users, function(err){
			should.not.exist(err);
			spot.test.users = _.values(arguments).slice(1);
			done();
		});
	});

	it('should populate auth tokens', function(done){
		var auths = _.map(spot.test.users, function(user){
			return { user: user.id };
		});
		spot.models.auth.create(auths, function(err){
			should.not.exist(err);
			var docs = _.values(arguments).slice(1);
			spot.test.auths = _.indexBy(docs, 'user');
			done();
		});
	});

	it('should run tests', function(done){
		require('./controllers');
		require('./jobs');
		done();
	});
});