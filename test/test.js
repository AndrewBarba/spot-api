process.env.NODE_ENV = 'test';

var should = require('should')
  , mongoose = require('mongoose');

describe('Spot', function(){
	it('should load the app', function(done){
		require('../app').server(function(app){

			should.exist(app);

			// load tests
			require('./controllers');
			require('./jobs');

			done();
		}, {
			database: { dropDatabase: true }
		});
	});
});