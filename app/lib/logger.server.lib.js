'use strict';

var winston = require('winston'),
    config = require('../../config/config');

// FIXME: should put logging configuration in the config file
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: function() {
        var date = new Date();
        return date.getDate() + '/' +
          (date.getMonth() + 1) + ' ' +
          date.toTimeString().substr(0,5) + ' [' + global.process.pid + ']';
      },
      level: config.logging.console.level
    }
                                    ),
    new (winston.transports.File)(
      {
        filename: config.logging.file.debug.filename,
        level: config.logging.file.debug.level
      },
      {
        filename: config.logging.file.info.filename,
        level: config.logging.file.info.level
      },
      {
        filename: config.logging.file.error.filename,
        level: config.logging.file.error.level
      }
    )
  ]
});


module.exports = logger;
