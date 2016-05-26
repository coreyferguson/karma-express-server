
'use strict';

let server = {
  listen: (port, callback) => {
    callback();
  }
};

module.exports = {
  createServer: (options, app) => {
    return server;
  }
};
