'use strict';

module.exports = {
  app: {
    title: 'mootee',
    description: 'Mootee is an amazing tshirt service',
    keywords: 'tshirt, crowd sourcing, moose, lambda'
  },
  port: process.env.PORT || 3000,
  secure: process.env.SECURE || true,
  templateEngine: 'swig'
};
