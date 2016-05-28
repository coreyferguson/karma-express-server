
'use strict';

const t = require('../support/globals-mocha');
const proxyquire = require('proxyquire');
const expressStub = require('../stubs/express-stub');
const httpsStub = require('../stubs/https-stub');
const loggerStub = require('../stubs/logger-stub');
const fs = require('fs');
const path = require('path');
const cert = fs.readFileSync(path.join(__dirname, '../support/my-server.crt.pem'));
const key = fs.readFileSync(path.join(__dirname, '../support/my-server.key.pem'));

describe('plugin unit test', () => {

  let plugin,
      sandbox,
      startServer,
      server;

  beforeEach(() => {
    plugin = proxyquire('../../src/index', {
      'express': expressStub,
      'https': httpsStub
    });
    startServer = plugin['framework:expressServer'][1];
    sandbox = t.sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    return closeServer();
  });

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

  it('named appropriately', () => {
    t.expect(Object.keys(plugin)).to.eql(['framework:expressServer']);
  });

  it('contains framework function', () => {
    t.expect(plugin['framework:expressServer'][0]).to.equal('factory');
    t.expect(plugin['framework:expressServer'][1]).to.be.a('function');
  });

  it('executes each extension', () => {
    let stub1 = t.sinon.stub();
    let stub2 = t.sinon.stub();
    startServer([], {
      expressServer: {
        extensions: [stub1, stub2],
        callback: _server => server = _server
      }
    }, loggerStub);
    t.expect(stub1).to.be.calledWith(expressStub(), loggerStub);
    t.expect(stub2).to.be.calledWith(expressStub(), loggerStub);
  });

  it('requires httpsServerOptions', () => {
    let stub = sandbox.stub(httpsStub, 'createServer').returns({
      listen: () => {}
    });
    t.expect(() => {
      startServer([], {
        expressServer: {
          https: true,
          callback: _server => server = _server
        }
      }, loggerStub);
    }).to.throw(/httpsServerOptions/);
  });

  it('creates https server', () => {
    let stub = sandbox.stub(httpsStub, 'createServer').returns({
      listen: () => {}
    });
    startServer([], {
      expressServer: {
        https: true,
        httpsServerOptions: {
          key: key,
          cert: cert
        },
        callback: _server => server = _server
      }
    }, loggerStub);
    t.expect(stub).to.be.calledWith(t.sinon.match.object, expressStub());
  });

});
