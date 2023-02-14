import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import request from '@/utils/request';
Vue.prototype.$http = request;
import cookieFun from './utils/cookieFun.js'; // 封装cookieFun的js
import 'amfe-flexible';

import mIcon from '@/components/m-icon.vue';
Vue.component('m-icon', mIcon);

// Vue.prototype.$cookieFun = cookieFun;
// import '../public/style/common.scss';
import './plugins/element.js';
Vue.config.productionTip = false;

import toast from '@/components/toast';
Vue.use(toast);
import loading from '@/components/loading';
Vue.use(loading);


import MessageBox from '@/components/message-box';
Vue.component('message-box', MessageBox);

import fullPageVideo from '@/components/vue-full-video';
Vue.use(fullPageVideo);

// 注册全局mixins
import global from '@/mixins/global';
Vue.mixin(global);
import Vconsole from 'vconsole';

// if (process.env.NODE_ENV != 'production') {
//   let vConsole = new Vconsole();
//   Vue.use(vConsole);
// }

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
