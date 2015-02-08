'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/mootee-dev',
  app: {
    title: 'mootee - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '808981902515299',
    clientSecret: process.env.FACEBOOK_SECRET || '86928b8c0fb90b1206f59ff62aa99ac6'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '826231740029-do4s41u16f6gv5duiiedgeoq3pi9qgpo.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'YXSkFpd1ASBTxMC9cLLBozuG'
  },
  stripe: {
    clientID: process.env.STRIPE_ID || 'ca_53emHeHCgJWdAOPGsIp4uIdFCCEXkdal',
    clientSecret: process.env.STRIPE_SECRET || 'sk_test_POGF3C0J4jmm8rFZNGwLrLaH',
    publishableKey: process.env.PUBLISHABLE_KEY || 'pk_test_WMSaxecz5HSTGZxlFbuxdF7B'
  },
  job: {
    campaignJob: {
      frequency: '5 minute'
    }
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'meanadex@gmail.com',
        pass: process.env.MAILER_PASSWORD || 'WAqIN*Fr7S'
      }
    }
  }
};
