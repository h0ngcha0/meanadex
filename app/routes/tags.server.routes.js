'use strict';

module.exports = function(app) {
  var tags = require('../../app/controllers/tags');

  app.route('/tags')
     .get(tags.list);
};
