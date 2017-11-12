<template lang="html">

  <div>
    <b-row class="text-left">
      <b-col sm="12" md="4">
        <!-- <b-form> -->
        <b-card title="Origem | Destino" style="margin: 1em 0;">
          <b-form-group id="exampleInputGroup3" label="Tipo de Serviço" label-for="service">
            <b-form-select id="service" :options="services" required v-model="shipment.service"></b-form-select>
          </b-form-group>

          <b-form-group label="Origem *" label-for="origin">
            <b-form-input :class="($v.shipment.origin.$invalid && $v.shipment.origin.$error) ? 'is-invalid' : ''" id="origin" type="text" v-model="shipment.origin" required placeholder="Informe o CEP de origem"></b-form-input>
            <small id="originHelp" class="form-text text-muted">Informe apenas números.</small>
            <div v-if="$v.shipment.origin.$error" class="invalid-feedback">
              Campo Obrigatório. (mín: 8 - max: 8)
            </div>
          </b-form-group>

          <b-form-group label="Destino *" label-for="destiny">
            <b-form-input :class="($v.shipment.destiny.$invalid && $v.shipment.destiny.$error) ? 'is-invalid' : ''" id="destiny" type="text" v-model="shipment.destiny" required placeholder="Informe o CEP de destino"></b-form-input>
            <small id="destinyHelp" class="form-text text-muted">Informe apenas números.</small>
            <div v-if="$v.shipment.destiny.$error" class="invalid-feedback">
              Campo Obrigatório. (mín: 8 - max: 8)
            </div>
          </b-form-group>
        </b-card>
        <!-- </b-form> -->
      </b-col>
      <b-col sm="12" md="4">
        <b-card title="Dados do Pacote" style="margin: 1em 0;">
          <b-form-group label="Altura (cm) *" label-for="height">
            <b-form-input :class="($v.shipment.oHeight.$invalid && $v.shipment.oHeight.$error) ? 'is-invalid' : ''" id="height" type="number" v-model="shipment.oHeight" required placeholder="Informe a altura do pacote" min="2" max="105"></b-form-input>
            <small id="heightHelp" class="form-text text-muted">* (min: 2 - max: 105)</small>
            <div v-if="$v.shipment.oHeight.$error" class="invalid-feedback">
              Campo Obrigatório. (min: 2 - max: 105)
            </div>
          </b-form-group>

          <b-form-group label="Largura (cm) *" label-for="width">
            <b-form-input :class="($v.shipment.oWidth.$invalid && $v.shipment.oWidth.$error) ? 'is-invalid' : ''" id="width" type="number" v-model="shipment.oWidth" required placeholder="Informe a largura do pacote"></b-form-input>
            <small id="widthHelp" class="form-text text-muted">* (min: 11 - max: 105)</small>
            <div v-if="$v.shipment.oWidth.$error" class="invalid-feedback">
              Campo Obrigatório. (min: 11 - max: 105)
            </div>
          </b-form-group>

          <b-form-group label="Comprimento (cm) *" label-for="length">
            <b-form-input :class="($v.shipment.oHeight.$invalid && $v.shipment.oLength.$error) ? 'is-invalid' : ''" id="length" type="number" v-model="shipment.oLength" required placeholder="Informe o comprimento do pacote"></b-form-input>
            <small id="lengthHelp" class="form-text text-muted">* (min: 16 - max: 105)</small>
            <div v-if="$v.shipment.oLength.$error" class="invalid-feedback">
              Campo Obrigatório. ()
            </div>
          </b-form-group>

          <b-form-group label="Peso (gr) *" label-for="weight">
            <b-form-input :class="($v.shipment.weight.$invalid && $v.shipment.weight.$error) ? 'is-invalid' : ''" id="weight" type="text" v-model="shipment.weight" placeholder="Informe o peso aproximado"></b-form-input>
            <small id="weightHelp" class="form-text text-muted">* (min: 1000 gr - max: 30000 gr)</small>
            <div v-if="$v.shipment.weight.$error" class="invalid-feedback">
              Campo Obrigatório. (min: 1000 gr - max: 30000 gr)
            </div>
          </b-form-group>
        </b-card>
      </b-col>
      <b-col sm="12" md="4">
        <b-card title="Serviços Adicionais" style="margin: 1em 0;">
          <b-form-checkbox id="delivery" v-model="shipment.delivery">
            Aviso de Recebimento
          </b-form-checkbox>

          <b-form-checkbox id="receipt" v-model="shipment.receipt">
            Mão Própria
          </b-form-checkbox>

          <br>

          <b-form-checkbox id="security" v-model="security">
            Seguro
          </b-form-checkbox>

          <b-form-group v-if="security" label="Valor" label-for="extimate">
            <!-- <money v-model="shipment.extimate" v-bind="money"/> -->
            <b-form-input id="extimate" type="text" v-money="moneyConfig" v-model="shipment.extimate" required placeholder="Informe o valor aproximado do produto"></b-form-input>
          </b-form-group>
        </b-card>

        <div class="float-right">
          <b-button variant="success" size="lg" @click="confirm">Calcular Frete</b-button>
        </div>
      </b-col>
    </b-row>

    <b-modal ref="shipmentm" size="lg" hide-footer title="Dados do Frete">

      <b-row class="text-center">
        <b-col>
          <h4>Origem</h4>
          <h2 v-if="informations.cities">{{ informations.cities.origin.cidade }}</h2>
        </b-col>
        <b-col>
          <i class="mdi mdi-truck-delivery" style="font-size: 5em"></i>
        </b-col>
        <b-col>
          <h4>Destino</h4>
          <h2 v-if="informations.cities">{{ informations.cities.destiny.cidade }}</h2>
        </b-col>
      </b-row>

      <hr>
      <b-row style="margin-top: 1em; font-size: 1.3em">
        <b-col>
          <h4>Informações Gerais</h4>
          <ul class="list-unstyled">
            <li v-if="informations.type">Tipo de Serviço: <strong>{{ informations.type }}</strong> </li>
            <li v-if="informations.price">Valor do Frete: <strong>R$ {{ parseFloat(informations.price).toFixed(2) }}</strong> </li>
          </ul>
        </b-col>
        <b-col>
          <h4 v-if="informations.oSecurity || informations.preciousObject || informations.delivery || informations.receipt">Informações Adicionais</h4>
          <ul class="list-unstyled">
            <li v-if="informations.oSecurity">Seguro: <strong>R$ {{ parseFloat(informations.oSecurity).toFixed(2) }} </strong> </li>
            <li v-if="informations.preciousObject">Carga Valiosa: <strong>R$ {{ parseFloat(informations.preciousObject).toFixed(2) }} </strong> </li>
            <li v-if="informations.delivery">Aviso de Recebimento: <strong>R$ {{ parseFloat(informations.delivery).toFixed(2) }}</strong> </li>
            <li v-if="informations.receipt">Mão Própria: <strong>R$ {{ informations.receipt.toFixed(2) }}</strong> </li>
          </ul>
        </b-col>
      </b-row>

      <b-row style="margin-top: 1em">
        <b-col class="text-center">
          <h3 v-if="informations.total">Total: <strong>R$ {{ parseFloat(informations.total).toFixed(2) }}</strong> </h3>
        </b-col>
      </b-row>

      <b-btn class="mt-3 " variant="outline-danger" block @click="$refs.shipmentm.hide()">Fechar</b-btn>
    </b-modal>

    <b-modal ref="errorm" hide-footer title="Ops! Ocorreu um erro!">
      {{ error }}
      <b-btn class="mt-3 " variant="outline-danger" block @click="$refs.errorm.hide()">Fechar</b-btn>
    </b-modal>

  </div>
