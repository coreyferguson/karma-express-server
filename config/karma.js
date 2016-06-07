
'use strict';

module.exports = function(config) {
  config.set({

    basePath: '..',

    //////////////////////
    // karma extensions //
    //////////////////////

    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      require('../src/index')
    ],

    // order is important for frameworks
    frameworks: [
      'mocha',
      'chai',
      'expressServer'
    ],
    files: [
      'test/karma/**/*.js'
    ],
    exclude: [],

    ///////////////////
    // preprocessors //
    ///////////////////

    preprocessors: {
      'test/karma/**/*.js': ['webpack', 'sourcemap'],
      'test/support/**/*.js': ['webpack', 'sourcemap']
    },

    /////////////
    // webpack //
    /////////////

    webpack: require('./webpack'),

    //////////////////////////
    // server configuration //
    //////////////////////////

    hostname: 'localhost',
    protocol: 'http',
    port: 9876,
    expressServer: {
      port: 9877,
      extensions: [
        require('../test/support/heartbeat-extension')
      ]
    },

    //////////
    // misc //
    //////////

    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: true,
    concurrency: Infinity,
    webpackMiddleware: { noInfo: true },

    ///////////////
    // launchers //
    ///////////////

    browsers: ['Chrome']

  });
};
