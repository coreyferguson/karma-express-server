
module.exports = function(app, logger) {
  app.get('/heartbeat', (req, res) => {
    res.sendStatus(200);
  });
};
