'use strict'

const express = require('express')
const router = express.Router()
const Actions = require('../controllers/cotationsController')

const Routes = [
  {method: 'post', path: '/', action: Actions.retrieve}
]

Routes.forEach((route, index) => {
  router[route.method](route.path, route.action)
})

module.exports = router
