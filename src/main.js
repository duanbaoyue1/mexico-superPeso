import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import http from './http';
import request from '@/utils/request';
Vue.prototype.$http = request;

import '../public/style/common.css';
import './plugins/element.js';
Vue.config.productionTip = false;
// Vue.prototype.$http = http

import fullPageVideo from 'vue-full-page-video';
Vue.use(fullPageVideo);

// 注册全局mixins
import global from '@/mixins/global';
Vue.mixin(global);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
