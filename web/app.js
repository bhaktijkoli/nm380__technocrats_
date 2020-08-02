const config = require('./config');
const next = require('next');
const http = require('http');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('morgan');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const {getConnection, connect} = require('./database')();
const User = require('./models/user');
const Account = require('./models/account');
const Session = require('./models/session');
const VerificationRequest = require('./models/verification-request');

const {port, isDev, sessionSecret, sessionMaxAge} = config;

const nextApp = next({dev: isDev});
const handle = nextApp.getRequestHandler();

nextApp
    .prepare()
    .then(() => {
        const app = express();
        app.use(logger('dev'));
        app.use(helmet());
        app.use(compression());
        app.use(cookieParser());

        connect()
            .then((connection) => {
                app.use(
                    session({
                        store: new MongoStore({mongooseConnection: connection}),
                        secret: sessionSecret,
                        cookie: {maxAge: sessionMaxAge},
                        resave: false,
                        saveUninitialized: true,
                    }),
                );
            })
            .catch((error) => {
                console.error('MongoDB Error: ', error);
            });

        // TODO: API routes & controllers

        app.all('*', (req, res) => handle(req, res));
        const server = http.createServer(app);

        server.listen(port, (err) => {
            if (err) throw err;
            console.log('Server running on http://localhost:' + port);
        });
    })
    .catch((ex) => {
        console.error(ex.stack);
    });
