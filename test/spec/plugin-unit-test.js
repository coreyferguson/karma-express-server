
'use strict';

const t = require('../support/globals-mocha'),
      proxyquire = require('proxyquire');

const expressStub = require('../stubs/express-stub'),
      httpsStub = require('../stubs/https-stub'),
      loggerStub = require('../stubs/logger-stub');

const fs = require('fs'),
      path = require('path'),
      cert = fs.readFileSync(path.join(__dirname, '../support/my-server.crt.pem')),
      key = fs.readFileSync(path.join(__dirname, '../support/my-server.key.pem'));

describe('plugin unit test', () => {

  ////////////////////
  // initialization //
  ////////////////////

  let plugin,
      sandbox,
      startServer,
      server;

  before(() => {
    plugin = proxyquire('../../src/index', {
      express: expressStub,
      https: httpsStub
    });
    startServer = plugin['framework:expressServer'][1];
    sandbox = t.sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    return closeServer();
  });

  //////////
  // util //
  //////////

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

  ///////////
  // tests //
  ///////////

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
          protocol: 'https',
          callback: _server => server = _server
        }
      }, loggerStub);
    }).to.throw(/httpsServerOptions/);
  });

});
