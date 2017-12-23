'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var WashSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

module.exports = mongoose.model('Wash', WashSchema);
