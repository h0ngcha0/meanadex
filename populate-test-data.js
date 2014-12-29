'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
    async = require('async'),
    moment = require('moment'),
    _ = require('lodash'),
    fs = require('fs');

module.exports = function(grunt) {
  request = request.defaults({jar: true});
  grunt.task.registerTask(
    'populateTestData',
    'Task that populats test data into the database.',
    function() {
      var done = this.async();
      var createAdminUser = function(callback) {
        request.post(
          'http://localhost:3000/auth/signup',
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
          'http://localhost:3000/images',
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
          'http://localhost:3000/tshirts',
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
        var campaignLengths = [3, 5, 7, 10, 14, 21];
        var length = pickRandom(campaignLengths);
        return function(callback) {
          request.post(
            'http://localhost:3000/campaigns',
            {
              form: {
                name: name,
                created_at: now,
                ended_at: moment(now).add(length, 'days').toDate(),
                description: description,
                length: length,
                url: 'random1',
                goal: 100,
                tshirt: tshirt,
                tshirtRef: tshirt._id,
                price: {
                  value: 100,
                  currency: 'SEK'
                },
                color: 'red',
                design: JSON.stringify({
                  front: {},
                  back: {}
                })
              }
            },
            function(error, response, body) {
              var campaign = JSON.parse(body);
              console.log(error);
              console.log('Campaign: ' + campaign.name + ' is created');
              callback(error, campaign);
            }
          )
        };
      };

      var createCampaigns = function(tshirt, callback) {
        var funcs = _.map(
          [
            {
              name: 'campaign 1',
              description: 'description 1'
            },
            {
              name: 'campaign 2',
              description: 'description 2'
            }
          ],
          function(spec) {
            return createCampaignFun(spec.name, spec.description, tshirt);
          });


        async.parallel(
          funcs,
          function(err, results) {
            _.each(results, function(result) {
              console.log('niux');
              console.log(result);
              console.log('Campaign ' + result.name + ' is created.');
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
        createCampaigns
      ], resultCallback);
    }
  );
};
