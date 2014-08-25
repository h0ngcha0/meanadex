'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Campaign Schema
 */
var CampaignSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill in Campaign name',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  ended_at: {
    type: Date
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill in Campaign Description',
    trim: true
  },
  length: {
    type: Number,
    required: 'Please fill in Campaign Length',
    min: [3, 'The minimal length of a campaign is 3'],
    max: [100, 'The maximal length of a campaign is 100']
  },
  url: {
    type: String,
    required: 'Please fill in Campaign URL',
    trim: true
  },
  goal: {
    type: Number,
    default: 10,
    required: 'Please fill in Campaign Goal',
    min: [10, 'The minimal goal of a campaign is 10']
  },
  sold: {
    type: Number,
    required: 'sold property is required',
    default: 0
  },
  cost: {
    type: Number,
    required: 'cost property is required'
  },
  price: {
    type: Number,
    required: 'price property is required'
  },
  design: {
    type: String,
    required: 'design property is required',
    trim: true
  },
  orders: {
    type: Array,
    default: []
  }
});

mongoose.model('Campaign', CampaignSchema);
