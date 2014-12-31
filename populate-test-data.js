'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
    async = require('async'),
    moment = require('moment'),
    _ = require('lodash'),
    fs = require('fs');

var stripe = require("stripe")(
    "sk_test_POGF3C0J4jmm8rFZNGwLrLaH"
);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var options = {
    numOfCampaigns: 10,
    numOfOrders: 100
};

module.exports = function(grunt) {
  request = request.defaults({jar: true});
  grunt.task.registerTask(
    'populateTestData',
    'Task that populats test data into the database.',
    function() {
      var done = this.async();
      var createAdminUser = function(callback) {
        request.post(
          'https://localhost:3000/auth/signup',
          {
            form: {
              firstName: 'admin',
              lastName: 'gustav',
              email: 'admin@meanadex.com',
              username: 'admin',
              password: 'password'
            }
          },
          function(error, response, body) {
            var user = JSON.parse(body);
            console.log('Created admin user: ' + user.displayName);
            callback(error, user);
          }
        );
      };

      var createImage = function(path, callback) {
        request.post(
          'https://localhost:3000/images',
          {
            formData: {
              file: fs.createReadStream(
                __dirname + path
              )
            }
          },
          callback
        );
      };

      var createFrontImage = function(user, callback) {
        createImage(
          '/public/modules/designer/img/canvas/crew_front.png',
          function(error, response, body) {
            var img = JSON.parse(body),
                frontImgId = img._id;
            console.log('Uploaded front image: ' + img.url);
            callback(error, frontImgId);
          }
        );
      };

      var createBackImage = function(frontImgId, callback) {
        createImage(
          '/public/modules/designer/img/canvas/crew_back.png',
          function(error, response, body) {
            var img = JSON.parse(body),
                backImgId = img._id;
            console.log('Uploaded back image: ' + img.url);
            callback(error, frontImgId, backImgId);
          }
        );
      };

      var createTshirt = function(frontImgId, backImgId, callback) {
        request.post(
          'https://localhost:3000/tshirts',
          {
            form: {
              name: 'Meanadex signature Tee',
              frontImage: frontImgId,
              backImage: backImgId,
              variants: [
                {
                  name: 'All cutton',
                  description: 'Good value',
                  baseCost: 50,
                  unit: 'SEK',
                  colors: ['white', 'red', 'green']
                },
                {
                  name: 'Premium',
                  description: 'Good quality',
                  baseCost: 70,
                  unit: 'SEK',
                  colors: ['green', 'black', 'yellow']
                }
              ]
            }
          },
          function(error, response, body) {
            var tshirt = JSON.parse(body);
            console.log('Tshirt: ' + tshirt.name + ' is created');
            callback(error, tshirt);
          }
        );
      }

      var pickRandom = function(list) {
        var index = _.random(0, list.length -1);
        return list[index];
      };

      var createCampaignFun = function(name, description, tshirt) {
        var now = new Date();
        var length = pickRandom([3, 5, 7, 10, 14, 21]);
        var color = pickRandom(['red', 'yellow', 'blue', 'green']);
        var goal = pickRandom([10, 50, 100, 200]);
        var price = pickRandom([40, 70, 85, 91, 100]);
        var url = Math.random().toString(36).substring(7);
        return function(callback) {
          request.post(
            'https://localhost:3000/campaigns',
            {
              form: {
                name: name,
                created_at: now,
                ended_at: moment(now).add(length, 'days').toDate(),
                description: description,
                length: length,
                url: url,
                goal: goal,
                tshirt: tshirt,
                tshirtRef: tshirt._id,
                price: {
                  value: price,
                  currency: 'SEK'
                },
                color: color,
                design: JSON.stringify({
                  front: {},
                  back: {}
                })
              }
            },
            function(error, response, body) {
              var campaign = JSON.parse(body);
              callback(error, campaign);
            }
          )
        };
      };

      var createCampaigns = function(tshirt, callback) {
        var numOfCampaigns = options.numOfCampaigns || 10;
        var funcs = _.chain(
          _.range(1, numOfCampaigns+1)
        ).map(function(index) {
          return { name: 'Campaign ' + index, description: 'Description ' + index};
        }).map(function(spec) {
          return createCampaignFun(spec.name, spec.description, tshirt);
        }).value();

        async.parallel(
          funcs,
          function(err, results) {
            _.each(results, function(campaign) {
              console.log('Campaign ' + campaign.name + ' is created.');
            });

            callback(err, results);
          }
        );
      };


      var createOrderFun = function(campaigns, callback) {
        var campaign = pickRandom(campaigns);
        var email = pickRandom(['lbs.lhc@gmail.com', 'monadex@gmail.com']);
        var quantity = pickRandom([1,2,3,4,5,10]);
        return function(callback) {
          stripe.tokens.create(
            {
              card: {
                "number": '4242424242424242',
                "exp_month": 12,
                "exp_year": 2015,
                "cvc": '123'
              }
            },
            function(err, token) {
              request.post(
                'https://localhost:3000/orders',
                {
                  form: {
                    campaign: campaign._id,
                    provider: 'stripe',
                    email: email,
                    description: campaign.name,
                    payment: {id: token.id},
                    amount: parseInt(campaign.price.value) * quantity,
                    currency: 'SEK',
                    quantity: quantity,
                    shippingAddr: {
                      name: 'fake name',
                      street: 'fake street',
                      roomNum: 'fake rumNum',
                      city: 'fake city',
                      zipcode: 'fake zipcode',
                      country: 'fake country'
                    }
                  }
                },
                function(error, response, body) {
                  var order = JSON.parse(body);
                  console.log('createOrder: ' + order._id);
                  callback(error, order);
                }
              )
            }
          );
        };
      };

      var createOrders = function(campaigns, callback) {
        var numOfOrders = options.numOfOrders || 100;
        var funcs = _.chain(
          _.range(1, numOfOrders+1)
        ).map(function(index) {
          return createOrderFun(campaigns, callback);
        }).value();

        async.parallel(
          funcs,
          function(err, results) {
            console.log('createOrders: ');
            console.log(err);
            _.each(results, function(order) {
              console.log('Done Creating orders.');
            });

            callback(err, results);
          }
        );
      };

      var resultCallback = function(err, results) {
        if(err) {
          done(false);
        } else {
          console.log('-----');
          console.log('Done!')
          done()
        }
      };

      async.waterfall([
        createAdminUser,
        createFrontImage,
        createBackImage,
        createTshirt,
        createCampaigns,
        createOrders
      ], resultCallback);
    }
  );
};
