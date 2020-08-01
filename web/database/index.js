const config = require('../config');
const mongoose = require('mongoose');

const getUri = (c) => {
    if (c) return 'mongodb://' + c.host + ':' + c.port + '/' + c.name;
    return '';
};

module.exports = () => {
    return new Promise((resolve, reject) => {
        mongoose.Promise = global.Promise;
        mongoose.set('debug', config.isDev);
        mongoose.connect(config.dbUri, config.dbOptions);
        mongoose.connection.on('error', reject);
        mongoose.connection.on('open', () => {
            console.log('Database connected on:', getUri(mongoose.connection));
            resolve(mongoose.connection);
        });
    });
};
