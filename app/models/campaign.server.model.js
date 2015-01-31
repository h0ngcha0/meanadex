'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    mongoosePages = require('mongoose-pages'),
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
  goal: {
    type: Number,
    default: 10,
    required: 'Please fill in Campaign Goal',
    min: [10, 'The minimal goal of a campaign is 10']
  },
  price: {
    type: {
      value: {
        type: Number,
        required: 'Price value is required'
      },
      currency: {
        type: String,
        required: 'Price currency is required'
      }
    },
    required: 'Price property is required'
  },
  color: {
    type: String,
    required: 'Color is required',
    default: 'white'
  },
  // the reason that we store both tshirt and tshirt ref is because
  // the tshirt that tshirt ref refers to might be changed.
  tshirtRef: {
    type: Schema.ObjectId,
    required: 'Tshirt ref is required',
    ref: 'Tshirt'
  },
  // currentVariant is embedded in tshirt
  tshirt: {
    type: Schema.Types.Mixed,
    required: 'Tshirt is required'
  },
  design: {
    type: String,
    required: 'design property is required',
    trim: true
  },
  state: {
    type: String,
    // 'not_tipped': campaign waiting to be tipped
    // 'tipped': campaign tipped and order charged
    // 'expired': campaign expired, order not charged
    enum: ['not_tipped', 'tipped', 'expired'],
    required: 'matured property is required',
    default: 'not_tipped'
  }
});

mongoosePages.skip(CampaignSchema);
mongoose.model('Campaign', CampaignSchema);