</template>

<script>
// @ Implementar VUELIDATE
// @ Implementar buscar cidade
// @ Pensar em uma forma de calcular o prazo

import {
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  numeric
} from 'vuelidate/lib/validators'

export default {
  // components: {
  //   Money
  // },
  data: () => {
    return {
      shipment: {
        origin: '',
        destiny: '',
        weight: '',
        oWidth: '',
        oHeight: '',
        oLength: '',
        service: 'express',
        delivery: false,
        receipt: false,
        extimate: ''
      },
      services: [
        { text:'Econômico', value: 'economic' },
        { text:'Expresso', value: 'express' }
      ],
      moneyConfig: {
        // The character used to show the decimal place.
        decimal: ',',
        // The character used to separate numbers in groups of three.
        thousands: '.',
        // The currency name or symbol followed by a space.
        prefix: '',
        // The suffix (If a suffix is used by the target currency.)
        suffix: '',
        // Level of decimal precision. REQUIRED
        precision: 2,
        // If mask is false, outputs the number to the model. Otherwise outputs the masked string.
        masked: false
      },
      informations: {},
      error: '',
      security: false
    }
  },
  methods: {
    confirm () {
      this.$v.shipment.$touch()
      if (!this.$v.shipment.$error) {
        if (!this.security) {
          this.shipment.extimate = 0
        }
        this.$http.post('http://localhost:3000/v1/calculator', this.shipment).then((response) => {
          this.informations = response.data
          this.$refs.shipmentm.show()
        }).catch((err) => {
          this.error = err.response.data.err
          this.$refs.errorm.show()
        })
      }
    }
  },
  validations: {
    shipment: {
      origin: {
        required,
        numeric,
        minLength: minLength(8),
        maxLength: maxLength(8)
      },
      destiny: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(8),
        numeric
      },
      weight: {
        required,
        numeric,
        maxValue: maxValue(30000),
        minValue: minValue(1000)
      },
      oWidth: {
        required,
        numeric,
        maxValue: maxValue(105),
        minValue: minValue(11)
      },
      oHeight: {
        required,
        numeric,
        maxValue: maxValue(105),
        minValue: minValue(2)
      },
      oLength: {
        required,
        numeric,
        maxValue: maxValue(105),
        minValue: minValue(16)
      }
    }
  },
}

</script>

<style>
</style>
