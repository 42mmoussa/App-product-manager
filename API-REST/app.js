// imports
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const apiRouter = require("./apiRouter").router;
const cors = require('cors');

// Instantiate server
const app = express();
const server = require('http').createServer(app);

// middleware

app.use(cors());

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Initialisation session

const TWO_DAYS    = 1000 * 60 * 60 * 48;

const {
  PORT = 8888,
  NODE_ENV = 'development',

  SESS_SECRET = '*.*.LES BONS PARTISANS.*.*',
  SESS_NAME = 'sid',
  SESS_LIFETIME = TWO_DAYS
} = process.env

const IN_PROD = NODE_ENV === 'production';

// Use session

app.use(session(
    {
        name: SESS_NAME,
        resave: false,
        saveUninitialized: false,
        secret: SESS_SECRET,
        cookie: {
            maxAge: SESS_LIFETIME,
            sameSite: true,
            secure: IN_PROD
        }
    })
);

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

// config routes

app.use("/api/", apiRouter);

// start socket

require('./routes/socket')(server);

// start server

server.listen(PORT, function () {
    console.log('ready on port 8888');
});