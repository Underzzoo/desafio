'use strict'

const mongoose = require('mongoose')
const cotationsModel = require('../models/cotationsModel')
const Actions = {}

Actions.retrieve = (req, res) => {
  if (req.body) {
    cotationsModel.findOne(req.body, (err, data) => {
      if (err) res.status(400).send({'err': err})
      res.status(200).send(data)
    })
  }
}

module.exports = Actions
