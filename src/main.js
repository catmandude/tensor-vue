import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.use(Chartkick.use(Chart))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
