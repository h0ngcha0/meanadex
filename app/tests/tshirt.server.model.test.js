'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Img = mongoose.model('Image'),
    Tshirt = mongoose.model('Tshirt');

/**
 * Globals
 */
var user, tshirt;

/**
 * Currency tests
 */
describe('Tshirt Model Currency Tests:', function() {
  beforeEach(function(done) {
    var user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    var frontImg = new Img({
      url: '0.0.0.0/from_image.jpg',
      user: user
    });

    var backImg = new Img({
      url: '0.0.0.0/back_image.jpg',
      user: user
    });

    user.save(function() {
      tshirt = new Tshirt({
        name: 'Tshirt Name',
        user: user,
        variants:
          [
            {
              name: 'Variant Name',
              description: 'Description',
              baseCost: 10,
              currency: 'SEK',
              colors: ['00000', 'ffffff']
            }
          ],
        frontImage: frontImg,
        backImage: backImg
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return tshirt.save(function(err) {
               should.not.exist(err);
               done();
             });
    });

    it('should be able to show an error when try to save without name', function(done) {
      tshirt.name = '';

      return tshirt.save(function(err) {
               should.exist(err);
               done();
             });
    });
  });

  afterEach(function(done) {
    Tshirt.remove().exec();
    User.remove().exec();
    Img.remove().exec();

    done();
  });
});
