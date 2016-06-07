
'use strict';

const express = require('express');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') {
  require('longjohn');
}

/**
 * @namespace karmaExpressServer
 */

module.exports = {
  'framework:expressServer': ['factory',

    /**
     * @function framework
     * @memberOf karmaExpressServer
     * @description
     * Creates an express server and passes `app` and `logger` to karma
     * configuration for further extension.
     * @param {Array} [args=[]] args not currently used
     * @param {karmaExpressServer.Config} config
     * @param {Karma.Plugin.Logger} logger [Official Docs]{@link http://karma-runner.github.io/0.13/dev/plugins.html}
     */
    function framework(args, config, logger, helper) {
      // default config
      config = config || {};
      config = config.expressServer || {};
      let configDefaults = {
        callback: () => {},
        accessControlAllowOrigin: 'http://localhost:9876',
        accessControlAllowCredentials: 'true',
        accessControlAllowMethods: 'GET, PUT, POST, DELETE, OPTIONS',
        accessControlMaxAge: '3600',
        accessControlAllowHeaders: 'x-requested-with, Content-Type, ' +
          'Content-Length, Content-Range, Content-Encoding',
        protocol: 'http',
        httpsServerOptions: null,
        serverPort: 9877,
        extensions: []
      };
      let conf = {};
      Object.assign(conf, configDefaults, config);

      // input validation
      if (
        conf.protocol === 'https' && (
          conf.httpsServerOptions === null ||
          conf.httpsServerOptions === undefined
        )
      ) {
        throw new Error('Illegal argument: `httpsServerOptions` cannot be null or undefined.');
      }

      // construct express server
      let log = logger.create('karma-express-server');
      log.info('Starting express server...');
      let app = express();
      app.use(bodyParser.json());
      app.use(function(req, res, next) {
        res.set('Access-Control-Allow-Credentials',
            conf.accessControlAllowCredentials.toString());
        res.set('Access-Control-Allow-Methods',
            conf.accessControlAllowMethods);
        res.set('Access-Control-Max-Age', conf.accessControlMaxAge);
        res.set('Access-Control-Allow-Headers', conf.accessControlAllowHeaders);
        res.set('Access-Control-Allow-Origin', conf.accessControlAllowOrigin);
        next();
      });

      // extend express application
      conf.extensions.forEach(function(extension) {
        extension(app, logger);
      });

      // start express server
      if (conf.protocol === 'https') {
        var httpServer = https
        .createServer(conf.httpsServerOptions, app)
        .listen(conf.serverPort, () => {
          log.info('Listening on port %d...', conf.serverPort);
          conf.callback(httpServer);
        });
      } else {
        var httpServer = http
        .createServer(app)
        .listen(conf.serverPort, () => {
          log.info('Listening on port %d...', conf.serverPort);
          conf.callback(httpServer);
        });
      }

    }
  ]
};

/**
 * @typedef Extension
 * @memberOf karmaExpressServer
 * @description
 * Provides a hook into express server api's for extension.
 * @property {Express.Application} app [Official Docs]{@link http://expressjs.com/en/4x/api.html#express}
 * @property {Karma.Plugin.Logger} logger [Official Docs]{@link http://karma-runner.github.io/0.13/dev/plugins.html}
 */

/**
 * @typedef Config
 * @memberOf karmaExpressServer
 * @description
 * Configuration options for karmaExpressServer framework.
 * @property {karmaExpressServer.callback} callback
 * @property {string} [accessControlAllowOrigin='http://localhost:9876']
 * @property {string} [accessControlAllowCredentials='true']
 * @property {string} [accessControlAllowMethods='GET, PUT, POST, DELETE, OPTIONS']
 * @property {string} [accessControlMaxAge='3600']
 * @property {string} [accessControlAllowHeaders='x-requested-with, Content-Type, Content-Length, Content-Range, Content-Encoding']
 * @property {string} [protocol='http']
 * @property {https.createServer.options} [httpsServerOptions] [Official Docs]{@link https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener}
 * @property {number} [serverPort=9877]
 * @property {Array<karmaExpressServer.Extension>} [extensions=[]]
 */

/**
 * @callback callback
 * @memberOf karmaExpressServer
 * @description
 * Called when server is ready to serve traffic.
 * @param {http.Server} httpServer [Official Docs]{@link https://nodejs.org/api/http.html#http_class_http_server}
 */
