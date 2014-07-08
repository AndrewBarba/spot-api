
var request = require('supertest')
  , should = require('should')
  , server = request(spot.app)
  , utils = spot.utils
  , _ = require('underscore')
  , async = require('async');

describe('Spot', function(){

	var userId = spot.test.users[0].id;
	var auth = spot.test.auths[userId].token;

	describe('/spot create', function(){

	});

	describe('/spot fetch', function(){
		it('should fetch all active spots', function(done){
			server
				.get('/spot')
				.query({ auth: auth })
				.expect(200, function(err, res){
					should.not.exist(err);
					should.exist(res);
					done();
				});
		});
	});

	describe('/spot leave', function(){

	});
});