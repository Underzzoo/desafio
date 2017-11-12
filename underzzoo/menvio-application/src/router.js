import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from './components/Main.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'Main',
      path: '/',
      component: Main
    }
  ]
})
