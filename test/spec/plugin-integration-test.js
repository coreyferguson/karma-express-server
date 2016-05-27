
'use strict';

const t = require('../support/globals-mocha');
const plugin = require('../../src/index');
const loggerStub = require('../stubs/logger-stub');
const request = require('request');

const fs = require('fs');
const path = require('path');
const cert = fs.readFileSync(path.join(__dirname, '../support/my-server.crt.pem'));
const key = fs.readFileSync(path.join(__dirname, '../support/my-server.key.pem'));
const ca = fs.readFileSync(path.join(__dirname, '../support/my-root-ca.crt.pem'));
// const ca = fs.readFileSync(path.join(__dirname, '../support/my-private-root-ca.crt.pem'));
// const key = path.join(__dirname, '../support/key.pem');
// const certificate = path.join(__dirname, '../support/certificate.pem');
// const certrequest = path.join(__dirname, '../support/certrequest.csr');

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

  function startWithExtensions({https, extensions, httpsServerOptions}) {
    return new Promise((resolve, reject) => {
      let args = {};
      let config = {
        expressServer: {
          callback: (server) => {
            resolve(server);
          },
          extensions,
          https,
          httpsServerOptions
        }
      };
      startServer(args, config, loggerStub);
    });
  }

  /**
   * GET request to heartbeat endpoint
   * @param {boolean} httpsEnabled indicates if https protocol should be used.
   * @param {Object} [server] http server to be closed after GET request.
   * @returns {Promise}
   */
  function getHeartbeat(httpsEnabled, server) {
    return new Promise((resolve, reject) => {
      let options = {};
      if (httpsEnabled) {
        options.uri = 'https://local.ldsconnect.org:9877/heartbeat';
        options.cert = cert;
        options.key = key;
        options.ca = ca;
      } else {
        options.uri = 'http://local.ldsconnect.org:9877/heartbeat'
      }
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

  it('GET http extension', () => {
    return startWithExtensions({
      extensions: [heartBeatExtension]
    }).then(server => {
      return getHeartbeat(false, server);
    })
  });

  it('GET https extension', () => {
    return startWithExtensions({
      https: true,
      httpsServerOptions: {
        key: key,
        cert: cert
      },
      extensions: [heartBeatExtension]
    }).then((server) => {
      return getHeartbeat(true, server).then(res => {
        return t.expect(res.statusCode).to.equal(200);
      });
    });
  });

});
