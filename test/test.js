process.env.NODE_ENV = 'test';

var USERS = 10;
var GROUPS = 5

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
		_.times(USERS, function(i){
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

	it('should populate groups', function(done){
		spot.test.groups = {};
		async.each(spot.test.users, function(user, next){
			var groups = [];
			_.times(GROUPS, function(i){
				groups.push({
					user: user.id,
					name: spot.utils.randomHex(10),
					priority: spot.utils.randomNumber(10)
				});
			});
			spot.models.group.create(groups, function(err){
				should.not.exist(err);
				var docs = _.values(arguments).slice(1);
				spot.test.groups[user.id] = docs;
				next();
			});
		}, done);
	});

	it('should populate relationships', function(done){
		spot.test.relationships = {};
		async.each(spot.test.users, function(user, next){
			var rels = [];
			_.each(spot.test.users, function(u){
				if (u.id != user.id) {
					rels.push({
						from: user.id,
						to: u.id,
						group: spot.test.groups[user.id][0],
						nickname: spot.utils.randomHex(10)
					});
				}
			});
			spot.models.relationship.create(rels, function(err){
				should.not.exist(err);
				var docs = _.values(arguments).slice(1);
				spot.test.relationships[user.id] = docs;
				next();
			});
		}, done);
	});

	it('should run tests', function(done){
		require('./controllers');
		require('./jobs');
		done();
	});
});
























