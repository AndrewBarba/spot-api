
var request = require('supertest')
  , should = require('should')
  , utils = spot.utils
  , _ = require('underscore')
  , async = require('async');

describe('Spot', function(){

	var userId = spot.test.users[0].id;
	var auth = { auth: spot.test.auths[userId].token };

	describe('/spot create', function(){
		it('should create a spot', function(done){

			var body = {
				message: 'Hello, Spot',
				location: [ 1, 1 ],
				groups: _.pluck(spot.test.groups[userId], 'id').slice(0,3)
			};

			spot.test.server()
				.post('/spot')
				.query(auth)
				.send(body)
				.expect(200)
				.end(function(err, res){
					should.not.exist(err);
					should.exist(res);
					res.body.message.should.equal(body.message);
					done();
				});
		});
	});

	describe('/spot fetch', function(){
		it('should fetch all active spots', function(done){
			spot.test.server()
				.get('/spot')
				.query(auth)
				.expect(200, function(err, res){
					should.not.exist(err);
					should.exist(res);
					res.body.length.should.not.equal(0);
					done();
				});
		});
	});

	describe('/spot leave', function(){
		it('should leave a spot', function(done){
			var spotId = spot.test.spots[userId][0].id;

			spot.test.server()
				.delete('/spot/'+spotId)
				.query(auth)
				.expect(200)
				.end(function(err, res){
					should.not.exist(err);
					should.exist(res);
					res.body.active.should.equal(false);
					done();
				});
		});
	});

	describe('/spot/:id/comment create', function(){

		var spotId = spot.test.spots[userId][0].id;
		var comment = { comment: 'Hello, World' };

		it('should post a comment to a spot', function(done){
			spot.test.server()
				.post('/spot/'+spotId+'/comment')
				.query(auth)
				.send(comment)
				.expect(200)
				.end(function(err, res){
					should.not.exist(err);
					should.exist(res);
					res.body.message.should.equal(comment.comment);
					done();
				});

		});

		it('should fetch all comments', function(done){
			spot.test.server()
				.get('/spot/'+spotId+'/comment')
				.query(auth)
				.expect(200)
				.end(function(err, res){
					should.not.exist(err);
					should.exist(res);
					res.body[0].message.should.equal(comment.comment);
					done();
				});
		});
	});
});









