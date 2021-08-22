import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
