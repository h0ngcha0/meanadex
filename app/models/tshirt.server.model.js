'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  variants: {
    type: [
      {
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
          required: 'variant baseCost is required'
        },
        unit: {
          type: String,
          default: 'SEK'
        },
        colors: {
          type: String,
          default: 'black'
        }
      }
    ],
    required: 'At least have one tshirt variants'
  },
  frontImageUrl: {
    type: String,
    default: 'modules/designer/img/canvas/crew_front.png',
    required: 'front image url required'
  },
  backImageUrl: {
    type: String,
    default: 'modules/designer/img/canvas/crew_back.png',
    required: 'back image url required'
  }
});

mongoose.model('Tshirt', TshirtSchema);
