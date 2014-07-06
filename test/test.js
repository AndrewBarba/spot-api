process.env.NODE_ENV = 'local';

var should = require('should')
  , mongoose = require('mongoose');

describe('Spot', function(){
	it('should load the app', function(done){
		require('../app').server(function(app){

			should.exist(app);

			// clear database
			mongoose.connection.db.dropDatabase(function(){
				
				// load tests
				require('./controllers');
				require('./jobs');

				done();
			});
		});
	});
});