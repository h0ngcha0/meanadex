'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Img = mongoose.model('Image'),
    logger = require('../lib/logger.server.lib.js'),
    _ = require('lodash');

/**
 * Delete an Tag
 */
exports.delete = function(req, res) {

};

/**
 * List of Tags
 */
exports.list = function(req, res) {
  Img.find().select('tags').exec(
    function(err, Images) {
      if(err) {
        logger.error('Error querying image tags', err);
      } else {
        var tagsArray = _.map(Images, function(img) {
                          return img.tags;
                        });
        var uniqTags = _.union.apply(null, tagsArray);
        res.jsonp(uniqTags);
      }
    }
  );
};
