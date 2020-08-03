require('dotenv').config();
const config = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: process.env.HOST || 'localhost',
    isDev: process.env.NODE_ENV === 'production' ? false : true,
    dbUri: process.env.DB_URI || 'mongodb://localhost:27017/technocrats-test',
    dbOptions: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
    },
    saltRounds: 13,
    jwtExpiry: process.env.JWT_EXPIRY ? parseInt(process.env.JWT_EXPIRY) : 604800000,
    jwtSecret: process.env.JWT_SECRET || 'special_secret',
    sessionSecret: process.env.SESSION_SECRET || 'special_secret',
    sessionMaxAge: process.env.SESSION_MAXAGE ? parseInt(process.env.SESSION_MAXAGE) : 3600000,
};

module.exports = config;
