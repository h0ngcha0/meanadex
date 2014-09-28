'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Image Schema
 */
var ImageSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Image name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Image', ImageSchema);
