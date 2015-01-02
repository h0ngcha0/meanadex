'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Img = mongoose.model('Image'),
    path = require('path'),
    async = require('async'),
    logger = require('../lib/logger.server.lib.js'),
    config = require('../../config/config'),
    utils = require('./utils'),
    _ = require('lodash');

var uploader = require('blueimp-file-upload-expressjs')(
  config.imageUploaderOptions
);

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
        logger.error('Error saving image.', imageUrl, err);
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
 * Update an Image, only meta data, not the actual
 * image
 */
exports.update = function(req, res) {
  var image = req.image;

  image = _.extend(image, req.body);

  image.save(function(err) {
    if (err) {
      logger.error('Error updating image.', image._id, err);

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(image);
    }
  });
};

/**
 * Delete an Image
 */
exports.delete = function(req, res) {
  var imgName = path.basename(req.image.url);
  var uploaderUrl = config.imageUploaderOptions.uploadUrl + imgName;
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
      logger.error('Fail to delete image.', err);

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
    var uploaderUrl = config.imageUploaderOptions.uploadUrl + imgName;

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
      logger.error('Error deleting image.', id, err);
    }
  };

  async.waterfall([
    findImageByIdFun,
    deleteUploadedFileFun,
    removeImageFromDbFun
  ], resultCallback);
};

var searchTags = function(tags) {
  if(tags) {
    var tagHead = utils.head(tags);
    var tagTail = utils.tail(tags);
    var searchObj = Img.find({
      tags: tagHead
    });

    return _.foldl(tagTail, function(acc, tag) {
      return acc.where({tags: tag});
    }, searchObj);
  } else {
    return Img.find();
  }
};

/**
 * List of Images
 */
exports.list = function(req, res) {
  var tags = req.param('tags');
  searchTags(tags)
    .sort('-created')
    .populate('user', 'displayName')
    .exec(
      function(err, images) {
        if (err) {
          logger.error('Error listing images.', err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(images);
        }
      }
    );
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
