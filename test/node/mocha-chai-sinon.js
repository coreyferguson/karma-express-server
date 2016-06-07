
'use strict';

const test = require('../support/globals-mocha');

describe('mocha/chai/sinon integration test', () => {

  it('`expect` defined', () => {
    test.expect(test.expect).to.be.defined;
  });

  it('`assert` defined', () => {
    test.expect(test.assert).to.be.defined;
  });

  it('`sinon` defined', () => {
    test.expect(test.sinon).to.be.defined;
  });

});
