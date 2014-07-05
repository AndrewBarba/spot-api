
var _ = require('underscore');

var prod = {
    env: {
        PROD: true,
        DEV: false,
        LOCAL: false
    },
    db: process.env.DB,
    twilio: {
        sid: 'AC444de0a850e8d0e457e3f8ae5b9e332b',
        token: '1dc58f02c00de870bbfd553826c7bf56',
        number: '+18183224563'
    }
}

var dev = {
    env: {
        PROD: false,
        DEV: true,
        LOCAL: false
    },
    db: 'mongodb://localhost/spot-local',
    twilio: {
        sid: 'AC444de0a850e8d0e457e3f8ae5b9e332b',
        token: '1dc58f02c00de870bbfd553826c7bf56',
        number: '+18183224563'
    }
}

var local = _.extend({}, dev, {
    env: {
        PROD: false,
        DEV: false,
        LOCAL: true
    },
    db: 'mongodb://localhost/spot-local',
});

var config = {
    'production': prod,
    'development': dev,
    'local': local
}

var env = process.env.NODE_ENV || 'development';
module.exports = config[env];