'use strict';

module.exports = function(app) {

  app.route('/ping').get(function(req, res) {
    res.send('pong');
  });
};
