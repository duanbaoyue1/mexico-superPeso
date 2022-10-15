import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import request from '@/utils/request';
Vue.prototype.$http = request;
import cookieFun from "./utils/cookieFun.js" // 封装cookieFun的js
import 'amfe-flexible';
// 封装cookie的 js
Vue.prototype.$cookieFun = cookieFun;
import '../public/style/common.css';
import './plugins/element.js';
Vue.config.productionTip = false;

import fullPageVideo from '@/components/vue-full-video';
Vue.use(fullPageVideo);

// 注册全局mixins
import global from '@/mixins/global';
Vue.mixin(global);
import Vconsole from 'vconsole'

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV == 'development') {
  let vConsole = new Vconsole()
  Vue.use(vConsole)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

