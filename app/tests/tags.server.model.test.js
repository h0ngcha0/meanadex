'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tags = mongoose.model('Tags');

/**
 * Globals
 */
var user, tags;

/**
 * Unit tests
 */
describe('Tags Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      tags = new Tags({
        // Add model fields
        // ...
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return tags.save(function(err) {
               should.not.exist(err);
               done();
             });
    });
  });

  afterEach(function(done) {
    Tags.remove().exec();
    User.remove().exec();

    done();
  });
});
