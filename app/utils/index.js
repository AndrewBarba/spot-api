
var _ = require('underscore')
  , fs = require('fs')
  , crypto = require('crypto')
  , Error = spot.error
  , _this = module.exports;

exports.loadFiles = function(dir, param) {
    var files = {};
    fs.readdirSync(dir).forEach(function(file) {
            
        // skip index files
        if (file == 'index.js') return;

        var components = file.split('.')
        
        // skip non .js files
        if (components.pop() != 'js') return;

        // get name of file
        var name = components.join('.');

        // use the name of the file as the key name
        // replace - with _ for anming purposes
        var keyName = name.replace(/-/g,'_');
        
        // require the file and add to the module exports
        files[keyName] = (param) ? require(dir + '/' + name)(param) : require(dir + '/' + name);
    });
    return files;
}

exports.randomHex = function (x) {
    var num = Math.ceil(x/2);
    var odd = x % 2 !== 0;
    var buf = crypto.pseudoRandomBytes(num);
    var hexVal = buf.toString('hex');
    return (odd) ? hexVal.substring(1) : hexVal;
};

exports.randomNumber = function(max) {
    return Math.floor(Math.random() * max);
}

exports.randomNumberString = function(x) {
    var ans = '';
    for (var i = 0; i < x; i++) {
        ans += exports.randomNumber(10);
    }
    return ans;
};

exports.guid = function(x) {
    if (!x) x = 8;
    var s = "";
    for (var i = 0; i < x/4; i++) s += _this.randomHex(4);
    return s;
};

exports.objectId = function() {
    return _this.guid(24);
};

exports.authToken = function() {
    return _this.guid(128);
};

exports.isValidEmail = function(e) {
    return String(e).match(/^\s*[\w\-\+_]+(?:\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(?:\.[\w‌​\-\+_]+)*\s*$/);
};

exports.extractNumberString = function(text) {
    return text ? text.replace(/\D/g,'').trim() : '';
}

exports.setPhone = function(phone) {
    if (phone) {
        phone = exports.extractNumberString(phone);
        if (phone.length == 11 && phone.slice(0,1) == "1") {
            phone = phone.slice(1);
        }
    }
    return (phone && phone.length >= 10) ? phone : null;
};

exports.verifyKeys = function(keys, object, next) {
    var error = null;
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!object[key]) {
            error = Error.BadRequest('Missing key: '+ key);
            break;
        }
    }
    if (next) {
        next(error, object);
    }
    return error;
};

exports.select = function(keys, object) {
    var data = {};
    _.each(keys, function(key){
        var val = object[key];
        if (val) {
            data[key] = val;
        }
    });
    return data;
}

exports.asyncStream = function(query, onData, onComplete) {

    var ops = 0;
    var ended = false;

    var stream = query.stream();

    stream.on('data', function(doc){
        ops++;
        onData(doc, function(){
            ops--;
            if (ops == 0 && ended) {
                onComplete();
            }
        });
    });

    stream.on('end', function(){
        ended = true;
        if (ops == 0) {
            onComplete();
        }
    });
}

exports.stream = function(query, onData, onComplete) {
    exports.asyncStream(
        query, 
        function(doc, next){
            onData(doc);
            next();
        }, 
        onComplete);
}

exports.ok = function(){
    return { 
        status: 'OK' 
    };
};

exports.noop = function(){};

// load all utils in this folder
_.extend(module.exports, this.loadFiles(__dirname));