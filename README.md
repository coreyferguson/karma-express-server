
# Karma Express Server

## Summary

Runs a customizable [expressjs](http://expressjs.com/) application for karma tests.

## Usage

### Install

```bash
npm install --save-dev karma-express-server
```

### Configure

Add framework and `expressServer` configuration to karma config:

```javascript
module.exports = function(config) {
  config.set({

    // ...

    frameworks: [
      // ...
      'expressServer'
    ],

    // ...

    expressServer: {

      port: 9877, // different than karma's port
      protocol: 'https',
      httpsServerOptions: {
        key: fs.readFileSync('path/to/my-server.key.pem'),
        cert: fs.readFileSync('path/to/my-server.crt.pem')
      },

      // custom extensions go here
      extensions: [
        // for example:
        function(
          app, // express app
          logger // karma logger
        ) {
          app.get('/heartbeat', (req, res) => {
            res.sendStatus(200);
          });
        }
      ]

    }

  });
};
```

## Contribution

See [Contribution](./CONTRIBUTE) documentation for build, test and publish details.
