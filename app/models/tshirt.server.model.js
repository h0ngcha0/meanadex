'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    mongoosePages = require('mongoose-pages'),
    Schema = mongoose.Schema;

var VariantSchema = new Schema({
  name: {
    type: String,
    required: 'variant name is required'
  },
  description: {
    type: String,
    required: 'variant description is required'
  },
  baseCost: {
    type: Number,
    required: 'variant baseCost is required',
    min: [0, 'Base cost must be more than 0']
  },
  currency: {
    type: String,
    enum: ['SEK', 'RMB', 'USD'],
    default: 'SEK'
  },
  colors: {
    type: [
      {
        type: String,
        default: 'black'
      }
    ]
  }
});

/**
 * Tshirt Schema
 */
var TshirtSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Tshirt name',
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  variants: {
    type: [VariantSchema],
    required: 'At least have one tshirt variants'
  },
  frontImage: {
    type: Schema.ObjectId,
    ref: 'Image',
    required: 'front image'
  },
  backImage: {
    type: Schema.ObjectId,
    ref: 'Image',
    required: 'back image'
  }
});

mongoosePages.anchor(TshirtSchema);
mongoose.model('Tshirt', TshirtSchema);
