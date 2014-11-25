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
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3001/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3001/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3001/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3001/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3001/auth/github/callback'
  },
  ssl: {
    privateKeyPath: process.env.SSL_PATH_PRIVATE_KEY || './config/env/ssl/development/key.pem',
    certificatePath: process.env.SSL_PATH_CERTIFICATE || './config/env/ssl/development/cert.pem'
  },
  stripe: {
    clientID: process.env.STRIPE_ID || 'ca_53emHeHCgJWdAOPGsIp4uIdFCCEXkdal',
    clientSecret: process.env.STRIPE_SECRET || 'sk_test_POGF3C0J4jmm8rFZNGwLrLaH',
    publishableKey: process.env.PUBLISHABLE_KEY || 'pk_test_WMSaxecz5HSTGZxlFbuxdF7B',
    callbackURL: 'http://127.0.0.1:3000/auth/stripe/callback'
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
