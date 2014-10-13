'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
    async = require('async');

module.exports = function(grunt) {
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
            auth: {
              'user': 'admin',
              'pass': 'password',
              'sendImmediately': false
            },
            form: {
              url: 'niux',
              user: user
            }
          },
          function(error, response, body) {
            callback(error, body);
          }
        );
      };

      var resultCallback = function(err, results) {
        if(err) {
          console.log(err);
        } else {
          console.log(results);
          console.log('success!')
        }
      };

      async.waterfall([
        createAdminUser,
        createFrontImages
      ], resultCallback);
    }
  );
};
