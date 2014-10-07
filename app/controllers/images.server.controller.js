'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Img = mongoose.model('Image'),
    path = require('path'),
    async = require('async'),
    winston = require('winston'),
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
  var deleteUploadedFileFun = function(callback) {
    uploader.delete({url: uploaderUrl}, res, function (result) {
      if(result.success) {
        callback(null);
      } else {
        callback({
          message: 'Fail to delete ' + imgName
        });
      }
    });
  };

  var removeImageInDbFun = function(callback) {
    var image = req.image;
    image.remove(function(err) {
        if (err) {
          callback({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          callback(null, image);
        }
      });
  };

  var resultCallback = function(err, results) {
    if(err) {
      res.status(400).send({
        message: errorHandler.getErrorMessage(err.message)
      });
    } else {
      // return the result of second task
      res.jsonp(results[1]);
    }
  };

  async.series([
    deleteUploadedFileFun,
    removeImageInDbFun
  ], resultCallback);
};

/**
 * Delete an Image by its ID
 */
exports.deleteById = function(id) {
  var findImageByIdFun = function(callback) {
    Img.findById(id).exec(
      function(err, image) {
        if (err) {
          callback(err);
        } else if (!image) {
          callback(new Error('Failed to load Image ' + id));
        } else {
          callback(null, image);
        }
      });
  };

  var deleteUploadedFileFun = function(image, callback) {
    var imgName = path.basename(image.url);
    var uploaderUrl = options.uploadUrl + imgName;

    uploader.delete({url: uploaderUrl}, {}, function (result) {
      if(result.success) {
        callback(null, image);
      } else {
        callback({
          message: 'error deleting image: ' + uploaderUrl
        });
      }
    });
  };

  var removeImageFromDbFun = function(image, callback) {
    image.remove(function(err) {
      if (err) {
        callback({
          message: 'error deleting image info from db. ' + err
        });
      } else {
        callback(null);
      }
    });
  };

  var resultCallback = function(err, results) {
    if(err) {
      winston.error('error deleting id %s', id, err);
      console.log(err);
    }
  };

  async.waterfall([
    findImageByIdFun,
    deleteUploadedFileFun,
    removeImageFromDbFun
  ], resultCallback);
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
