'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Campaign = mongoose.model('Campaign'),
    Order = mongoose.model('Order');

/**
 * Globals
 */
var user, campaign, order;

/**
 * Unit tests
 */
describe('Order Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    campaign = new Campaign({
      name: 'Campaign Name',
      user: user,
      created_at: '2014-04-14T02:15:15Z',
      ended_at: '2014-08-02T02:15:15Z',
      description: 'nice campaign',
      length: 7,
      url: 'campaign_url',
      goal: 100,
      sold: 20,
      cost: {
        value: 50,
        unit: 'SEK'
      },
      price: {
        value: 80,
        unit: 'SEK'
      },
      design: 'nice design',
      orders: ['order1', 'order2']
    });

    user.save(function() {
      order = new Order({
        provider: 'stripe',
        user: user,
        campaign: campaign,
        description: 'description',
        payment: {}
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return order.save(
        function(err) {
          should.not.exist(err);
          done();
        });
    });

    it('should be able to show an error when try to save without provider', function(done) {
      order.provider = '';

      return order.save(
        function(err) {
          should.exist(err);
          done();
        });
    });
  });

  afterEach(function(done) {
    Order.remove().exec();
    User.remove().exec();

    done();
  });
});
