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
        //colors: {
        //  type: [
        //    {
        //      title: {
        //        type: String,
        //        required: 'color title is required'
        //      }
        //    },
        //    {
        //      style: {
        //        type: String,
        //        required: 'color style is required'
        //      }
        //    }
        //  ],
        //  required: 'variant colors is required',
        //  default: []
        //}
        colors: {
          type: String,
          default: "black"
        }
      }
    ],
    required: 'At least have one tshirt variants'
  },
  frontImageUrl: {
    type: String, // URL
    required: 'front image url required'
  },
  backImageUrl: {
    type: String, // URL
    required: 'back image url required'
  }
});

mongoose.model('Tshirt', TshirtSchema);
