
'use strict';

const request = require('superagent');

describe('plugin integration test', () => {
  it('GET default extension', done => {
    request.get('http://localhost:9877/heartbeat').end((error, response) => {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});
