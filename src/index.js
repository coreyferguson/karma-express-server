
var express = require("express");
var https = require("https");
var path = require("path");
var fs = require("fs");
var bodyParser = require("body-parser");

/**
 * Creates an express server and passes `app` and `logger` to karma configuration for
 * further extension.
 */
var createExpressServer = function(args, config, logger, helper) {
    var log = logger.create("karma-express");
    var expressServerConfig = config.expressServer;
    // construct express server
    log.info("Starting express server...");
    var app = express();
    app.use(bodyParser.json());
    // enable CORS from karma browser to express server
    app.use(function(req, res, next) {
        res.set("Access-Control-Allow-Credentials", "true");
        res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        res.set("Access-Control-Max-Age", "3600");
        res.set("Access-Control-Allow-Headers", "x-requested-with, Content-Type, Content-Length, Content-Range, Content-Encoding");
        res.set("Access-Control-Allow-Origin", expressServerConfig.corsAllowOrigin);
        next();
    });
    // extend express application
    expressServerConfig.extensions.forEach(function(extension) {
        extension(app, logger);
    });
    // start express server
    var options = expressServerConfig.httpsServerOptions;
    var httpsServer = https.createServer(options, app)
            .listen(expressServerConfig.port, function() {
        log.info("Listening on port %d...", expressServerConfig.port);
    });
};

module.exports = { "framework:expressServer": ["factory", createExpressServer] };
