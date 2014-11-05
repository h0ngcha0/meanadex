'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  provider: {
    type: String,
    required: 'Payment provider is required',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  campaign: {
    type: Schema.ObjectId,
    required: 'Campaign info is required',
    ref: 'Campaign'
  },
  description: {
    type: String,
    default: '',
    required: 'Order description is required',
    trim: true
  },
  payment: {
    type: Schema.Types.Mixed,
    required: 'Payment info is required'
  }
});

mongoose.model('Order', OrderSchema);
