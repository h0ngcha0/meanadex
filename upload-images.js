'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
    async = require('async'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs');

// NOTE: This task assumes that the admin user is already
//       created.

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Default to development mode
if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

var url;
if(process.env.NODE_ENV === 'production') {
  url = 'https://mootee.io'
} else {
  url = 'https://localhost:3000';
}

var config = require('./config/config');

var allowedExtention = ['jpeg', 'jpg', 'png'];

module.exports = function(grunt) {
  request = request.defaults({jar: true});
  grunt.task.registerTask(
    'uploadImages',
    'Task that upload images to mootee with tags.',
    function() {
      var done = this.async();
      var LoginAsAdminUser = function(callback) {
        request.post(
          {
            url: url + '/auth/signin',
            form: {
              username: 'admin@mootee.io',
              password: 'password',
              grant_type: 'password',
              client_id: 'mootee',
              client_secret: 'mootee'
            },
            json: true
          },
          function(error, response, body) {
            console.log('Logged in as admin user');
            var access_token = body.access_token;
            callback(error, access_token);
          }
        );
      };

      var postImage = function(path, access_token, callback) {
        request.post(
          {
            url: url + '/images',
            qs: {
              access_token: access_token
            },
            formData: {
              file: fs.createReadStream(
                __dirname + '/' + path
              )
            }
          },
          callback
        );
      };

      var postImageFun = function(path, tags, access_token) {
        return function(callback) {
          console.log('uploading ' + path);
          postImage(
            path,
            access_token,
            function(error, response, body) {
              var img = JSON.parse(body),
                  imgId = img._id;

              img.tags = tags;

              request.post(
                {
                  url: url + '/images/' + img._id,
                  qs: {
                    access_token: access_token
                  },
                  form: img
                },
                function(error, response, body) {
                  console.log('Uploaded image: ' + img.url);
                  callback(error);
                }
              );
            }
          );
        };
      };

      var uploadImages = function(imgFiles, tags) {
        return  function(access_token, callback) {
          var funcs = _.map(imgFiles, function(imgFile) {
                        return postImageFun(imgFile, tags, access_token);
                      });

          async.series(
            funcs,
            function(err, result) {
              if(!err) {
                console.log('all images uploaded');
              }

              callback(err, result);
            }
          );
        };
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

      var imageDir = grunt.option('path');
      var tags = grunt.option('tags') || 'tshirts';

      // split into an array of words
      tags = tags.match(/\S+/g);
      console.log(tags);
      if(imageDir) {
        var imageFiles0 = config.getGlobbedFiles(imageDir);
        var imageFiles = _.filter(
          imageFiles0,
          function(imageFile) {
            return _.contains(
              allowedExtention,
              path.extname(imageFile).substring(1)
            );
          }
        );

        if(imageFiles.length !== 0) {
          async.waterfall([
            LoginAsAdminUser,
            uploadImages(imageFiles, tags)
          ], resultCallback);
        } else {
          console.log(
            'no file detected for uploading. allowed file extention: ' + allowedExtention
          );
        }
      } else {
        console.log('image path needs to be specified.');
      }
    }
  );
};
