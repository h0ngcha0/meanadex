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
  created_at: {
    type: Date,
    default: Date.now
  },
  campaign: {
    type: Schema.ObjectId,
    required: 'Campaign info is required',
    ref: 'Campaign',
    index: true
  },
  description: {
    type: String,
    default: '',
    required: 'Order description is required',
    trim: true
  },
  email: {
    type: String,
    required: 'Email is required',
    trim: true
  },
  shippingAddr: {
    type: {
      name: {
        type: String,
        required: 'Full name is required'
      },
      street: {
        type: String,
        required: 'Street is required'
      },
      roomNum: {
        type: String,
        required: 'Room number is required'
      },
      city: {
        type: String,
        required: 'City is required'
      },
      zipcode: {
        type: String,
        required: 'Zipcode is required'
      },
      country: {
        type: String,
        required: 'Country is required'
      }
    },
    required: 'Shipping address is required'
  },
  amount: {
    type: Number,
    required: 'Amount is required'
  },
  quantity: {
    type: Number,
    required: 'Quantity is required'
  },
  unit: {
    type: String,
    required: 'Unit is required'
  },
  payment: {
    type: Schema.Types.Mixed,
    required: 'Payment info is required'
  }
}, {autoIndex: false});

mongoose.model('Order', OrderSchema);
