
function error(statusCode, message) {
    var error = new Error(message || 'Server error');
    error.statusCode = statusCode;
    return error;
}

exports.send = function(res, error) {
    var statusCode = error.statusCode || 500;
    res.json(statusCode, {
        statusCode: statusCode,
        error: error.message
    });
}

exports.ServerError = function(message) {
    return error(500, message || 'Server error');
}

exports.BadRequest = function(message) {
    return error(400, message || 'Bad request');
}

exports.UnAuthorized = function(message) {
    return error(401, message || 'Unauthorized')
}

exports.NotFound = function(message) {
    return error(404, message || 'Not found');
}