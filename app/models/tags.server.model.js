'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Tags Schema
 */
var TagsSchema = new Schema({
  tags: {
    type: [String],
    default: []
  }
});

mongoose.model('Tags', TagsSchema);
