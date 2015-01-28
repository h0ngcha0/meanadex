'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//
// Schemas definitions
//
var OAuthAccessTokenSchema = new Schema({
  accessToken: {
    type: String
  },
  clientId: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  expires: {
    type: Date
  }
});

var OAuthRefreshTokenSchema = new Schema({
  refreshToken: {
    type: String
  },
  clientId: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  expires: {
    type: Date
  }
});

var OAuthClientSchema = new Schema({
  clientId: {
    type: String
  },
  clientSecret: {
    type: String
  },
  redirectUri: {
    type: String
  }
});

var OAuthAuthCodeSchema = new Schema({
  authCode: {
    type: String,
    required: true,
    unique: true
  },
  clientId: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  expires: {
    type: Date
  }
});

mongoose.model('OAuthAuthCode', OAuthAuthCodeSchema);
mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema);
mongoose.model('OAuthRefreshToken', OAuthRefreshTokenSchema);
mongoose.model('OAuthClient', OAuthClientSchema);
