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
      // https://pro.easy--money.com
      // apiPrefix: 'http://test.easy--money.com',
      apiPrefix: 'http://test.fin-handycash.com',
      appName: 'handyCash',
      token: '63fdfd55e4b0f6a603fac657',
      debug: '', // 是否调试模式
      mobileType: '2', // 手机类型
      appVersion: 1000, // app版本号
      userId: '75755981f9241f8e181921d7d4347c94', // 用户id
      afId: '', // afid
      gaId: '', // gaid
      gpsAddress: '', // gps地址
      channelCode: 'google', // 渠道号
      androidId: '',
      gps: '', // gps坐标
      appVersionV: '1.0.0', // 带1.1.1 这种格式的版本号
      StatusBarHeight: 60, //app Height高度
    },
    tabBar: {
      show: true,
      title: '',
      transparent: false,
      fixed: false,
      backCallback: null,
    },
    appMode: {},
    userInfo: {},
    isAppChecked: true, // 是否已经较验在app中
  },
  mutations: {
    setAppGlobal(state, data) {
      state.appGlobal = {
        ...state.appGlobal,
        ...data,
      };
      console.log(state.appGlobal);
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
    setTabBar(state, data) {
      state.tabBar = {
        ...state.tabBar,
        ...data,
      };
      console.log('setTabBar', data, state.tabBar);
    },
    setAppMode(state, data) {
      state.appMode = data;
    },
  },
  getters: {
    appGlobal: state => state.appGlobal,
    userInfo: state => state.userInfo,
    isAppChecked: state => state.isAppChecked,
    tabBar: state => state.tabBar,
    appMode: state => state.appMode,
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
    async updateToken({ commit }, data) {
      console.log('update token', data);
      commit('setAppGlobal', data);
    },
    async setTabBar({ commit }, tabBar) {
      commit('setTabBar', tabBar);
    },
    async setAppMode({ commit }, appMode) {
      commit('setAppMode', appMode);
    },
  },
  modules: {},
});
