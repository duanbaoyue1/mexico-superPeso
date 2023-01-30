import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    messageBox: {
      show: false,
      messageInfo: {},
    },
    appGlobal: {
      apiPrefix: 'http://test.paisago.in',
      // apiPrefix: '/',
      appName: 'paisaGo',
      // token: '63ad4768e4b00789dc15b349',
      token: '63d76749e4b082c736280b88',
      // token: '63aead1ee4b0b4f694f1a607',
      debug: '', // 是否调试模式
      mobileType: '2', // 手机类型
      appVersion: 1000, // app版本号
      afId: '', // afid
      gaId: '', // gaid
      gpsAddress: '', // gps地址
      channelCode: 'google', // 渠道号
      gps: '', // gps坐标
      appVersionV: '', // 带v1.1.1 这种格式的版本号
    },
    userInfo: {},
    isAppChecked: true, // 是否已经较验在app中
  },
  mutations: {
    setAppGlobal(state, data) {
      state.appGlobal = {
        ...state.appGlobal,
        ...data,
      };
      localStorage.setItem('app-local', JSON.stringify(state.appGlobal));
    },
    showMessageBox(state, data) {
      state.messageBox = {
        show: true,
        messageInfo: data,
      };
    },
    hideMessageBox(state, data) {
      state.messageBox = {
        show: false,
        messageInfo: state.messageBox.messageInfo,
      };
    },
    setUserInfo(state, data) {
      state.userInfo = {
        ...state.userInfo,
        ...data,
      };
    },
    setAppChecked(state, data) {
      sessionStorage.setItem('app-checked', true);
      state.isAppChecked = data;
    },
  },
  getters: {
    appGlobal: (state) => state.appGlobal,
    userInfo: (state) => state.userInfo,
    isAppChecked: (state) => state.isAppChecked,
  },
  actions: {
    async setAppGlobal({ commit }, data) {
      commit('setAppGlobal', data);
    },
    async showMessageBox({ commit }, data) {
      commit('showMessageBox', data);
    },
    async hideMessageBox({ commit }, data) {
      commit('hideMessageBox', data);
    },
    async setUserInfo({ commit }, data) {
      commit('setAppGlobal', data);
    },
    async setAppChecked({ commit }, data) {
      commit('setAppChecked', data);
    },
    async updateToken({ commit }, token) {
      console.log('update token', token);
      commit('setAppGlobal', { token });
    },
  },
  modules: {},
});
