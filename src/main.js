import Vue from 'vue';
import App from './App.vue';
import dayjs from './plugins/dayjs';
import snackbar from './plugins/snackbar';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

Vue.config.productionTip = false
Vue.use(snackbar, { store })

new Vue({
  router,
  store,
  vuetify,
  dayjs,
  render: h => h(App)
}).$mount('#app')
