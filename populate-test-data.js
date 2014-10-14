'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
    async = require('async'),
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

      var createFrontImages = function(user, callback) {
        request.post(
          'http://localhost:3000/images',
          {
            formData: {
              file: fs.createReadStream(
                __dirname + '/public/modules/designer/img/canvas/crew_front.png'
              )
            }
          },
          function(error, response, body) {
            var img = JSON.parse(body),
                frontImgId = img._id;
            console.log('Uploaded front image: ' + img.url);
            callback(error, frontImgId);
          }
        );
      };

      var createBackImages = function(frontImgId, callback) {
        request.post(
          'http://localhost:3000/images',
          {
            formData: {
              file: fs.createReadStream(
                __dirname + '/public/modules/designer/img/canvas/crew_back.png'
              )
            }
          },
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
            console.log('Tshirt: ' + tshirt.name + ' is uploaded');
            callback(error, tshirt);
          }
        );
      }

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
        createFrontImages,
        createBackImages,
        createTshirt
      ], resultCallback);
    }
  );
};
