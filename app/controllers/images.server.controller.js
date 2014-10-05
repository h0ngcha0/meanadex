'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Img = mongoose.model('Image'),
    path = require('path'),
    _ = require('lodash');


var options = {
  tmpDir: __dirname + '/../../public/uploads/tmp',
  uploadDir: __dirname + '/../../public/uploads',
  uploadUrl: '/uploads/',
  storage: {
    type: 'local'
  }
};

var uploader = require('blueimp-file-upload-expressjs')(options);

/**
 * Create a Image
 */
exports.create = function(req, res) {
  uploader.post(req, res, function (obj) {
    console.log(obj);
    var imageUrl = _.head(obj.files).url;

    var image = new Img({url: imageUrl});
    image.user = req.user;

    image.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(image);
      }
    });
  });
};

/**
 * Show the current Image
 */
exports.read = function(req, res) {
  res.jsonp(req.image);
};

/**
 * Delete an Image
 */
exports.delete = function(req, res) {
  var imgName = path.basename(req.image.url);
  var uploaderUrl = options.uploadUrl + imgName;
  uploader.delete({url: uploaderUrl}, res, function (result) {
    if(result.success) {
      var image = req.image;
      image.remove(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(image);
        }
      });
    } else {
      res.status(400).send({
        message: 'Fail to delete ' + imgName
      });
    }
  });
};

/**
 * Delete an Image by its ID
 */
exports.deleteById = function(id) {
  Img.findById(id).exec(
    function(err, image) {
      if (err) return err;
      if (! image) return (new Error('Failed to load Image ' + id));

      var imgName = path.basename(image.url);
      var uploaderUrl = options.uploadUrl + imgName;
      uploader.delete({url: uploaderUrl}, {}, function (result) {
        if(result.success) {
          image.remove(function(err) {
            if (err) {
              // FIXME: log the error properly
              console.log('error deleting image info from db. ' + err);
            }
          });
        } else {
          // FIXME: log the error properly
          console.log('error deleting image: ' + uploaderUrl);
        }
      });
    });
};

/**
 * List of Images
 */
exports.list = function(req, res) {
  Img.find().sort('-created').populate('user', 'displayName').exec(
    function(err, images) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(images);
      }
    });
};

/**
 * Image middleware
 */
exports.imageByID = function(req, res, next, id) {
  Img.findById(id).populate('user', 'displayName').exec(
    function(err, image) {
      if (err) return next(err);
      if (! image) return next(new Error('Failed to load Image ' + id));
      req.image = image ;
      next();
    });
};

/**
 * Image authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.image.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};