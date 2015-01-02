'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
  text: {
    type: String
  }
});

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
    type: [TagSchema],
    default: [{text: 'Tshirts'}]
  }
});

mongoose.model('Image', ImageSchema);
