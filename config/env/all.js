'use strict';

module.exports = {
  app: {
    title: 'meanadex',
    description: 'Meanadex is Monadex dressed up in the fancy cloak of MEAN stack',
    keywords: 'tshirt, crowd sourcing, mean, lambda'
  },
  port: process.env.PORT || 3000,
  secure: process.env.SECURE || true,
  templateEngine: 'swig'
};
