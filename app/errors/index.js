
function error(statusCode, message) {
    var error = new Error(message || 'Server error');
    error.statusCode = statusCode;
    return error;
}

exports.send = function(res, error) {
    res.json({
        statusCode: error.statusCode || 500,
        error: error.message
    });
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