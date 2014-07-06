
var request = require('supertest')
  , server = request(spot.app)
  , should = require('should')
  , SMS = spot.lib.sms
  , utils = spot.utils;

var user1 = {
	firstName: 'Andrew',
	lastName: 'Barba',
	phone: '9085667524',
	auth: ''
}

 describe('User', function(){

 	describe('/user', function(){
 		it('should create a user', function(done){
 			server
 				.post('/user')
 				.send({ phone: user1.phone })
 				.expect(200)
 				.end(function(err, res){
 					should.not.exist(err);
 					should.exist(res);
 					res.body.status.should.equal('OK');
 					done();
 				});
 		});

 		it('should not verify a user', function(done){
 			server
 				.post('/user/verify')
 				.send({ phone: user1.phone, verificationCode: 'fake' })
 				.expect(400, done);
 		});

 		it('should verify a user', function(done){ 			
 			var message = SMS.getLocalTexts(user1.phone)[0];
 			var code = utils.extractNumberString(message);
 			server
 				.post('/user/verify')
 				.send({ phone: user1.phone, verificationCode: code })
 				.end(function(err, res){
 					should.not.exist(err);
 					should.exist(res);
 					should.exist(res.body.token);
 					user1.auth = res.body.token;
 					done();
 				});
 		});
 	});

 	describe('/me', function(){
 		it('should return a 400 bad request', function(done){
 			server
 				.get('/me')
 				.expect(400, done);
 		});

 		it('should return a 401 unauthorized', function(done){
 			server
 				.get('/me')
 				.query({ auth: 'fake' })
 				.expect(401, done);
 		});

 		it('should return current user', function(done){
 			server
 				.get('/me')
 				.query({ auth: user1.auth })
 				.expect(200)
 				.end(function(err, res){
 					should.not.exist(err);
 					should.exist(res);
 					should.not.exist(res.body._id);
 					res.body.id.should.be.a.String;
 					res.body.created.should.be.a.Number;
 					done();
 				});
 		});

 		it('should update the current user', function(done){
 			server
 				.put('/me')
 				.query({ auth: user1.auth })
 				.send(user1)
 				.expect(200)
 				.end(function(err, res){
 					should.not.exist(err);
 					should.exist(res);
 					should.exist(res.body.firstName);
 					res.body.firstName.should.equal(user1.firstName);
 					res.body.lastName.should.equal(user1.lastName);
 					res.body.created.should.not.equal(res.body.modified);
 					done();
 				});
 		})
 	});
 });