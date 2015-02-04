'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    async = require('async'),
    request = require('request').defaults({strictSSL: false}),
    mongoose = require('mongoose'),
    OAuthAccessToken = mongoose.model('OAuthAccessToken'),
    OAuthRefreshToken = mongoose.model('OAuthRefreshToken'),
    User = mongoose.model('User');

/**
 * Globals
 */
var user;

/**
 * User routes tests
 */
describe('User routes tests', function() {
  before(function(done) {
    user = {
      username: 'test.com@test.com',
      password: 'testtest',
      grant_type: 'password',
      client_id: 'mootee',
      client_secret: 'mootee'
    };
    done();
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should be able to sign up', function(done) {
    request.post(
      {
        url: 'https://localhost:3001/auth/signup',
        form: user,
        json: true
      },
      function(err, response, body) {
        body.should.have.property('access_token');
        body.should.have.property('refresh_token');
        body.should.have.property('token_type').equal('Bearer');
        body.should.have.property('expires_in').equal(3600);
        done();
      }
    );
  });

  it('should be able to sign in', function(done) {
    request.post(
      {
        url: 'https://localhost:3001/auth/signin',
        form: user,
        json: true
      },
      function(err, response, body) {
        body.should.have.property('access_token');
        body.should.have.property('refresh_token');
        body.should.have.property('token_type').equal('Bearer');
        body.should.have.property('expires_in').equal(3600);
        done();
      }
    );
  });

  it('should be able to fetch user data', function(done) {
    async.waterfall([
      // Sign in user
      function(callback) {
        request.post(
          {
            url: 'https://localhost:3001/auth/signin',
            form: user,
            json: true
          },
          function(err, response, body) {
            body.should.have.property('access_token');
            body.should.have.property('refresh_token');
            body.should.have.property('token_type').equal('Bearer');
            body.should.have.property('expires_in').equal(3600);
            callback(err, body.access_token);
          }
        );
      },
      // Fetch user data
      function(access_token, callback) {
        request.get(
          {
            url: 'https://localhost:3001/users/me',
            qs: {
              access_token: access_token
            },
            json: true
          },
          function(err, response, body) {
            body.should.have.property('username').equal(user.username);
            body.should.not.have.property('password');
            callback(err, body);
          }
        );
      }
    ], function(err) {
      done();
    });
  });

  it('should not be able to change username', function(done) {
    async.waterfall([
      // Sign in user
      function(callback) {
        request.post(
          {
            url: 'https://localhost:3001/auth/signin',
            form: user,
            json: true
          },
          function(err, response, body) {
            body.should.have.property('access_token');
            body.should.have.property('refresh_token');
            body.should.have.property('token_type').equal('Bearer');
            body.should.have.property('expires_in').equal(3600);
            callback(err, body.access_token);
          }
        );
      },
      // Update username
      function(access_token, callback) {
        var reverse = function(str) {
            return str.split('').reverse().join('');
        };
        var newUsername = reverse(user.username);
        request.post(
          {
            url: 'https://localhost:3001/users',
            form: {
              access_token: access_token,
              username: newUsername
            },
            json: true
          },
          function(err, response, body) {
            body.should.have.property('username').equal(user.username);
            body.should.not.have.property('password');
            callback(err, body);
          }
        );
      }
    ], function(err) {
      done();
    });
  });

  it('should be able to change password', function(done) {
    async.waterfall([
      // Sign in user
      function(callback) {
        request.post(
          {
            url: 'https://localhost:3001/auth/signin',
            form: user,
            json: true
          },
          function(err, response, body) {
            body.should.have.property('access_token');
            body.should.have.property('refresh_token');
            body.should.have.property('token_type').equal('Bearer');
            body.should.have.property('expires_in').equal(3600);
            callback(err, body.access_token);
          }
        );
      },
      // Change password
      function(access_token, callback) {
        var reverse = function(str) {
            return str.split('').reverse().join('');
        };
        var newPassword = reverse(user.password);
        request.post(
          {
            url: 'https://localhost:3001/users/password',
            form: {
              access_token: access_token,
              currentPassword: user.password,
              newPassword: newPassword,
              verifyPassword: newPassword
            },
            json: true
          },
          function(err, response, body) {
            body.should.have.property('message')
              .equal('Password changed successfully');
            callback(err, newPassword);
          }
        );
      },
      // Sign in with new password
      function(newPassword, callback) {
        user.password = newPassword;
        request.post(
          {
            url: 'https://localhost:3001/auth/signin',
            form: user,
            json: true
          },
          function(err, response, body) {
            body.should.have.property('access_token');
            body.should.have.property('refresh_token');
            body.should.have.property('token_type').equal('Bearer');
            body.should.have.property('expires_in').equal(3600);
            callback(err, body.access_token);
          }
        );
      }
    ], function(err) {
      done();
    });
  });

  after(function(done) {
    var models = [
      OAuthAccessToken,
      OAuthRefreshToken,
      User
    ];
    models.forEach(function(model) {
      model.remove().exec();
    });
    done();
  });
});
