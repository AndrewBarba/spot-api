
var request = require('supertest')
  , server = request(spot.app);

 describe('Root', function(){
 	
 	describe('/', function(){
 		it('should return a 200 OK', function(done){
 			server
 				.get('/')
 				.expect(200, done);
 		});
 	});

 	describe('/status', function(){
 		it('should return a 200 OK', function(done){
 			server
 				.get('/status')
 				.expect(200, done);
 		});
 	});

 	describe('/fake', function(){
 		it('should return a 404 Not found', function(done){
 			server
 				.get('/fake')
 				.expect(404, done);
 		});
 	});
 });