
var _ = require('underscore');

var prod = {
    env: {
        PROD: true,
        DEV: false,
        TEST: false
    },
    db: process.env.DB,
    apns: {
      gateway: 'gateway.push.apple.com',
      cert: 'certificates/apple/prod/cert.pem',
      key: 'certificates/apple/prod/key.pem',
    },
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
        TEST: false
    },
    db: 'mongodb://api:ma8Mq4TkZvRUPs5G@kahana.mongohq.com:10065/spot-dev',
    apns: {
      gateway: 'gateway.push.apple.com',
      cert: 'certificates/apple/dev/cert.pem',
      key: 'certificates/apple/dev/key.pem',
    },
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
        TEST: true
    },
    db: 'mongodb://' + (process.env.WERCKER_MONGODB_HOST || 'localhost') + '/spot-local',
});

var config = {
    'production': prod,
    'development': dev,
    'test': local
}

var env = process.env.NODE_ENV || 'development';
module.exports = config[env];