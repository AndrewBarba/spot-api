
var request = require('supertest')
  , server = request(spot.app);

 describe('User', function(){

 	describe('/me', function(){
 		it('should return a 400 bad request', function(done){
 			server
 				.get('/me')
 				.expect(400, done);
 		});

 		it('should return a 401 unauthorized', function(done){
 			server
 				.get('/me')
 				.query({ auth: '1234' })
 				.expect(401, done);
 		});
 	});
 });