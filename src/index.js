
'use strict';

const express = require('express');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') {
  require('longjohn');
}

/**
 * Creates an express server and passes `app` and `logger` to karma
 * configuration for further extension.
 */
module.exports = {
  'framework:expressServer': ['factory',
    function(args, configOverrides, logger) {
      // default config
      configOverrides = configOverrides || {};
      configOverrides = configOverrides.expressServer || {};
      let configDefaults = {
        callback: () => {},
        accessControlAllowOrigin: 'http://localhost:9876',
        accessControlAllowCredentials: 'true',
        accessControlAllowMethods: 'GET, PUT, POST, DELETE, OPTIONS',
        accessControlMaxAge: '3600',
        accessControlAllowHeaders: 'x-requested-with, Content-Type, ' +
          'Content-Length, Content-Range, Content-Encoding',
        https: false,
        httpsServerOptions: {},
        serverPort: 9877,
        extensions: []
      };
      let config = {};
      Object.assign(config, configDefaults, configOverrides);

      // construct express server
      let log = logger.create('karma-express-server');
      log.info('Starting express server...');
      let app = express();
      app.use(bodyParser.json());
      app.use(function(req, res, next) {
        res.set('Access-Control-Allow-Credentials',
            config.accessControlAllowCredentials.toString());
        res.set('Access-Control-Allow-Methods',
            config.accessControlAllowMethods);
        res.set('Access-Control-Max-Age', config.accessControlMaxAge);
        res.set('Access-Control-Allow-Headers', config.accessControlAllowHeaders);
        res.set('Access-Control-Allow-Origin', config.accessControlAllowOrigin);
        next();
      });

      // extend express application
      config.extensions.forEach(function(extension) {
        extension(app, logger);
      });

      // start express server
      if (config.https) {
        var server = https
        .createServer(config.httpsServerOptions, app)
        .listen(config.serverPort, () => {
          log.info('Listening on port %d...', config.serverPort);
          config.callback(server);
        });
      } else {
        var server = http
        .createServer(app)
        .listen(config.serverPort, () => {
          log.info('Listening on port %d...', config.serverPort);
          config.callback(server);
        });
      }

    }
  ]
};
