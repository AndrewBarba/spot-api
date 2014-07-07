
var request = require('supertest')
  , should = require('should')
  , server = request(spot.app)
  , utils = spot.utils
  , _ = require('underscore')
  , async = require('async');

describe('Relationship', function(){

	describe('/relationship create', function(){
		var user = spot.test.users[0];
		var auth = spot.test.auths[user.id].token;

		it('should create new relationships', function(done){
			var body = _.map(spot.test.users, function(user){
				return {
					user: user.id,
					nickname: utils.randomHex(10)
				};
			});
			done();
		});

		it('should not create any new relationships', function(done){
			done();
		});
	});
});