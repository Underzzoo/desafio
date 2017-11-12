'use strict'

const mongoose = require('mongoose')

const _schema = mongoose.Schema({
  source: String,
  destiny: String,
  value: Number
})

module.exports = mongoose.model('Sources', _schema, 'sources')
