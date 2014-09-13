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
    type: [{name: {type: String},
            description: {type: String},
            baseCost: {type: Number},
            unit: {type: {type: String,
                          enum: ['RMB', 'SEK', 'USD']}},
            colors: {type: [{title: {type: String}},
                            {style: {type: String}}]}
           }]
  },
  frontImageUrl: {
    type: String // URL
  },
  backImageUrl: {
    type: String // URL
  }
});

mongoose.model('Tshirt', TshirtSchema);
