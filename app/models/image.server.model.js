'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    textSearch = require('mongoose-text-search'),
    Schema = mongoose.Schema;

/**
 * Image Schema
 */
var ImageSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  url: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  tags: {
    type: [String],
    default: ['Tshirts']
  }
});

// Index on tags
ImageSchema.plugin(textSearch);
ImageSchema.index({
  tags: 'text'
});

mongoose.model('Image', ImageSchema);
