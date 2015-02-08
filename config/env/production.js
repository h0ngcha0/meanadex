'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/mootee',
  job: {
    campaignJob: {
      frequency: '1 day'
    }
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '808979562515533',
    clientSecret: process.env.FACEBOOK_SECRET || '24a3c3d3dacd98563532ce7b8b1a1a28'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '774773218508-o1cl8ktf12a7b1efe54lsmbcr7cbte24.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || '1KE5DYgOLfO78f5nXnF7E5hg'
  },
  // FIXME: replace with real stripe credentials
  stripe: {
    clientID: process.env.STRIPE_ID || 'ca_53em66iaD4mpbQc0ldwzhTpcUR1SiGNr',
    clientSecret: process.env.STRIPE_SECRET || 'sk_live_5tGsK2eD6Lq41gH6O8g18rTJ',
    publishableKey: process.env.PUBLISHABLE_KEY || 'pk_live_YXfiyTtYMfQPiHrz1GVzMode'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  }
};
