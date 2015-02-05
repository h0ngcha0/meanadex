'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    async = require('async'),
    moment = require('moment'),
    config = require('../../../config/config'),
    sinon = require('sinon'),
    mongodb = require('mongodb'),
    mongoose = require('mongoose'),
    Agenda = require('agenda'),
    proxyquire = require('proxyquire'),
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
var agendaTestJobCollection = 'agendaTestJobs';

var testAgenda = new Agenda(
  {
    db: {
      address: config.db,
      collection: agendaTestJobCollection
    }
  }
);

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

function removeAgendaJobs(callback) {
  mongodb.MongoClient.connect(config.db, function(err, db) {
    if(!err) {
      db.collection(agendaTestJobCollection, function(err, collection) {
        collection.remove({}, {w:1}, function(err, result) {
          if(!err) {
            console.log('removed all data in agenda jobs.');
          }

          callback(err);
        });
      });
    }
  });
}

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
        callback(err, campaign);
      }
    );
  };
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
        if(err) {
          console.log('order err:');
          console.log(err);
        }

        _.each(orders, function(order) {
          console.log('Order [' + order._id + '] is created.');
        });

        callback(err, campaign, orders);
      }
    );
  };
}

function createOrderFun(description, quantity, campaign) {
  return function(callback) {
    var randomStr = Math.random().toString(36).substring(7);

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
        payment: {
          customerId: randomStr
        }
      },
      function(err, order) {
        callback(err, order);
      }
    );
  };
}

describe('Campaign not tipped, endedDate has passed, have enough orders', function() {
  // set the timeout to be 20 seconds.
  this.timeout(20 * 1000);

  describe('Method Save', function() {
    var nowMoment = moment(new Date()),
        createdMoment = nowMoment.add(-7, 'days'),
        endedMoment = nowMoment.add(-2, 'days'),
        campaignGoal = 10,
        numOfOrders = 10,
        state = 'not_tipped',
        campaign;

    var configStub = {
      stripe: {
        clientSecret: 'stripeClientSecret'
      },
      job: {
        campaignJob: {
          start: 'in 5 seconds',
          frequency: '1 day'
        }
      }
    };

    before(function() {
      // Connect to the db
      async.waterfall(
        [
          removeAgendaJobs,
          createUserFun('admin@mootee.io', 'password'),
          createCampaignFun('nice campaign', createdMoment.toDate(),
                            endedMoment.toDate(), 'description', campaignGoal,
                            50, state),
          createOrdersFun(numOfOrders)
        ],
        function(err, campn, orders) {
          campaign = campn;
          should.not.exist(err);
        }
      );

    });

    it('should charge user when orders has passed', function(done) {
      var stripeStub = function() {
            return {
              charges: {
                create: function(obj, callback) {
                  callback(null, 'charged');
                }
              },
              customers: {
                del: function(customerId, callback) {
                  callback(null, customerId);
                }
              }
            };
          },
          campaignJob = proxyquire(
            '../../lib/jobs/campaign.server.job',
            {
              'stripe': stripeStub
            }
          );
      // execute campaignJob
      campaignJob(testAgenda, configStub);
      testAgenda.start();

      setTimeout(function() {
        Campaign.findById(campaign._id).exec(function(err, campaign) {
          should.not.exist(err);

          (campaign.state).should.be.equal('tipped');
          done();
        });
      }, 15 * 1000);
    });

    after(function() {
      testAgenda.stop();

      Order.remove().exec();
      Campaign.remove().exec();
      User.remove().exec();
      removeAgendaJobs(function(err) {
        if(err) {
          console.log('remove agenda jobs failed:');
          console.log(err);
        }
      });
    });
  });
});
