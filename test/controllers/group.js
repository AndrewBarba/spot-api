
var request = require('supertest')
  , server = request(spot.app);

 describe('Group', function(){
 	
 	describe('/group', function(){
 		it('should create a group', function(done){
 			server
 				.get('/')
 				.expect(200, done);
 		});
 	});

 });