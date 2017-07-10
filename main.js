'use strict';

const Hapi = require('hapi');
const Joi = require('Joi');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const config = require('./config/config');

// @Run Hapi.js server in debug mode
const server = new Hapi.Server();
server.connection({
    port: ~~process.env.PORT | config.PORT,
    routes: { cors: {
        credentials: true,
        origin: ["*"]
    } }
});

// @SERVER CONFIG FILE

// @UTILS
const parseUpTime = require('./helpers/parseUpTime');

// @MONGO DB CONFIGURATIONS
const dbUrl = `mongodb://${config.DBADMIN}:${config.DBPASSWORD}@ds139685.mlab.com:39685/kronendb`;
const dbOpts = {
    server: { poolSize: 5 },
    db: { native_parser: true }
};

mongoose.Promise = global.Promise;


// @ Servser port configurations
const PORT = config.PORT;
const HOST = 'localhost';
server.connection({ port: PORT, host: HOST });


// @Here you can add some hapi.js plugins in array
server.register([
    {
        register: require('hapi-geo-locate'),
        options: {
            enabledByDefault: true
        }
    },
    {
        register: require('hapi-auth-jwt')
    }
    ],  (err) => {
    if (err) {
        console.error(err);
        throw err;
    }

    // @SET Auth0 Strategy
    server.auth.strategy('jwt', 'jwt', {
        key: config.SECRET_WEB_TOKEN,
        verifyOptions: { algorithms: ['HS256'] }
    });

    glob.sync('api/**/routes/*.js', {
        root: __dirname
    }).forEach(file => {
        const route = require(path.join(__dirname, file));
        server.route(route);
    });

    server.start((err) => {
        var promise = mongoose.connect(dbUrl, {
            useMongoClient: true
            /* other options */
        });
        if (err) {
            throw err;
        }
        console.log(`Server running at`);
    });
});


server.route({
    method: 'GET',
    path: '/',
    config: {
        handler:  (request, reply) => {
            const upTime = process.uptime();
            reply({
                serverUpTime: parseUpTime.dayTimeFormat(upTime),
                serverInfo: request.location
            });
        }
    }
});

