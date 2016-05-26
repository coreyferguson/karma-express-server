
'use strict';

let chai = require('chai');
let expect = chai.expect;
let assert = chai.assert;

let sinon = require('sinon');
let sinonChai = require('sinon-chai');
chai.use(sinonChai);

module.exports = {
  expect, assert, sinon
};
