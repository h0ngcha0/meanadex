'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    async = require('async'),
    moment = require('moment'),
    config = require('../../../config/config'),
    sinon = require('sinon'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    Order = mongoose.model('Order'),
    User = mongoose.model('User'),
    Img = mongoose.model('Image'),
    Campaign = mongoose.model('Campaign'),
    Tshirt = mongoose.model('Campaign');

/**
 * Globals
 */
var user, campaign, order;

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

function createUserFun(username, password) {
  return function(callback) {
    User.create(
      {
        username: username,
        password: password,
        provider: 'local'
      },
      function(err, user) {
        callback(err, user);
      }
    );
  };
}

function createCampaignFun(name, created, ended, description,
                          goal, price, state) {
  return function(user, callback) {
    Campaign.create(
      {
        name: name,
        user: user,
        created: created,
        ended: created, // change to add length
        description: description,
        length: 7, // not important
        goal: goal,
        color: 'white',
        tshirt: tshirt,
        tshirtRef: tshirt._id,
        price: {
          value: price,
          currency: 'SEK'
        },
        design: 'nice design',
        state: state
      },
      function(err, campaign) {
        console.log('campaign: ');
        console.log(campaign);
        callback(err, campaign);
      }
    )
  }
}

function createOrdersFun(numOfOrders) {
  return function(campaign, callback) {
    var funcs = _.chain(
      _.range(1, numOfOrders+1)
    ).map(
      function(index) {
        return { description: 'nice order ' + index, quantity: 1};
      }
    ).map(
      function(spec) {
        return createOrderFun(spec.description, spec.quantity, campaign);
      }
    ).value();

    async.parallel(
      funcs,
      function(err, orders) {
        console.log('order err:');
        console.log(err);
        _.each(orders, function(order) {
          console.log('Order [' + order._id + '] is created.');
        });

        callback(err, orders);
      }
    );
  }
}

function createOrderFun(description, quantity, campaign) {
  return function(callback) {
    Order.create(
      {
        provider: 'stripe',
        user: user,
        campaign: campaign,
        description: description,
        email: 'user@example.com',
        amount: campaign.price.value,
        quantity: quantity,
        currency: campaign.price.currency,
        shippingAddr: {
          name: 'username',
          street: 'street',
          roomNum: 'room number',
          city: 'city',
          zipcode: '12345',
          country: 'Sweden'
        },
        payment: {}
      },
      function(err, order) {
        callback(err, order);
      }
    )
  }
}

describe('Campaign not tipped, endedDate has passed, have enough orders', function() {
  describe('Method Save', function() {
    var configMock,
        nowMoment = moment(new Date()),
        createdMoment = nowMoment.add(-7, 'days'),
        endedMoment = nowMoment.add(-2, 'days'),
        campaignGoal = 10,
        numOfOrders = 10,
        state = 'not_tipped';

    before(function() {
      async.waterfall(
        [
          createUserFun('admin@mootee.io', 'password'),
          createCampaignFun('nice campaign', createdMoment.toDate(),
                            endedMoment.toDate(), 'description', campaignGoal,
                            50, state),
          createOrdersFun(numOfOrders)
        ],
        function(err, results) {
          should.not.exist(err);
          console.log('orders: ');
          console.log(results);
        }
      );
    });

    it('should charge user when orders has passed', function(done) {
      should.exist(1);
      done();
    });

    after(function() {
      Order.remove().exec();
      Campaign.remove().exec();
      User.remove().exec();
      //configMock.job.restore();
    });
  });
});

