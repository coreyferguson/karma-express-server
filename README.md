
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

### SSL

Self-signed certificates can be generated with [nodejs-self-signed-certificate-example](https://github.com/coolaj86/nodejs-self-signed-certificate-example).

```javascript
// ...

expressServer: {

  // ...

  protocol: 'https',
  httpsServerOptions: {
    key: fs.readFileSync('path/to/my-server.key.pem'),
    cert: fs.readFileSync('path/to/my-server.crt.pem')
  }

}

// ...
```


## Contribution

See [Contribution](./CONTRIBUTE.md) documentation for build, test and publish details.
