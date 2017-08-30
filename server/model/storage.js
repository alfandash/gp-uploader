'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const storageSchema = new mongoose.Schema({
  id_user: [{type: Schema.ObjectId, ref: 'user'}],
  link_file: {type: String},
  created_at: {type: Date, default: new Date()},
  updated_at: {type: Date, default: new Date()}
})

var Storage = mongoose.model('storage', storageSchema);

module.exports = Storage
