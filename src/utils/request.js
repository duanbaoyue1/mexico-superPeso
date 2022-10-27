import axios from 'axios';
import store from '@/store';
import { Toast } from 'vant';
// 根据环境不同引入不同api地址
import { baseApi } from '@/config';
import { param2Obj } from '@/utils/index';
import cookieFun from './cookieFun';

// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// request拦截器 request interceptor
service.interceptors.request.use(
  (config) => {
    // 处理通用字段传输
    let params = param2Obj(location.href);
    let token = (cookieFun.getCookie('login_token') || '').replace(/"/g, '');
    // 财联社token从url中获取，舞阳从cookie中
    token = params.wy == 1 ? token: params.token;
    let url = config.url;
    if (url.indexOf('?') != -1) {
      url += '&';
    } else {
      url += '?';
    }
    url += `os=${params.os || ''}&appType=${params.wy == 1 ? 'clswy' : 'clsmain'}&token=${token || ''}&strategyType=${params.type || ''}&productId=${params.proId || ''}`;
    config.url = url;
    if (store.getters.token) {
      config.headers['authorization'] = store.getters.token;
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      return Promise.reject(res || 'error');
    } else {
      return Promise.resolve(res);
    }
  },
  (error) => {
    console.log('err' + error); // for debug
    return Promise.reject(error);
  }
);

export default service;
