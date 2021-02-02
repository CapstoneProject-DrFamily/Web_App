import Vue from 'vue'
import App from './App.vue'
import { router } from './helpers/router'
import vuetify from './plugins/vuetify';
import { store } from './store/store';
import AxiosPlugin from 'vue-axios-cors';
import loading from 'vuejs-loading-screen';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.use(AxiosPlugin);
Vue.use(loading, {
  bg: '#ADD8E6ad',
  icon: 'spinner',
  size: 3,
  icon_color: 'white',
})