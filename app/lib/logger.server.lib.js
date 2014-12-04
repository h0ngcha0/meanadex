'use strict';

var winston = require('winston'),
    config = require('../../config/config');

// FIXME: should put logging configuration in the config file
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(
      {level: 'verbose' }
    ),
    new (winston.transports.File)(
      {filename: './logs/meanadex-debug.log', level: 'debug' },
      {filename: './logs/meanadex-info.log', level: 'info' },
      {filename: './logs/meanadex-error.log', level: 'error' }
    )
  ]
});


module.exports = logger;
