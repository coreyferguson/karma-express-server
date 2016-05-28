
'use strict';

const t = require('../support/globals-mocha'),
      plugin = require('../../src/index');

const loggerStub = require('../stubs/logger-stub');

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

  let heartBeatExtension;
  let keys;

  before(() => {
    heartBeatExtension = (app, logger) => {
      app.get('/heartbeat', (req, res) => {
        res.sendStatus(200);
      });
    };
  });

  //////////
  // util //
  //////////

  function startWithExtensions({protocol, extensions, httpsServerOptions}) {
    return new Promise((resolve, reject) => {
      let args = {};
      let config = {
        expressServer: {
          callback: (server) => {
            resolve(server);
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
   * GET request to heartbeat endpoint
   * @param {string} protocol 'http' || 'https'
   * @param {Object} [server] http(s) server to be closed after GET request.
   * @returns {Promise}
   */
  function getHeartbeat(protocol, server) {
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
        } else if (server !== null) {
          server.close(() => {
            resolve(res);
          });
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
    return startWithExtensions({
      extensions: [heartBeatExtension]
    }).then(server => {
      return getHeartbeat('http', server);
    })
  });

  it('GET http extension', () => {
    return startWithExtensions({
      protocol: 'http',
      extensions: [heartBeatExtension]
    }).then(server => {
      return getHeartbeat('http', server);
    })
  });

  it('GET https extension', () => {
    return startWithExtensions({
      protocol: 'https',
      httpsServerOptions: {
        key: key,
        cert: cert
      },
      extensions: [heartBeatExtension]
    }).then((server) => {
      return getHeartbeat('https', server).then(res => {
        return t.expect(res.statusCode).to.equal(200);
      });
    });
  });

});
