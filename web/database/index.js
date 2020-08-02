const config = require('../config');
const mongoose = require('mongoose');

const getUri = (c) => {
    if (c) return 'mongodb://' + c.host + ':' + c.port + '/' + c.name;
    return '';
};

module.exports = () => {
    let connection = null;
    getConnection = () => {
        return connection;
    };
    function connect() {
        return new Promise((resolve, reject) => {
            mongoose.Promise = global.Promise;
            mongoose.set('debug', config.isDev);
            mongoose.connect(config.dbUri, config.dbOptions);
            mongoose.connection.on('error', reject);
            mongoose.connection.on('open', () => {
                console.log('Database connected on:', getUri(mongoose.connection));
                connection = mongoose.connection;
                resolve(connection);
            });
        });
    }
    return {getConnection, connect};
};
