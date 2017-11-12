'use strict'

const mongoose = require('mongoose')

const _schema = mongoose.Schema({
  minimum: Number,
  maximum: Number,
  type: String,
  price: Number,
  service: String
})

module.exports = mongoose.model('Cotations', _schema, 'cotations')
