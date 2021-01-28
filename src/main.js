import Vue from 'vue';
import App from './App.vue';
import dayjs from './plugins/dayjs';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  dayjs,
  render: h => h(App)
}).$mount('#app')
