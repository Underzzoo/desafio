import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import Vuex from 'vuex'
import axios from 'axios'
import Vuelidate from 'vuelidate'
import router from './router'
import money from 'v-money'

// register directive v-money and component <money>
Vue.use(money)

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.use(BootstrapVue)
Vue.use(Vuex)
Vue.use(Vuelidate)

Vue.prototype.$http = axios

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
