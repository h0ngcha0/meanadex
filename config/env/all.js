'use strict';

module.exports = {
  app: {
    title: 'mootee',
    description: 'Mootee is an amazing tshirt service',
    keywords: 'tshirt, crowd sourcing, moose, lambda'
  },
  port: process.env.PORT || 3000,
  secure: process.env.SECURE || false,
  templateEngine: 'swig',
  logging: {
    console: {
      level: 'verbose'
    },
    file: {
      debug: {
        filename: './log/mootee-debug.log',
        level: 'debug'
      },
      info: {
        filename: './log/mootee-info.log',
        level: 'info'
      },
      error: {
        filename: './log/mootee-error.log',
        level: 'error'
      }
    }
  }
};
