
'use strict';

const t = require('../support/globals-mocha');
const proxyquire = require('proxyquire');
const expressStub = require('../stubs/express-stub');
const httpsStub = require('../stubs/https-stub');
const loggerStub = require('../stubs/logger-stub');

describe('framework unit test', () => {

  let plugin,
      sandbox;

  beforeEach(() => {
    plugin = proxyquire('../../src/index', {
      'express': expressStub,
      'https': httpsStub
    });
    sandbox = t.sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('named appropriately', () => {
    t.expect(Object.keys(plugin)).to.eql(['framework:expressServer']);
  });

  it('contains framework function', () => {
    t.expect(plugin['framework:expressServer'][0]).to.equal('factory');
    t.expect(plugin['framework:expressServer'][1]).to.be.a('function');
  });

  it('executes each extension', () => {
    let frameworkFn = plugin['framework:expressServer'][1];
    let stub1 = t.sinon.stub();
    let stub2 = t.sinon.stub();
    frameworkFn([], {
      expressServer: {
        extensions: [stub1, stub2]
      }
    }, loggerStub);
    t.expect(stub1).to.be.calledWith(expressStub(), loggerStub);
    t.expect(stub2).to.be.calledWith(expressStub(), loggerStub);
  });

  it('creates https server', () => {
    let stub = sandbox.stub(httpsStub, 'createServer').returns({
      listen: () => {
      }
    });
    let frameworkFn = plugin['framework:expressServer'][1];
    frameworkFn([], {}, loggerStub);
    t.expect(stub).to.be.calledWith(t.sinon.match.object, expressStub());
  });

});
