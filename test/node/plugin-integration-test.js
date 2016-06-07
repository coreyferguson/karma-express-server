
'use strict';

const t = require('../support/globals-mocha'),
      plugin = require('../../src/index');

const loggerStub = require('../stubs/logger-stub');
const heartBeatExtension = require('../support/heartbeat-extension');

const request = require('request'),
      fs = require('fs'),
      path = require('path'),
      cert = fs.readFileSync(path.join(__dirname, '../support/my-server.crt.pem')),
      key = fs.readFileSync(path.join(__dirname, '../support/my-server.key.pem')),
      ca = fs.readFileSync(path.join(__dirname, '../support/my-root-ca.crt.pem'));

describe('plugin integration test', () => {

  const startServer = plugin['framework:expressServer'][1];

  ////////////////////
  // initialization //
  ////////////////////

  let keys;
  let server;

  afterEach(() => {
    return closeServer();
  });

  //////////
  // util //
  //////////

  function startServerWithExtensions({
    protocol,
    extensions,
    httpsServerOptions
  }) {
    return new Promise((resolve, reject) => {
      let args = {};
      let config = {
        expressServer: {
          callback: (_server) => {
            server = _server;
            resolve();
          },
          extensions,
          protocol,
          httpsServerOptions
        }
      };
      startServer(args, config, loggerStub);
    });
  }

  /**
   * Close server if it was previously opened.
   * @returns {Promise}
   */
  function closeServer() {
    if (server === null || server === undefined) {
      return Promise.resolve();
    } else {
      return new Promise((resolve, reject) => {
        server.close(() => {
          resolve();
        });
      });
    }
  }

  /**
   * GET request to heartbeat endpoint
   * @param {string} protocol 'http' || 'https'
   * @param {Object} [server] http(s) server to be closed after GET request.
   * @returns {Promise}
   */
  function getHeartbeat(protocol) {
    return new Promise((resolve, reject) => {
      let options = {};
      if (protocol === 'https') {
        options.cert = cert;
        options.key = key;
        options.ca = ca;
      }
      options.uri = protocol + '://local.ldsconnect.org:9877/heartbeat';
      options.method = 'GET';
      request(options, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  ///////////
  // tests //
  ///////////

  it('GET default extension', () => {
    return startServerWithExtensions({
      extensions: [heartBeatExtension]
    }).then(() => {
      return getHeartbeat('http');
    });
  });

  it('GET http extension', () => {
    return startServerWithExtensions({
      protocol: 'http',
      extensions: [heartBeatExtension]
    }).then(() => {
      return getHeartbeat('http');
    });
  });

  it('GET https extension', () => {
    return startServerWithExtensions({
      protocol: 'https',
      httpsServerOptions: {
        key,
        cert
      },
      extensions: [heartBeatExtension]
    }).then(() => {
      return getHeartbeat('https').then(res => {
        return t.expect(res.statusCode).to.equal(200);
      });
    });
  });

});
