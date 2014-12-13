'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Img = mongoose.model('Image'),
    Tshirt = mongoose.model('Tshirt'),
    Campaign = mongoose.model('Campaign');

/**
 * Globals
 */
var user, campaign;

/**
 * Currency tests
 */
describe('Campaign Model Currency Tests:', function() {
  beforeEach(function(done) {
    user = new User({
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

    var tshirt = new Tshirt({
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

    user.save(function() {
      campaign = new Campaign({
        name: 'Campaign Name',
        user: user,
        created_at: '2014-04-14T02:15:15Z',
        ended_at: '2014-08-02T02:15:15Z',
        description: 'nice campaign',
        length: 7,
        url: 'campaign_url',
        goal: 100,
        color: 'black',
        tshirt: tshirt,
        tshirtRef: tshirt._id,
        price: {
          value: 80,
          currency: 'SEK'
        },
        design: 'nice design'
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return campaign.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      campaign.name = '';

      return campaign.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Campaign.remove().exec();
    User.remove().exec();

    done();
  });
});
