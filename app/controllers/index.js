
var utils = spot.utils
  , config = spot.config;

module.exports = function(app) {

	var controllers = utils.loadFiles(__dirname, app);
	return controllers;
}