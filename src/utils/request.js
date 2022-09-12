import axios from 'axios';
import store from '@/store';
import { Toast } from 'vant';
// 根据环境不同引入不同api地址
import { baseApi } from '@/config';
console.log(baseApi);

// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 8000 // request timeout
  // headers: {
  //   'Content-Type': 'application/json',
  //   authorization: 'Basic MTc2MDA6MjBkZTcyNDEzNGMzM2Y5MzRlOWFiODUwODk1NjI0MDM3MDkyNTE0N2Y4ZGE1YTYwMWI2YTgxYWY2NTFmMjY1Yw=='
  // }
});

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['authorization'] = store.getters.token;
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      return Promise.reject(res || 'error');
    } else {
      return Promise.resolve(res);
    }
  },
  error => {
    console.log('err' + error); // for debug
    return Promise.reject(error);
  }
);

export default service;
