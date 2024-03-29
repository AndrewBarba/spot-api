
var request = require('supertest')
  , should = require('should')
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
			spot.test.server()
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
			spot.test.server()
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

	describe('/relationship update', function(){
		it('should update a relationship', function(done){
			var userId = spot.test.users[0].id;
			var auth = spot.test.auths[userId].token;
			var relationship = spot.test.relationships[userId][0];

			spot.test.server()
				.put('/relationship/'+relationship.id)
				.query({ auth: auth })
				.send({ nickname: 'xxx', to: 'xxx' })
				.expect(200)
				.end(function(err, res){
					should.not.exist(err);
					should.exist(res);
					res.body.nickname.should.equal('xxx');
					res.body.to.should.not.equal('xxx');
					done();
				});
		});

		it('should not update a relationship', function(done){
			var userId = spot.test.users[0].id;
			var auth = spot.test.auths[userId].token;

			var userId2 = spot.test.users[1].id;
			var relationship = spot.test.relationships[userId2][0];

			spot.test.server()
				.put('/relationship/'+relationship.id)
				.query({ auth: auth })
				.send({ nickname: 'xxx', to: 'xxx' })
				.expect(404, done);
		});
	});

	describe('/relationship fetch', function(){
		it('should fetch all relationships', function(done){
			var userId = spot.test.users[1].id;
			var auth = spot.test.auths[userId].token;

			spot.test.server()
				.get('/relationship')
				.query({ auth: auth })
				.expect(200)
				.end(function(err, res){
					should.not.exist(err);
					should.exist(res);
					res.body.length.should.equal(spot.test.relationships[userId].length);
					done();
				});
		});

		it('should fetch relationships for a group', function(done){
			var userId = spot.test.users[0].id;
			var groupId = spot.test.groups[userId][0].id;
			var auth = spot.test.auths[userId].token;
			
			spot.test.server()
				.get('/group/'+groupId+'/relationship')
				.query({ auth: auth })
				.expect(200)
				.end(function(err, res){
					should.not.exist(err);
					should.exist(res);
					res.body.length.should.not.equal(0);
					done();
				});
		});
	});
});





















