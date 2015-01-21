'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/meanadex-dev',
  app: {
    title: 'meanadex - Development Environment'
  },
  stripe: {
    clientID: process.env.STRIPE_ID || 'ca_53emHeHCgJWdAOPGsIp4uIdFCCEXkdal',
    clientSecret: process.env.STRIPE_SECRET || 'sk_test_POGF3C0J4jmm8rFZNGwLrLaH',
    publishableKey: process.env.PUBLISHABLE_KEY || 'pk_test_WMSaxecz5HSTGZxlFbuxdF7B',
    callbackURL: 'https://127.0.0.1:3000/auth/stripe/callback'
  },
  job: {
    campaignJob: {
      start: 'in 1 minutes',
      frequency: '10 minute'
    }
  },
  imageUploaderOptions: {
    useSSL: true,
    tmpDir: './public/uploads/tmp',
    uploadDir: './public/uploads',
    uploadUrl: '/uploads/',
    maxPostSize: 500000, // 50MB
    minFileSize: 1,
    maxFileSize: 500000, // 50MB
    imageTypes:  /\.(gif|jpe?g|png)/i,
    storage: {
      type: 'local'
    }
  },
  logging: {
    console: {
      level: 'verbose'
    },
    file: {
      debug: {
        filename: './logs/meanadex-debug.log',
        level: 'debug'
      },
      info: {
        filename: './logs/meanadex-info.log',
        level: 'info'
      },
      error: {
        filename: './logs/meanadex-error.log',
        level: 'error'
      }
    }
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'meanadex@gmail.com',
        pass: process.env.MAILER_PASSWORD || '19831013chenxi'
      }
    }
  }
};
