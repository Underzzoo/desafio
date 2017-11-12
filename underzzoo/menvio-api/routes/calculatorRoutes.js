'use strict'

const express = require('express')
const router = express.Router()
const Actions = require('../controllers/calculatorController')

const Routes = [
  {method: 'post', path: '/calculator', action: Actions.calculator},
  {method: 'get', path: '/cities/:cep', action: Actions.cities}
]

Routes.forEach((route, index) => {
  router[route.method](route.path, route.action)
})

module.exports = router
