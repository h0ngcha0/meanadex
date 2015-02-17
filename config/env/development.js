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
    clientID: process.env.GOOGLE_ID || '774773218508-o1cl8ktf12a7b1efe54lsmbcr7cbte24.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || '1KE5DYgOLfO78f5nXnF7E5hg',
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN || '1/jme7lJCCHFpBkkwYu3C1Fa-BGrKkb6vPxosXM49EolQMEudVrK5jSpoR30zcRFq6'
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
    from: process.env.MAILER_FROM || 'contact@mootee.io',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  enableNewRelic: false
};
