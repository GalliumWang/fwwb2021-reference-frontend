import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './plugins/dark.js';
import * as d3 from 'd3';
import echarts from 'echarts';
import 'leaflet/dist/leaflet.css';
import store from './store';
Vue.prototype.$http = axios;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-fromurlencodeed';
Vue.prototype.$d3 = d3;
window.d3 = d3;

Vue.prototype.$echarts = echarts;
// import './assets/css/index.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
