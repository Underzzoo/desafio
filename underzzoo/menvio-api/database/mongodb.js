'use strict'
const mongoose = require('mongoose')
const config = require('../config/database')

mongoose.connect(config.module + '://' + config.host + '/' + config.database)
const connection = mongoose.connection
connection.on('open', () => {
  console.log('Conexão com o banco de dados estabelecida')
})
