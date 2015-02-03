'use strict';

var HOST = process.env.WERCKER_MONGODB_HOST || 'localhost';

module.exports = {
  db: 'mongodb://' + HOST + '/meanadex-test',
  port: 3001,
  app: {
    title: 'meanadex - Test Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET'
  },
  stripe: {
    clientID: process.env.STRIPE_ID || 'ca_53emHeHCgJWdAOPGsIp4uIdFCCEXkdal',
    clientSecret: process.env.STRIPE_SECRET || 'sk_test_POGF3C0J4jmm8rFZNGwLrLaH',
    publishableKey: process.env.PUBLISHABLE_KEY || 'pk_test_WMSaxecz5HSTGZxlFbuxdF7B'
  },
  job: {
    campaignJob: {
      start: 'Saturday at noon',
      frequency: '1 week'
    }
  },
  imageUploaderOptions: {
    tmpDir: './public/dist/uploads/tmp',
    uploadDir: './public/dist/uploads',
    uploadUrl: '/uploads/',
    maxPostSize: 500000, // 50MB
    minFileSize: 1,
    maxFileSize: 500000, // 50MB
    imageTypes:  /\.(gif|jpe?g|png)/i,
    storage: {
      type: 'aws',
      aws: {
        accessKeyId: 'AKIAIXDR74RCRQ2VSFLA',
        secretAccessKey: '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',
        region: 'eu-west-1',
        bucketName: 'meanadex-images-test'
      }
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
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  }
};
