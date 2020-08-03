const config = require('./config');
const next = require('next');
const http = require('http');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('morgan');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const {getConnection, connect} = require('./database')();
const User = require('./models/user');
// const Account = require('./models/account');
// const Session = require('./models/session');
// const VerificationRequest = require('./models/verification-request');

const {port, host, isDev, sessionSecret, sessionMaxAge} = config;

const nextApp = next({dev: isDev});
const handle = nextApp.getRequestHandler();

(async () => {
    try {
        await nextApp.prepare();
        const connection = await connect();
        const app = express();
        app.use(cors({origin: '*', methods: ['GET', 'POST', 'PUT']}));
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));
        app.use(logger('dev'));
        app.use(helmet());
        app.use(compression());
        app.use(cookieParser());
        app.use(
            session({
                store: new MongoStore({mongooseConnection: connection}),
                secret: sessionSecret,
                cookie: {maxAge: sessionMaxAge},
                resave: false,
                saveUninitialized: true,
            }),
        );
        app.use('/api/videos', require('./routes/videos')(connection));
        app.use('/api/user', require('./routes/users'));
        app.all('*', (req, res) => handle(req, res));

        const server = http.createServer(app);
        server.listen(port, host, (err) => {
            if (err) throw err;
            console.log('Server running on http://' + host + ':' + port);
        });
    } catch (ex) {
        console.error(ex.stack);
    }
})();