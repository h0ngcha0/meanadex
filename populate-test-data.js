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
            var user = body;
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
            callback(error, body);
          }
        );
      };

      var resultCallback = function(err, results) {
        if(err) {
          done(false);
        } else {
          console.log('success!')
          done()
        }
      };

      async.waterfall([
        createAdminUser,
        createFrontImages
      ], resultCallback);
    }
  );
};
