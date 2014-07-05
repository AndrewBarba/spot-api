
var should = require('should');

describe('Spot', function(){
	it('should load the app', function(done){
		require('../app').server(function(app){

			should.exist(app);

			// load tests
			require('./controllers');
			require('./jobs');

			done();
		});
	});
});