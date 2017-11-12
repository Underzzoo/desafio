'use strict'

// @ Implementar Calculo de Peso Cubico
// @ Implementar Calculo de seguro
// @ Implementar buscar cidade

const mongoose = require('mongoose')
const cotationsModel = require('../models/cotationsModel')
const sourcesModel = require('../models/sourcesModel')
const request = require('request')
const capitais = require('../statics/capitais')
const Actions = {}

// @ Consulta a API externa para buscar os dados da cidade.
let getCity = (source) => {
  return new Promise((resolve, reject) => {
    request.get('https://location.melhorenvio.com.br/' + source, (error, response, body) => {
      if (error) {
        return error
      }
      return resolve(body)
    })
  })
}

// @ Retorna os dados das cidades, além do código da tabela matriz origem-destino
let generateShipment = (origin, destiny, callback) => {
  Promise.all([getCity(origin), getCity(destiny)]).then((data) => {
    let cities = {
      'origin': JSON.parse(data[0]),
      'destiny': JSON.parse(data[1])
    }

    let key = ''
    let sourceCode = ''


    // @ Frete Local
    if (cities.origin.cep === cities.destiny.cep) {
      key = 'L'
    }
    // @ Frete Estadual | Capital | Interestadual
    else {
      // @ Estadual
      if (cities.origin.uf === cities.destiny.uf && cities.origin.cidade !== cities.destiny.cidade) {
        key = 'E'
      }
      // @ Capital
      else if (capitais.indexOf(cities.origin.cidade) !== -1 && capitais.indexOf(cities.destiny.cidade) !== -1) {
        key = 'N'
      }
      // @ Interestadual
      else {
        key = 'I'
      }
    }

    sourcesModel.findOne({source: cities.origin.uf, destiny: cities.destiny.uf}, (err, data) => {
      if (err) {
        console.log(err)
      }
      sourceCode = data.value
      callback({'cities': cities, 'source': key + sourceCode})
    })
  })
}

const getCotations = (body, shipment, volumeWeight, callback) => {
  let query
  let item
  let finalWeight

  body.weight = (body.weight) ? parseInt(body.weight) : 0

  if (volumeWeight > body.weight) {
    finalWeight = volumeWeight
  }
  else {
    finalWeight = (body.weight) ? body.weight : 0
  }

  if (finalWeight > 10000) {
    query = {
      $or: [
        {
          service: body.service,
          maximum: {$eq: 10000},
          type: shipment
        },
        {
          service: body.service,
          minimum: {$eq: 999999},
          type: shipment
        }
      ]
    }
  }
  else {
    query = {
      service: body.service,
      maximum: {$gte: finalWeight},
      minimum: {$lte: finalWeight},
      type: shipment
    }
  }

  cotationsModel.find(query, (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      if (data) {
        if (data.length > 1) {
          let exceed = Math.ceil((finalWeight / 1000)) - 10
          //  @ Pega o valor do segundo registro consultado para realizar a multiplicação.
          exceed = data[1].price * exceed

          //  @ Gambiarras deveriam somar ponto ! :P
          item = JSON.parse(JSON.stringify(data[0]))

          item.weight = body.weight
          item.volumeWeight = volumeWeight
          item.price += exceed
          item.total = item.price
          item.exceed = exceed
          callback(item)
        }
        else {
          item = JSON.parse(JSON.stringify(data[0]))
          item.weight = weight
          item.volumeWeight = volumeWeight
          item.total = item.price
          item.total = item.price
          item.exceed = 0
          callback(item)
        }
      }
    }
  })
}


Actions.calculator = (req, res) => {
  if (
    req.body.origin &&
    req.body.destiny &&
    req.body.service &&
    req.body.weight &&
    req.body.oWidth &&
    req.body.oHeight &&
    req.body.oLength) {

    // @ Testa se os valores informados são menores do que o mínimo permitido.
    if (req.body.oWidth < 11 || req.body.oHeight < 2 || req.body.oLength < 16 || req.body.weight < 1) {
      //
      res.status(400).send({err: 'Os valores informados são menores do que os valores mínimos.'})
    }

    // @ Testa se os valores informados são maiores do que o máximo permitido.
    else if (req.body.oWidth > 105 || req.body.oHeight > 105 || req.body.oLength > 105 || req.body.weight > 30000) {
      //
      res.status(400).send({err: 'Os valores informados são maiores do que os valores mínimos.'})
    }

    // @ Prossegue com o calculo do frete
    else {
      let cities

      //  Realiza o cálculo do peso volume
      let volumeWeight = parseInt(req.body.oWidth) * parseInt(req.body.oHeight) * parseInt(req.body.oLength)
      volumeWeight = (volumeWeight / 6000)
      volumeWeight = Math.ceil(volumeWeight) * 1000 //  @ Arredonda o valor para cima.

      //  @ Realiza a busca das cidades de destino e origem, trazendo as mesmas e o código de da tabela MATRIZ ORIGEM DESTINO.
      generateShipment(req.body.origin, req.body.destiny, (shipment) => {
        cities = shipment.cities  //  @ Popula a variável cities, declarada acima.

        // @ Realiza o tratamento de informações caso o frete seja local, de modo econômico. L# indisponível na tabela economic.
        if (req.body.service === 'economic' && shipment.source.indexOf('L') !== -1) {
          res.status(400).send({err: 'Serviço econômico indisponível para fretes locais.'})
        }

        // @ Segue com o cálculo do frete, desta vez, buscando valores na tabela de cotações
        else {
          getCotations(req.body, shipment.source, volumeWeight, (cotation) => {
            cotation.cities = cities //  @ Adiciona esse campo ao retorno do callback.

            // @ AR - Aviso de Recebimento
            if (req.body.delivery) {
              let ar = (cotation.total / 100) * 5
              ar = parseFloat(ar.toFixed(2))
              cotation.delivery = ar
              cotation.total += ar
            }

            // @ Mão Própria
            if (req.body.receipt) {
              let receipt = parseFloat(3)
              cotation.receipt = receipt
              cotation.total += receipt
            }

            // @ Carga Valiosa
            if (req.body.extimate) {
              // @ -------------------------------------------------------------
              //  GAMBIARRA WARNING - (Na falta de tempo, vai na gambi mesmo)
              // @ -------------------------------------------------------------
              let extimate = req.body.extimate.split(',')
              let money = extimate[0].replace(/\./g, '')
              let cents = extimate[1]
              extimate = money + '.' + cents
              // @ -------------------------------------------------------------

              let security = (extimate / 100)
              let preciousObject = parseInt(extimate / (cotation.weight / 1000))
              if (preciousObject >= 3000) {
                cotation.preciousObject = (extimate / 100)
                cotation.total += (extimate / 100)
              }
              cotation.oSecurity = (extimate / 100)
              cotation.total += security
            }

            res.status(200).send(cotation)
          })
        }
      })
    }
  }
  else {
    res.status(400).send({err: 'Você precisa informar todos os campos necessários.'})
  }
}

Actions.cities = (req, res) => {
  request.get('https://location.melhorenvio.com.br/' + req.params.cep, (err, response) => {
    if (err) {
      return err
    }
    res.status(200).send(JSON.parse(response.body))
  })
}

module.exports = Actions
