
var request = require('supertest')
  , should = require('should');

var group1 = {
	name: 'Friends',
	priority: 100
}

 describe('Group', function(){
 	
 	describe('/group create', function(){
 		it('should create a group', function(done){
 			
 			var user = spot.test.users[0];
 			var auth = spot.test.auths[user.id].token;

 			var body = {
 				name: group1.name,
 				priority: group1.priority
 			};

 			spot.test.server()
 				.post('/group')
 				.query({ auth: auth })
 				.send(body)
 				.expect(200)
 				.end(function(err, res){
 					should.not.exist(err);
 					should.exist(res);
 					res.body.name.should.equal(body.name);
 					res.body.priority.should.equal(body.priority);
 					group1 = res.body;
 					done();
 				});
 		});
 	});

 	describe('/group update', function(){
 		it('should not update a group', function(done){
 			var user = spot.test.users[1];
 			var auth = spot.test.auths[user.id].token;
 			
 			spot.test.server()
 				.put('/group/' + group1.id)
 				.query({ auth: auth })
 				.send({ name: 'xxx' })
 				.expect(404, done);
 		});

 		it('should update a group', function(done){ 			
 			var user = spot.test.users[0];
 			var auth = spot.test.auths[user.id].token;
 			
 			var body = { 
 				name: 'xxx', 
 				priority: 999, 
 				user: 'xxx' 
 			};

 			spot.test.server()
 				.put('/group/' + group1.id)
 				.query({ auth: auth })
 				.send(body)
 				.expect(200)
 				.end(function(err, res){
 					should.not.exist(err);
 					should.exist(res);
 					res.body.name.should.equal(body.name);
 					res.body.priority.should.equal(body.priority);
 					done();
 				});
 		});
 	});

 	describe('/group read', function(){
 		var user = spot.test.users[0];
 		var auth = spot.test.auths[user.id].token;

 		it('should find my groups', function(done){
 			spot.test.server()
 				.get('/group')
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











