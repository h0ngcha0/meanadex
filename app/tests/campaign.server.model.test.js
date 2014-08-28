'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Campaign = mongoose.model('Campaign');

/**
 * Globals
 */
var user, campaign;

/**
 * Unit tests
 */
describe('Campaign Model Unit Tests:', function() {
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
      campaign = new Campaign({
        name: 'Campaign Name',
        user: user,
        created_at: "2014-04-14T02:15:15Z",
        ended_at: "2014-08-02T02:15:15Z",
        description: "nice campaign",
        length: 7,
        url: "campaign_url",
        goal: 100,
        sold: 20,
        cost: 50,
        price: 80,
        design: "nice design",
        orders: ["order1", "order2"]
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
