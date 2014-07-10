
var config = require('./app/config');

exports.config = {
    app_name : [ config.newrelic.name ],
    license_key : config.newrelic.token,
    logging : {
        level : 'info'
    }
};
