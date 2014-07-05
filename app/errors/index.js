
// SEND ERRORS

exports.send = function(res, error) {
    var statusCode = error.statusCode || 500;
    var message = error.message || 'Server error';
    res.json(statusCode, {
        status: statusCode,
        error: message
    });
}

// CREATE ERRORS

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

// Constructor

function error(statusCode, message) {
    var error = new Error(message || 'Server error');
    error.statusCode = statusCode;
    return error;
}