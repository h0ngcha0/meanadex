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
  name: {
    type: String,
    required: 'name is required',
    trim: true
  }
});

mongoose.model('Tags', TagsSchema);
