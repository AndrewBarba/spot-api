var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , utils = spot.utils;

var BASE_SCHEME = {
    _id      : { type: String, default: utils.objectId, index: { unique: true }},
    created  : { type: Date, default: Date.now, set: setDate, get: getDate, index: true },
    modified : { type: Date, default: Date.now, set: setDate, get: getDate } 
}

var HIDE = [ '__v', '__t', '_id' ];

var OPTIONS = {
    virtuals: true,
    getters: true,
    transform: function(doc, ret, options) {
        var hide = HIDE.concat(doc.getHiddenKeys());
        hide.forEach(function(key){
            delete ret[key];
        });
        Object.keys(ret).forEach(function(key){
            if (ret[key] === undefined) {
                delete ret[key];
            }
        });
    }
}

/* =========================================================================
 *   
 *   Schema
 *   
 * ========================================================================= */

function getSchema(data, options) {
    
    var scheme = _.extend({}, BASE_SCHEME, data);
    var schema = new Schema(scheme, defaultOptions(options));

    schema.pre('save', function(next){
        if (this.isModified()) {
            this.modified = Date.now();
        }
        next();
    });

    // STATICS
    schema.statics.spot = function() {
        var self = this;
        
        return {
            findByIdAndUpdate: function(id, update, callback) {
                update.modified = new Date();
                return self.findByIdAndUpdate(id, update, callback);
            },

            findOneAndUpdate: function(query, update, callback) {
                update.modified = new Date();
                return self.findOneAndUpdate(query, update, callback);
            }
        }
    }

    // METHODS
    schema.methods.getHiddenKeys = function() {
        return []; // override
    }

    return schema;
}

exports.extend = function(data, options) {
    return getSchema(data, options);
}

exports.extendCapped = function(size, data, options) {
    return getSchema(data, _.extend({capped:size}, options));
}

/* =========================================================================
 *   
 *   Private functions
 *   
 * ========================================================================= */

function defaultOptions(options) {
    return _.extend({
        toJSON: OPTIONS,
        toObject: OPTIONS
    }, options);
}

function getDate(date) {
    if (typeof date === 'number') return date;
    return date ? date.getTime() : null;
}

function setDate(date) {
    var saveDate = date;
    if (typeof date !== 'object') saveDate = new Date(date);
    return saveDate;
}
