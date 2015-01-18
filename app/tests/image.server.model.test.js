'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Img = mongoose.model('Image');

/**
 * Globals
 */
var user, image;

/**
 * Unit tests
 */
describe('Image Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      username: 'test@test.com',
      password: 'password',
      provider: 'local'
    });

    user.save(function() {
      image = new Img({
        url: 'Image Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return image.save(
        function(err) {
          should.not.exist(err);
          done();
        });
    });

    it('should be able to show an error when try to save without url', function(done) {
      image.url = '';

      return image.save(
        function(err) {
          should.exist(err);
          done();
        });
    });
  });

  afterEach(function(done) {
    Img.remove().exec();
    User.remove().exec();

    done();
  });
});
