
var request = require('supertest')
  , should = require('should')
  , server = request(spot.app)
  , utils = spot.utils
  , _ = require('underscore')
  , async = require('async');

describe('Relationship', function(){

	describe('/relationship create', function(){
		var userId = spot.test.users[0].id;
		var auth = spot.test.auths[userId].token;

		var groupId = spot.test.groups[userId][0].id; 
		var users = _.map(spot.test.users, function(user){
			return {
				user: user.id,
				nickname: utils.randomHex(10)
			};
		});
		var body = {
			group: groupId,
			users: users
		};

		it('should create new relationships', function(done){
			server
				.post('/relationship')
				.query({ auth: auth })
				.send(body)
				.expect(200)
				.end(function(err, res){
					should.not.exist(err);
					should.exist(res);
					res.body.length.should.not.equal(0);
					done();
				});
		});

		it('should not create any new relationships', function(done){
			server
				.post('/relationship')
				.query({ auth: auth })
				.send(body)
				.expect(200)
				.end(function(err, res){
					should.not.exist(err);
					should.exist(res);
					res.body.length.should.equal(0);
					done();
				});
		});
	});
});